import { db } from "./index";
import { users, categories, products, productVariants, banners } from "./schema";
import { SEED_CATEGORIES, SEED_PRODUCTS, SEED_BANNER } from "./seed-data";
import bcrypt from "bcryptjs";

export async function seed() {
  console.log("🌱 Seeding Tullipio Fashion House database...");

  // 1. Create Default Admin User
  const passwordHash = await bcrypt.hash("AdminTullipio2026!", 10);
  try {
    await db.insert(users).values({
      name: "Tullipio Head Designer",
      email: "admin@tullipio.com",
      passwordHash,
      role: "admin",
    }).onConflictDoNothing();
    console.log("✓ Admin user created: admin@tullipio.com / AdminTullipio2026!");
  } catch (e) {
    console.warn("User insert error (may already exist)", e);
  }

  // 2. Categories
  for (const cat of SEED_CATEGORIES) {
    try {
      await db.insert(categories).values({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        isFeatured: cat.isFeatured,
      }).onConflictDoNothing();
    } catch (e) {
      console.warn(`Category insert error for ${cat.name}`, e);
    }
  }
  console.log("✓ Categories seeded.");

  // 3. Products and Variants
  for (const prod of SEED_PRODUCTS) {
    try {
      await db.insert(products).values({
        id: prod.id,
        categoryId: prod.categoryId,
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        basePrice: prod.basePrice,
        frontImageUrl: prod.frontImageUrl,
        backImageUrl: prod.backImageUrl,
        galleryUrls: prod.galleryUrls,
        isActive: prod.isActive,
        isFeatured: prod.isFeatured,
      }).onConflictDoNothing();

      for (const variant of prod.variants) {
        await db.insert(productVariants).values({
          id: variant.id,
          productId: prod.id,
          sku: variant.sku,
          size: variant.size,
          color: variant.color,
          colorHex: variant.colorHex,
          priceOverride: variant.priceOverride,
          stockQuantity: variant.stockQuantity,
        }).onConflictDoNothing();
      }
    } catch (e) {
      console.warn(`Product insert error for ${prod.name}`, e);
    }
  }
  console.log("✓ Products & Variants seeded.");

  // 4. Hero Banner
  try {
    await db.insert(banners).values({
      id: SEED_BANNER.id,
      title: SEED_BANNER.title,
      subtitle: SEED_BANNER.subtitle,
      imageUrl: SEED_BANNER.imageUrl,
      ctaText: SEED_BANNER.ctaText,
      ctaLink: SEED_BANNER.ctaLink,
      isActive: true,
    }).onConflictDoNothing();
    console.log("✓ Hero Banner seeded.");
  } catch (e) {
    console.warn("Banner insert error", e);
  }

  console.log("✨ Seeding completed successfully!");
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Seeding failed:", err);
      process.exit(1);
    });
}

