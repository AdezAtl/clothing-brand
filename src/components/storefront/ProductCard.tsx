"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatPriceNGN } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { SeedProduct } from "@/db/seed-data";
import { Check, ShoppingBag, Eye } from "lucide-react";

interface ProductCardProps {
  product: SeedProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0]?.id || ""
  );
  const [addedNotice, setAddedNotice] = useState(false);

  const currentVariant =
    product.variants.find((v) => v.id === selectedVariantId) ||
    product.variants[0];

  const currentPrice = currentVariant?.priceOverride ?? product.basePrice;
  const inStock = (currentVariant?.stockQuantity ?? 0) > 0;
  const isLowStock =
    (currentVariant?.stockQuantity ?? 0) > 0 &&
    (currentVariant?.stockQuantity ?? 0) <= 2;

  // Extract unique colors and sizes for preview
  const uniqueSizes = Array.from(new Set(product.variants.map((v) => v.size)));
  const uniqueColors = Array.from(
    new Map(
      product.variants.map((v) => [v.color, { color: v.color, hex: v.colorHex }])
    ).values()
  );

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!currentVariant || !inStock) return;

    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      variantId: currentVariant.id,
      sku: currentVariant.sku,
      size: currentVariant.size,
      color: currentVariant.color,
      colorHex: currentVariant.colorHex,
      price: currentPrice,
      imageUrl: product.frontImageUrl,
      quantity: 1,
      maxStock: currentVariant.stockQuantity,
    });

    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  return (
    <div
      className="group flex flex-col bg-stone-50 border border-stone-200 hover:border-stone-400 transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Front/Back Flip */}
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={isHovered ? product.backImageUrl : product.frontImageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-top transition-opacity duration-500 ease-in-out"
          />
        </Link>

        {/* Flip Angle Indicator Pill */}
        <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-stone-100 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 pointer-events-none">
          {isHovered ? "Back View" : "Front View"}
        </div>

        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          {!inStock ? (
            <span className="bg-red-900/90 text-red-50 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-700/90 text-amber-50 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5">
              Only {currentVariant?.stockQuantity} Left
            </span>
          ) : null}
        </div>

        {/* Quick View / Add Hover Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-stone-950/80 via-stone-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
          <button
            onClick={handleQuickAdd}
            disabled={!inStock}
            className="flex-1 py-2 px-3 bg-stone-100 text-stone-900 text-xs font-semibold uppercase tracking-wider hover:bg-stone-200 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addedNotice ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>
          <Link
            href={`/product/${product.slug}`}
            className="p-2 bg-stone-900 text-stone-100 hover:bg-stone-800 transition-colors"
            title="Inspect Details"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Product Metadata */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-mono text-[11px]">{currentVariant?.sku}</span>
            <span className="capitalize">{currentVariant?.color}</span>
          </div>

          <Link href={`/product/${product.slug}`}>
            <h3 className="text-sm font-medium text-stone-900 hover:text-stone-700 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="mt-1 text-sm font-semibold text-stone-950">
            {formatPriceNGN(currentPrice)}
          </p>
        </div>

        {/* Mini Variant Selectors */}
        <div className="mt-3 pt-3 border-t border-stone-200/60 flex items-center justify-between">
          {/* Colors */}
          <div className="flex items-center gap-1">
            {uniqueColors.map((c) => {
              const matched = product.variants.find((v) => v.color === c.color);
              const isSelected = currentVariant?.color === c.color;
              return (
                <button
                  key={c.color}
                  onClick={() => matched && setSelectedVariantId(matched.id)}
                  title={c.color}
                  className={`w-3.5 h-3.5 rounded-full border transition-all ${
                    isSelected ? "ring-2 ring-stone-900 ring-offset-1 border-transparent" : "border-stone-300"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              );
            })}
          </div>

          {/* Sizes */}
          <div className="flex items-center gap-1">
            {uniqueSizes.slice(0, 4).map((s) => {
              const matched = product.variants.find(
                (v) => v.size === s && v.color === currentVariant?.color
              ) || product.variants.find((v) => v.size === s);
              const isSelected = currentVariant?.size === s;
              return (
                <button
                  key={s}
                  onClick={() => matched && setSelectedVariantId(matched.id)}
                  className={`px-1.5 py-0.5 text-[10px] font-mono border ${
                    isSelected
                      ? "bg-stone-900 text-stone-50 border-stone-900 font-bold"
                      : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

