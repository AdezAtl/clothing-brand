import { NextRequest, NextResponse } from "next/server";
import { verifyBachsWebhookSignature, BachsWebhookEvent } from "@/lib/payments/bachs";
import { db } from "@/db";
import { orders, orderItems, productVariants } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { updateOrderStatus, updateVariantStock } from "@/db/store";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-bachs-signature") || req.headers.get("bachs-signature");

    // Verify HMAC-SHA256 signature
    const isValid = verifyBachsWebhookSignature(rawBody, signature);
    if (!isValid && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
    }

    const payload: BachsWebhookEvent = JSON.parse(rawBody);

    if (payload.event !== "payment.success") {
      return NextResponse.json({ received: true, ignored: payload.event });
    }

    const reference = payload.data.reference;

    // Execute in transaction for idempotency and atomic stock deduction
    try {
      await db.transaction(async (tx) => {
        // Query order by bachsReference
        const [existingOrder] = await tx
          .select()
          .from(orders)
          .where(eq(orders.bachsReference, reference))
          .for("update");

        if (!existingOrder) {
          console.warn(`Order not found for Bachs reference ${reference}`);
          return;
        }

        // Idempotency check: if already paid, exit early
        if (existingOrder.paymentStatus === "paid") {
          return;
        }

        // Fetch ordered items
        const items = await tx
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, existingOrder.id));

        // Atomically decrement stock
        for (const item of items) {
          if (item.variantId) {
            await tx
              .update(productVariants)
              .set({
                stockQuantity: sql`GREATEST(0, ${productVariants.stockQuantity} - ${item.quantity})`,
                updatedAt: new Date(),
              })
              .where(eq(productVariants.id, item.variantId));
          }
        }

        // Update order status
        await tx
          .update(orders)
          .set({
            paymentStatus: "paid",
            fulfillmentStatus: "processing",
          })
          .where(eq(orders.id, existingOrder.id));
      });
    } catch (dbErr) {
      console.warn("DB webhook processing bypassed or DB unreachable, using store fallback:", dbErr);
      await updateOrderStatus(reference, {
        paymentStatus: "paid",
        fulfillmentStatus: "processing",
      });
    }

    return NextResponse.json({ status: "success", reference });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: error.message || "Webhook handling failed" },
      { status: 500 }
    );
  }
}

