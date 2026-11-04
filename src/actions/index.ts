"use server";

import { revalidatePath } from "next/cache";
import { auth, signOut } from "@/auth";
import bcrypt from "bcryptjs";
import {
  createProduct,
  updateVariantStock,
  updateOrderStatus,
  updateHeroBanner,
  findUserByEmail,
  createUser,
  deleteUserById,
  updateUserRole,
} from "@/db/store";
import { z } from "zod";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    throw new Error("Unauthorized: Admin privileges required.");
  }
}

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
  variants: z
    .array(
      z.object({
        sku: z.string().min(2),
        size: z.string().min(1),
        color: z.string().min(1),
        colorHex: z.string().min(4),
        priceOverride: z.number().int().positive().nullable().optional(),
        stockQuantity: z.number().int().nonnegative(),
      })
    )
    .min(1),
});

const orderStatusSchema = z.object({
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
  fulfillmentStatus: z
    .enum(["unfulfilled", "processing", "shipped", "delivered", "cancelled"])
    .optional(),
});

export async function createNewProductAction(formData: unknown) {
  try {
    await requireAdmin();
    const validated = productSchema.parse(formData);
    const result = await createProduct(validated, validated.variants);
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");
    return { success: true, product: result };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to create product",
    };
  }
}

export async function updateOrderStatusAction(
  orderId: string,
  updates: { paymentStatus?: any; fulfillmentStatus?: any }
) {
  try {
    await requireAdmin();
    const validatedUpdates = orderStatusSchema.parse(updates);
    await updateOrderStatus(orderId, validatedUpdates);
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
    await requireAdmin();
    await updateHeroBanner(bannerData);
    revalidatePath("/");
    revalidatePath("/admin/banners");
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to update banner",
    };
  }
}

export async function updateStockAction(variantId: string, delta: number) {
  try {
    await requireAdmin();
    const updated = await updateVariantStock(variantId, delta);
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { success: true, variant: updated };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to adjust stock",
    };
  }
}

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function registerCustomerAction(data: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const validated = registerSchema.parse(data);
    const existing = await findUserByEmail(validated.email);
    if (existing) {
      return {
        success: false,
        error: "An account with this email address already exists. Please log in.",
      };
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(validated.password, salt);

    const newUser = await createUser({
      name: validated.name,
      email: validated.email,
      passwordHash,
      role: "customer",
    });

    return {
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to register account",
    };
  }
}

export async function deleteAccountAction() {
  try {
    const session = await auth();
    if (!session?.user || !(session.user as any).id) {
      return {
        success: false,
        error: "Authentication required to delete account.",
      };
    }

    const userId = (session.user as any).id;
    await deleteUserById(userId);

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to delete account",
    };
  }
}

export async function toggleUserRoleAction(
  userId: string,
  newRole: "customer" | "admin"
) {
  try {
    await requireAdmin();
    const session = await auth();

    // Prevent admin from demoting themselves and locking themselves out
    if ((session?.user as any)?.id === userId && newRole !== "admin") {
      return {
        success: false,
        error: "You cannot revoke your own administrator privileges.",
      };
    }

    if (newRole !== "customer" && newRole !== "admin") {
      return { success: false, error: "Invalid role specified." };
    }

    const result = await updateUserRole(userId, newRole);
    revalidatePath("/admin/users");
    revalidatePath("/admin");
    return { success: true, result };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to update user role",
    };
  }
}
