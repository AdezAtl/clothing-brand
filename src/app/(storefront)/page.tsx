import React from "react";
import { getHeroBanner, getCategories, getProducts } from "@/db/store";
import { HeroBanner } from "@/components/storefront/HeroBanner";
import { CategoryShowcase } from "@/components/storefront/CategoryShowcase";
import { Testimonials } from "@/components/storefront/Testimonials";

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  const [banner, categories, products] = await Promise.all([
    getHeroBanner(),
    getCategories(),
    getProducts({ featured: true }),
  ]);

  return (
    <>
      <HeroBanner banner={banner as any} />
      <CategoryShowcase categories={categories as any} products={products as any} />
      <Testimonials />
    </>
  );
}

