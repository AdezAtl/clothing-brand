import { db } from "./index";
import {
  categories,
  products,
  productVariants,
  banners,
  orders,
  orderItems,
} from "./schema";
import { eq, desc } from "drizzle-orm";
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
    id: "ord-1",
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
    id: "ord-2",
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

export async function getCategories() {
  try {
    const rows = await db.select().from(categories);
    if (rows && rows.length > 0) return rows;
  } catch (err) {
    // Fall back to memory
  }
  return memCategories;
}

export async function getProducts(options?: { categorySlug?: string; featured?: boolean }) {
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
        filtered = filtered.filter((p: any) => p.category?.slug === options.categorySlug);
      }
      if (options?.featured) {
        filtered = filtered.filter((p: any) => p.isFeatured);
      }
      return filtered;
    }
  } catch (err) {
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
  } catch (err) {
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
    const rows = await db.select().from(banners).where(eq(banners.isActive, true)).limit(1);
    if (rows && rows.length > 0) return rows[0];
  } catch (err) {
    // Fallback
  }
  return memBanner;
}

export async function updateHeroBanner(data: Partial<SeedBanner>) {
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
  } catch (err) {
    // Fallback
  }
  return memOrders;
}

export async function createOrder(orderData: any) {
  try {
    const [inserted] = await db.insert(orders).values(orderData).returning();
    if (inserted) return inserted;
  } catch (err) {
    // Fallback
  }

  const newOrder = {
    ...orderData,
    id: `ord-${Date.now()}`,
    createdAt: new Date(),
  };
  memOrders.unshift(newOrder);
  return newOrder;
}

export async function updateOrderStatus(
  orderId: string,
  updates: { paymentStatus?: any; fulfillmentStatus?: any }
) {
  try {
    await db.update(orders).set(updates).where(eq(orders.id, orderId));
  } catch (err) {
    // Fallback
  }

  memOrders = memOrders.map((o) => (o.id === orderId ? { ...o, ...updates } : o));
  return true;
}

export async function createProduct(productData: any, variantsData: any[]) {
  const newProduct: SeedProduct = {
    id: `prod-${Date.now()}`,
    categoryId: productData.categoryId,
    name: productData.name,
    slug: productData.slug,
    description: productData.description,
    basePrice: productData.basePrice,
    frontImageUrl: productData.frontImageUrl,
    backImageUrl: productData.backImageUrl,
    galleryUrls: productData.galleryUrls || [productData.frontImageUrl, productData.backImageUrl],
    isActive: true,
    isFeatured: !!productData.isFeatured,
    variants: variantsData.map((v, idx) => ({
      id: `var-${Date.now()}-${idx}`,
      productId: `prod-${Date.now()}`,
      sku: v.sku,
      size: v.size,
      color: v.color,
      colorHex: v.colorHex || "#111111",
      priceOverride: v.priceOverride || null,
      stockQuantity: v.stockQuantity || 0,
    })),
  };

  memProducts.unshift(newProduct);
  return newProduct;
}

export async function updateVariantStock(variantId: string, delta: number) {
  for (const prod of memProducts) {
    const variant = prod.variants.find((v) => v.id === variantId);
    if (variant) {
      variant.stockQuantity = Math.max(0, variant.stockQuantity + delta);
      return variant;
    }
  }
  return null;
}

