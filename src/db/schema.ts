import { pgTable, text, integer, boolean, timestamp, jsonb, uuid, check } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["customer", "admin"] }).default("customer").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  isFeatured: boolean("is_featured").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  categoryId: uuid("category_id")
    .references(() => categories.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  basePrice: integer("base_price").notNull(), // In kobo (e.g. ₦45,000 = 4,500,000 kobo)
  frontImageUrl: text("front_image_url").notNull(),
  backImageUrl: text("back_image_url").notNull(),
  galleryUrls: jsonb("gallery_urls").$type<string[]>().default([]).notNull(),
  model3dUrl: text("model_3d_url"), // Reserved for Phase 2 3D mannequin
  isActive: boolean("is_active").default(true).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    sku: text("sku").notNull().unique(),
    size: text("size").notNull(), // S, M, L, XL, XXL, Custom
    color: text("color").notNull(), // e.g. "Emerald Green", "Onyx Black"
    colorHex: text("color_hex").notNull(), // e.g. "#0F5132"
    priceOverride: integer("price_override"), // In kobo, null if base price applies
    stockQuantity: integer("stock_quantity").default(0).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    check("stock_quantity_non_negative", sql`stock_quantity >= 0`),
  ]
);

export const banners = pgTable("banners", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  imageUrl: text("image_url").notNull(),
  ctaText: text("cta_text").default("Shop the Collection").notNull(),
  ctaLink: text("cta_link").default("/shop").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderNumber: text("order_number").notNull().unique(), // e.g. TLP-2026-0042
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  shippingAddress: jsonb("shipping_address")
    .$type<{
      street: string;
      city: string;
      state: string;
      postalCode?: string;
      notes?: string;
    }>()
    .notNull(),
  totalAmount: integer("total_amount").notNull(), // In kobo
  paymentStatus: text("payment_status", {
    enum: ["pending", "paid", "failed", "refunded"],
  })
    .default("pending")
    .notNull(),
  fulfillmentStatus: text("fulfillment_status", {
    enum: ["unfulfilled", "processing", "shipped", "delivered", "cancelled"],
  })
    .default("unfulfilled")
    .notNull(),
  bachsReference: text("bachs_reference").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "set null" }),
  variantId: uuid("variant_id")
    .references(() => productVariants.id, { onDelete: "set null" }),
  productNameSnapshot: text("product_name_snapshot").notNull(),
  variantSnapshot: text("variant_snapshot").notNull(), // e.g. "Size: XL / Color: Emerald"
  quantity: integer("quantity").notNull(),
  unitPrice: integer("unit_price").notNull(), // In kobo
});

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  variants: many(productVariants),
  orderItems: many(orderItems),
}));

export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
  orderItems: many(orderItems),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}));

