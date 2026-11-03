import React from "react";
import { getCategories, getProducts } from "@/db/store";
import { ProductCard } from "@/components/storefront/ProductCard";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Banner */}
      <div className="mb-10 pb-6 border-b border-stone-200 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-stone-500">
            Catalog & Ready Garments
          </span>
          <h1 className="text-3xl font-serif text-stone-950 mt-1">
            {currentCategoryObj ? currentCategoryObj.name : "All Tullipio Garments"}
          </h1>
          <p className="text-xs text-stone-500 mt-1 max-w-xl">
            {currentCategoryObj?.description ||
              "Explore all contemporary Yoruba and pan-African garments handcrafted with heavyweight textiles in Akobo, Ibadan."}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Showing {filtered.length} garments</span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/shop"
          className={`px-4 py-2 text-xs uppercase tracking-wider font-medium border transition-colors ${
            !currentCategorySlug
              ? "bg-stone-900 text-stone-50 border-stone-900"
              : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
          }`}
        >
          All ({allProducts.length})
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/shop?category=${cat.slug}`}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-medium border transition-colors ${
              currentCategorySlug === cat.slug
                ? "bg-stone-900 text-stone-50 border-stone-900"
                : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center bg-stone-100/60 border border-stone-200 p-8">
          <p className="text-stone-700 font-medium text-sm">No garments found in this category.</p>
          <p className="text-stone-500 text-xs mt-1">
            Try choosing a different category or clearing your search term.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-block px-6 py-2.5 bg-stone-900 text-stone-50 text-xs uppercase tracking-widest font-semibold"
          >
            Reset Catalog Filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

