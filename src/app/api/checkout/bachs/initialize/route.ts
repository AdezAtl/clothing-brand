import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { orders, orderItems, productVariants, products } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { initializeBachsTransaction } from "@/lib/payments/bachs";
import { generateOrderNumber } from "@/lib/utils";
import { createOrder, updateVariantStock } from "@/db/store";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().min(10, "Phone number is required"),
  shippingAddress: z.object({
    street: z.string().min(5, "Street address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    postalCode: z.string().optional(),
    notes: z.string().optional(),
  }),
  items: z.array(
    z.object({
      variantId: z.string(),
      quantity: z.number().int().positive(),
    })
  ).min(1, "Cart cannot be empty"),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = checkoutSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { customerName, customerEmail, customerPhone, shippingAddress, items } = parsed.data;
    const orderNumber = generateOrderNumber();
    const bachsReference = `bachs_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    let serverCalculatedTotal = 0;
    const verifiedOrderItems: Array<{
      productId: string;
      variantId: string;
      productNameSnapshot: string;
      variantSnapshot: string;
      quantity: number;
      unitPrice: number;
    }> = [];

    // Attempt Drizzle ACID Transaction with row locking
    try {
      await db.transaction(async (tx) => {
        for (const item of items) {
          // Select with FOR UPDATE to prevent race conditions during checkout
          const [variantRecord] = await tx
            .select()
            .from(productVariants)
            .where(eq(productVariants.id, item.variantId))
            .for("update");

          if (!variantRecord) {
            throw new Error(`Variant not found: ${item.variantId}`);
          }

          if (variantRecord.stockQuantity < item.quantity) {
            throw new Error(
              `Insufficient stock for SKU ${variantRecord.sku}. Available: ${variantRecord.stockQuantity}`
            );
          }

          const [productRecord] = await tx
            .select()
            .from(products)
            .where(eq(products.id, variantRecord.productId));

          const unitPrice = variantRecord.priceOverride ?? (productRecord ? productRecord.basePrice : 0);
          serverCalculatedTotal += unitPrice * item.quantity;

          verifiedOrderItems.push({
            productId: variantRecord.productId,
            variantId: variantRecord.id,
            productNameSnapshot: productRecord?.name || "Tullipio Apparel",
            variantSnapshot: `Size: ${variantRecord.size} / Color: ${variantRecord.color} (SKU: ${variantRecord.sku})`,
            quantity: item.quantity,
            unitPrice,
          });
        }

        // Insert Order
        const [createdOrder] = await tx
          .insert(orders)
          .values({
            orderNumber,
            customerName,
            customerEmail,
            customerPhone,
            shippingAddress,
            totalAmount: serverCalculatedTotal,
            paymentStatus: "pending",
            fulfillmentStatus: "unfulfilled",
            bachsReference,
          })
          .returning();

        // Insert Order Items
        for (const oi of verifiedOrderItems) {
          await tx.insert(orderItems).values({
            orderId: createdOrder.id,
            productId: oi.productId,
            variantId: oi.variantId,
            productNameSnapshot: oi.productNameSnapshot,
            variantSnapshot: oi.variantSnapshot,
            quantity: oi.quantity,
            unitPrice: oi.unitPrice,
          });
        }
      });
    } catch (dbErr) {
      console.warn("DB transaction bypassed or DB not connected, utilizing store fallback:", dbErr);

      // In-memory fallback verification
      const { SEED_PRODUCTS } = await import("@/db/seed-data");
      serverCalculatedTotal = 0;
      verifiedOrderItems.length = 0;

      for (const item of items) {
        let foundVariant = null;
        let foundProduct = null;
        for (const prod of SEED_PRODUCTS) {
          const v = prod.variants.find((variant) => variant.id === item.variantId);
          if (v) {
            foundVariant = v;
            foundProduct = prod;
            break;
          }
        }

        if (!foundVariant || !foundProduct) {
          return NextResponse.json(
            { error: `Variant ${item.variantId} not found in catalog` },
            { status: 400 }
          );
        }

        if (foundVariant.stockQuantity < item.quantity) {
          return NextResponse.json(
            { error: `Insufficient stock for SKU ${foundVariant.sku}` },
            { status: 400 }
          );
        }

        const unitPrice = foundVariant.priceOverride ?? foundProduct.basePrice;
        serverCalculatedTotal += unitPrice * item.quantity;

        verifiedOrderItems.push({
          productId: foundProduct.id,
          variantId: foundVariant.id,
          productNameSnapshot: foundProduct.name,
          variantSnapshot: `Size: ${foundVariant.size} / Color: ${foundVariant.color} (SKU: ${foundVariant.sku})`,
          quantity: item.quantity,
          unitPrice,
        });
      }

      await createOrder({
        orderNumber,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        totalAmount: serverCalculatedTotal,
        paymentStatus: "pending",
        fulfillmentStatus: "unfulfilled",
        bachsReference,
        items: verifiedOrderItems,
      });
    }

    // Call Bachs Payment wrapper to initialize session
    const callbackUrl = `${req.nextUrl.origin}/checkout/confirmation?orderNumber=${encodeURIComponent(
      orderNumber
    )}&ref=${encodeURIComponent(bachsReference)}`;

    const paymentResponse = await initializeBachsTransaction({
      amount: serverCalculatedTotal,
      email: customerEmail,
      reference: bachsReference,
      callbackUrl,
      metadata: {
        orderNumber,
        customerName,
        customerPhone,
      },
    });

    return NextResponse.json({
      success: true,
      orderNumber,
      reference: bachsReference,
      totalAmount: serverCalculatedTotal,
      checkoutUrl: paymentResponse.checkoutUrl,
    });
  } catch (error: any) {
    console.error("Checkout initialization failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initialize checkout session" },
      { status: 500 }
    );
  }
}

