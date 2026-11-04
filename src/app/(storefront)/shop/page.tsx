import React from "react";
import { getCategories, getProducts } from "@/db/store";
import { ProductCard } from "@/components/storefront/ProductCard";
import Link from "next/link";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedParams = await searchParams;
  const currentCategorySlug = resolvedParams?.category;
  const searchQuery = resolvedParams?.search?.toLowerCase();

  const [categories, allProducts] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  let filtered: any[] = allProducts;

  if (currentCategorySlug) {
    const matchedCategory = categories.find((c) => c.slug === currentCategorySlug);
    if (matchedCategory) {
      filtered = filtered.filter((p) => p.categoryId === matchedCategory.id);
    }
  }

  if (searchQuery) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery) ||
        p.description.toLowerCase().includes(searchQuery)
    );
  }

  const currentCategoryObj = categories.find((c) => c.slug === currentCategorySlug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      {/* Header Banner — Softer White with Subtle Shadow */}
      <div className="mb-10 p-7 sm:p-8 rounded-2xl bg-[#FAF8F5] border border-stone-200/85 shadow-[0_4px_20px_-4px_rgba(28,25,23,0.06)]">
        <span className="text-xs uppercase font-mono tracking-widest text-stone-500">
          Catalog & Ready Garments
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-950 mt-1">
          {currentCategoryObj ? currentCategoryObj.name : "All Tullipio Garments"}
        </h1>
        <p className="text-xs text-stone-600 mt-2 max-w-xl leading-relaxed">
          {currentCategoryObj?.description ||
            "Explore contemporary Yoruba and pan-African garments handcrafted with heavyweight heritage textiles in Akobo."}
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2.5 mb-10">
        <Link
          href="/shop"
          className={`px-5 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all shadow-2xs ${
            !currentCategorySlug
              ? "bg-stone-950 text-stone-50 shadow-sm"
              : "bg-[#FAF8F5] text-stone-700 border border-stone-200/80 hover:border-stone-400 hover:text-stone-900"
          }`}
        >
          All ({allProducts.length})
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/shop?category=${cat.slug}`}
            className={`px-5 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all shadow-2xs ${
              currentCategorySlug === cat.slug
                ? "bg-stone-950 text-stone-50 shadow-sm"
                : "bg-[#FAF8F5] text-stone-700 border border-stone-200/80 hover:border-stone-400 hover:text-stone-900"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center bg-[#FAF8F5] rounded-2xl border border-stone-200 p-8 shadow-xs">
          <p className="text-stone-700 font-medium text-sm">No garments found in this category.</p>
          <p className="text-stone-500 text-xs mt-1">
            Try choosing a different category or clearing your search term.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-block px-7 py-3 rounded-full bg-stone-950 text-stone-50 text-xs uppercase tracking-widest font-semibold hover:bg-stone-800 transition-all shadow-sm"
          >
            Reset Catalog Filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
