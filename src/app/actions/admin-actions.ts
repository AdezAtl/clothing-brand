"use server";

import { revalidatePath } from "next/cache";
import {
  createProduct,
  updateVariantStock,
  updateOrderStatus,
  updateHeroBanner,
} from "@/db/store";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  categoryId: z.string().min(1),
  description: z.string().min(5),
  basePrice: z.number().int().positive(),
  frontImageUrl: z.string().url(),
  backImageUrl: z.string().url(),
  galleryUrls: z.array(z.string().url()).optional(),
  isFeatured: z.boolean().optional(),
  variants: z.array(
    z.object({
      sku: z.string().min(2),
      size: z.string().min(1),
      color: z.string().min(1),
      colorHex: z.string().min(4),
      priceOverride: z.number().int().positive().nullable().optional(),
      stockQuantity: z.number().int().nonnegative(),
    })
  ).min(1),
});

export async function createNewProductAction(formData: any) {
  try {
    const validated = productSchema.parse(formData);
    const result = await createProduct(validated, validated.variants);
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");
    return { success: true, product: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create product" };
  }
}

export async function updateOrderStatusAction(
  orderId: string,
  updates: { paymentStatus?: any; fulfillmentStatus?: any }
) {
  try {
    await updateOrderStatus(orderId, updates);
    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update order" };
  }
}

export async function updateHeroBannerAction(bannerData: {
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
}) {
  try {
    await updateHeroBanner(bannerData);
    revalidatePath("/");
    revalidatePath("/admin/banners");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update banner" };
  }
}

export async function updateStockAction(variantId: string, delta: number) {
  try {
    const updated = await updateVariantStock(variantId, delta);
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { success: true, variant: updated };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to adjust stock" };
  }
}

