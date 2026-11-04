"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SeedCategory, SeedProduct } from "@/db/seed-data";
import { ProductCard } from "./ProductCard";
import { ArrowRight } from "lucide-react";

interface CategoryShowcaseProps {
  categories: SeedCategory[];
  products: SeedProduct[];
}

export function CategoryShowcase({ categories, products }: CategoryShowcaseProps) {
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>("all");

  const filteredProducts =
    activeCategorySlug === "all"
      ? products
      : products.filter((p) => {
          const category = categories.find((c) => c.slug === activeCategorySlug);
          return category ? p.categoryId === category.id : true;
        });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 border-b border-stone-200/80">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-12 gap-4 sm:gap-6">
        <div>
          <span className="text-[11px] sm:text-xs uppercase font-mono tracking-widest text-stone-500">
            Handcrafted in Akobo, Ibadan
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-950 mt-1 tracking-tight">
            Browse by categories
          </h2>
        </div>

        {/* Category Filter Pills — Single Horizontal Scroll Strip on Mobile, Wrap on Desktop */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap pb-1 pt-0.5">
          <button
            type="button"
            onClick={() => setActiveCategorySlug("all")}
            className={`shrink-0 px-4 sm:px-5 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all shadow-2xs cursor-pointer whitespace-nowrap active:scale-96 ${
              activeCategorySlug === "all"
                ? "bg-stone-950 text-stone-50 shadow-sm"
                : "bg-[#FAF8F5] text-stone-700 border border-stone-200/80 hover:border-stone-400 hover:text-stone-900"
            }`}
          >
            <span>All Pieces</span>
            <span className="opacity-70 ml-1">({products.length})</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setActiveCategorySlug(cat.slug)}
              className={`shrink-0 px-4 sm:px-5 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all shadow-2xs cursor-pointer whitespace-nowrap active:scale-96 ${
                activeCategorySlug === cat.slug
                  ? "bg-stone-950 text-stone-50 shadow-sm"
                  : "bg-[#FAF8F5] text-stone-700 border border-stone-200/80 hover:border-stone-400 hover:text-stone-900"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
        {filteredProducts.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* View More Link */}
      <div className="mt-10 sm:mt-14 text-center">
        <Link
          href={
            activeCategorySlug === "all"
              ? "/shop"
              : `/shop?category=${encodeURIComponent(activeCategorySlug)}`
          }
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-stone-900 bg-[#FAF8F5] text-stone-900 hover:bg-stone-900 hover:text-stone-50 text-xs font-semibold uppercase tracking-widest transition-all shadow-xs active:scale-98"
        >
          <span>
            View More in{" "}
            {activeCategorySlug === "all"
              ? "All Collections"
              : categories.find((c) => c.slug === activeCategorySlug)?.name}
          </span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
