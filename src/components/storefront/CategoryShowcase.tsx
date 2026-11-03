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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-b border-stone-200">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-stone-500">
            Handcrafted in Akobo
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-normal text-stone-950 mt-1">
            Curated Garment Showcase
          </h2>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveCategorySlug("all")}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-medium transition-colors border ${
              activeCategorySlug === "all"
                ? "bg-stone-900 text-stone-50 border-stone-900"
                : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
            }`}
          >
            All Pieces ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategorySlug(cat.slug)}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-medium transition-colors border ${
                activeCategorySlug === cat.slug
                  ? "bg-stone-900 text-stone-50 border-stone-900"
                  : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* View More Link */}
      <div className="mt-12 text-center">
        <Link
          href={
            activeCategorySlug === "all"
              ? "/shop"
              : `/shop?category=${encodeURIComponent(activeCategorySlug)}`
          }
          className="inline-flex items-center gap-2 px-6 py-3 border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-stone-50 text-xs font-semibold uppercase tracking-widest transition-colors"
        >
          <span>View More in {activeCategorySlug === "all" ? "Catalog" : categories.find(c => c.slug === activeCategorySlug)?.name}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

