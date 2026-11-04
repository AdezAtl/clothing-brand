import crypto from "crypto";
import { db } from "./index";
import {
  categories,
  products,
  productVariants,
  banners,
  orders,
  orderItems,
} from "./schema";
import { eq, desc, or, sql } from "drizzle-orm";
import {
  SEED_CATEGORIES,
  SEED_PRODUCTS,
  SEED_BANNER,
  SeedProduct,
  SeedCategory,
  SeedBanner,
} from "./seed-data";

// In-memory state for mock resilience
let memCategories: SeedCategory[] = [...SEED_CATEGORIES];
let memProducts: SeedProduct[] = [...SEED_PRODUCTS];
let memBanner: SeedBanner = { ...SEED_BANNER };
let memOrders: any[] = [
  {
    id: "50000000-0000-4000-8000-000000000001",
    orderNumber: "TLP-2026-0041",
    customerName: "Adeyemi Johnson",
    customerEmail: "adeyemi@example.com",
    customerPhone: "0803 123 4567",
    shippingAddress: {
      street: "14 Ring Road",
      city: "Ibadan",
      state: "Oyo State",
    },
    totalAmount: 9500000,
    paymentStatus: "paid",
    fulfillmentStatus: "processing",
    bachsReference: "bachs_ref_demo_0041",
    createdAt: new Date(Date.now() - 3600 * 1000 * 4),
    items: [
      {
        productNameSnapshot: "The Akobo Grand Damask Agbada",
        variantSnapshot: "Size: L / Color: Imperial Emerald",
        quantity: 1,
        unitPrice: 9500000,
      },
    ],
  },
  {
    id: "50000000-0000-4000-8000-000000000002",
    orderNumber: "TLP-2026-0042",
    customerName: "Folake Alabi",
    customerEmail: "folake@example.com",
    customerPhone: "0812 987 6543",
    shippingAddress: {
      street: "Plot 8, Bodija Estate",
      city: "Ibadan",
      state: "Oyo State",
    },
    totalAmount: 7200000,
    paymentStatus: "paid",
    fulfillmentStatus: "unfulfilled",
    bachsReference: "bachs_ref_demo_0042",
    createdAt: new Date(Date.now() - 3600 * 1000 * 1),
    items: [
      {
        productNameSnapshot: "Moremi Sculpted Corset Midi Dress",
        variantSnapshot: "Size: M / Color: Indigo Adire",
        quantity: 1,
        unitPrice: 7200000,
      },
    ],
  },
];

export function getMemProducts() {
  return memProducts;
}

export async function getCategories() {
  try {
    const rows = await db.select().from(categories);
    if (rows && rows.length > 0) return rows;
  } catch {
    // Fall back to memory
  }
  return memCategories;
}

export async function getProducts(options?: {
  categorySlug?: string;
  featured?: boolean;
}) {
  try {
    const rows = await db.query.products.findMany({
      with: {
        category: true,
        variants: true,
      },
      orderBy: [desc(products.createdAt)],
    });
    if (rows && rows.length > 0) {
      let filtered = rows;
      if (options?.categorySlug) {
        filtered = filtered.filter(
          (p: any) => p.category?.slug === options.categorySlug
        );
      }
      if (options?.featured) {
        filtered = filtered.filter((p: any) => p.isFeatured);
      }
      return filtered;
    }
  } catch {
    // Fallback to memory
  }

  let result = memProducts;
  if (options?.categorySlug) {
    const cat = memCategories.find((c) => c.slug === options.categorySlug);
    if (cat) {
      result = result.filter((p) => p.categoryId === cat.id);
    }
  }
  if (options?.featured) {
    result = result.filter((p) => p.isFeatured);
  }
  return result;
}

export async function getProductBySlug(slug: string) {
  try {
    const row = await db.query.products.findFirst({
      where: eq(products.slug, slug),
      with: {
        category: true,
        variants: true,
      },
    });
    if (row) return row;
  } catch {
    // Fallback to memory
  }

  const p = memProducts.find((item) => item.slug === slug);
  if (!p) return null;
  const cat = memCategories.find((c) => c.id === p.categoryId);
  return {
    ...p,
    category: cat || null,
  };
}

export async function getHeroBanner() {
  try {
    const rows = await db
      .select()
      .from(banners)
      .where(eq(banners.isActive, true))
      .limit(1);
    if (rows && rows.length > 0) return rows[0];
  } catch {
    // Fallback
  }
  return memBanner;
}

export async function updateHeroBanner(data: Partial<SeedBanner>) {
  try {
    const existing = await db
      .select()
      .from(banners)
      .where(eq(banners.isActive, true))
      .limit(1);

    if (existing.length > 0) {
      const [updated] = await db
        .update(banners)
        .set({
          title: data.title ?? existing[0].title,
          subtitle: data.subtitle ?? existing[0].subtitle,
          imageUrl: data.imageUrl ?? existing[0].imageUrl,
          ctaText: data.ctaText ?? existing[0].ctaText,
          ctaLink: data.ctaLink ?? existing[0].ctaLink,
        })
        .where(eq(banners.id, existing[0].id))
        .returning();
      if (updated) {
        memBanner = { ...memBanner, ...updated };
        return updated;
      }
    } else if (data.title && data.subtitle && data.imageUrl) {
      const [inserted] = await db
        .insert(banners)
        .values({
          title: data.title,
          subtitle: data.subtitle,
          imageUrl: data.imageUrl,
          ctaText: data.ctaText || "Shop the Collection",
          ctaLink: data.ctaLink || "/shop",
          isActive: true,
        })
        .returning();
      if (inserted) {
        memBanner = { ...memBanner, ...inserted };
        return inserted;
      }
    }
  } catch {
    // Fallback to memory
  }

  memBanner = { ...memBanner, ...data };
  return memBanner;
}

export async function getOrders() {
  try {
    const rows = await db.query.orders.findMany({
      with: {
        items: true,
      },
      orderBy: [desc(orders.createdAt)],
    });
    if (rows && rows.length > 0) return rows;
  } catch {
    // Fallback
  }
  return memOrders;
}

export async function createOrder(orderData: any) {
  const { items = [], ...orderFields } = orderData;

  try {
    const created = await db.transaction(async (tx) => {
      const [insertedOrder] = await tx
        .insert(orders)
        .values(orderFields)
        .returning();

      for (const oi of items) {
        await tx.insert(orderItems).values({
          orderId: insertedOrder.id,
          productId: oi.productId,
          variantId: oi.variantId,
          productNameSnapshot: oi.productNameSnapshot,
          variantSnapshot: oi.variantSnapshot,
          quantity: oi.quantity,
          unitPrice: oi.unitPrice,
        });
      }
      return { ...insertedOrder, items };
    });
    if (created) return created;
  } catch {
    // Fallback to memory
  }

  const newOrder = {
    ...orderFields,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    items,
  };
  memOrders.unshift(newOrder);
  return newOrder;
}

/**
 * Supports updating order by either UUID `id` OR `bachsReference`,
 * and deducts in-memory variant stock if transitioning to "paid".
 */
export async function updateOrderStatus(
  identifier: string,
  updates: { paymentStatus?: any; fulfillmentStatus?: any }
) {
  try {
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        identifier
      );
    await db
      .update(orders)
      .set(updates)
      .where(
        isUuid
          ? or(
              eq(orders.id, identifier),
              eq(orders.bachsReference, identifier)
            )
          : eq(orders.bachsReference, identifier)
      );
  } catch {
    // Fallback to memory
  }

  memOrders = memOrders.map((o) => {
    if (o.id === identifier || o.bachsReference === identifier) {
      if (updates.paymentStatus === "paid" && o.paymentStatus !== "paid") {
        for (const item of o.items || []) {
          if (item.variantId) {
            updateVariantStockInMemory(item.variantId, -item.quantity);
          }
        }
      }
      return { ...o, ...updates };
    }
    return o;
  });
  return true;
}

export async function createProduct(productData: any, variantsData: any[]) {
  const gallery =
    productData.galleryUrls?.length > 0
      ? productData.galleryUrls
      : [productData.frontImageUrl, productData.backImageUrl];

  try {
    const dbProduct = await db.transaction(async (tx) => {
      const [insertedProd] = await tx
        .insert(products)
        .values({
          categoryId: productData.categoryId,
          name: productData.name,
          slug: productData.slug,
          description: productData.description,
          basePrice: productData.basePrice,
          frontImageUrl: productData.frontImageUrl,
          backImageUrl: productData.backImageUrl,
          galleryUrls: gallery,
          isActive: true,
          isFeatured: !!productData.isFeatured,
        })
        .returning();

      const insertedVariants = [];
      for (const v of variantsData) {
        const [insertedVar] = await tx
          .insert(productVariants)
          .values({
            productId: insertedProd.id,
            sku: v.sku,
            size: v.size,
            color: v.color,
            colorHex: v.colorHex || "#111111",
            priceOverride: v.priceOverride ?? null,
            stockQuantity: v.stockQuantity ?? 0,
          })
          .returning();
        insertedVariants.push(insertedVar);
      }

      return { ...insertedProd, variants: insertedVariants };
    });

    if (dbProduct) return dbProduct;
  } catch {
    // Fallback to memory
  }

  const prodId = crypto.randomUUID();
  const newProduct: SeedProduct = {
    id: prodId,
    categoryId: productData.categoryId,
    name: productData.name,
    slug: productData.slug,
    description: productData.description,
    basePrice: productData.basePrice,
    frontImageUrl: productData.frontImageUrl,
    backImageUrl: productData.backImageUrl,
    galleryUrls: gallery,
    isActive: true,
    isFeatured: !!productData.isFeatured,
    variants: variantsData.map((v) => ({
      id: crypto.randomUUID(),
      productId: prodId,
      sku: v.sku,
      size: v.size,
      color: v.color,
      colorHex: v.colorHex || "#111111",
      priceOverride: v.priceOverride ?? null,
      stockQuantity: v.stockQuantity ?? 0,
    })),
  };

  memProducts.unshift(newProduct);
  return newProduct;
}

function updateVariantStockInMemory(variantId: string, delta: number) {
  for (const prod of memProducts) {
    const variant = prod.variants.find((v) => v.id === variantId);
    if (variant) {
      variant.stockQuantity = Math.max(0, variant.stockQuantity + delta);
      return variant;
    }
  }
  return null;
}

export async function updateVariantStock(variantId: string, delta: number) {
  try {
    const [updated] = await db
      .update(productVariants)
      .set({
        stockQuantity: sql`GREATEST(0, ${productVariants.stockQuantity} + ${delta})`,
        updatedAt: new Date(),
      })
      .where(eq(productVariants.id, variantId))
      .returning();

    if (updated) {
      updateVariantStockInMemory(variantId, delta);
      return updated;
    }
  } catch {
    // Fallback to memory
  }

  return updateVariantStockInMemory(variantId, delta);
}