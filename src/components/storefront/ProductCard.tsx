"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatPriceNGN } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { SeedProduct } from "@/db/seed-data";
import { Check, ShoppingBag, Eye, X } from "lucide-react";

interface ProductCardProps {
  product: SeedProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [addedNotice, setAddedNotice] = useState(false);
  const [isEnlarged, setIsEnlarged] = useState(false);

  const currentVariant = product.variants[0];
  const currentPrice = currentVariant?.priceOverride ?? product.basePrice;
  const inStock = (currentVariant?.stockQuantity ?? 0) > 0;
  const isLowStock =
    (currentVariant?.stockQuantity ?? 0) > 0 &&
    (currentVariant?.stockQuantity ?? 0) <= 2;

  // ESC key listener to close enlarged image lightbox
  useEffect(() => {
    if (!isEnlarged) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsEnlarged(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isEnlarged]);

  const handleCardClick = (e: React.MouseEvent) => {
    // If click came from a button (Quick Add or Eye), prevent navigating
    if ((e.target as HTMLElement).closest("button")) return;
    router.push(`/product/${product.slug}`);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleEyeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEnlarged(true);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group flex flex-col bg-[#FAF8F5] rounded-2xl border border-stone-200/75 shadow-[0_4px_20px_-4px_rgba(28,25,23,0.06)] hover:shadow-[0_8px_30px_-6px_rgba(28,25,23,0.12)] hover:border-stone-300 transition-all duration-300 overflow-hidden cursor-pointer"
      >
        {/* Garment Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#ECE8DF]">
          <img
            src={product.frontImageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-104"
          />

          {/* Stock Badge */}
          <div className="absolute top-3.5 right-3.5">
            {!inStock ? (
              <span className="bg-stone-900/90 backdrop-blur-xs text-stone-200 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                Sold Out
              </span>
            ) : isLowStock ? (
              <span className="bg-amber-700/90 backdrop-blur-xs text-amber-50 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                Only {currentVariant?.stockQuantity} Left
              </span>
            ) : null}
          </div>

          {/* Quick View / Add Hover Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-stone-950/80 via-stone-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={!inStock}
              className="flex-1 py-2 px-3.5 rounded-xl bg-[#FAF8F5] text-stone-900 text-xs font-semibold uppercase tracking-wider hover:bg-white transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-98 cursor-pointer"
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
            <button
              type="button"
              onClick={handleEyeClick}
              className="p-2 rounded-xl bg-stone-900/90 backdrop-blur-xs text-stone-100 hover:bg-stone-800 transition-all shadow-sm active:scale-98 cursor-pointer"
              title="Enlarge Garment Image"
              aria-label="Enlarge Garment Image"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Metadata */}
        <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-[#FAF8F5]">
          <div>
            <h3 className="text-sm font-semibold text-stone-900 group-hover:text-stone-700 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </div>

          <div className="mt-3.5 pt-3 border-t border-stone-200/60 flex items-baseline justify-between">
            <p className="text-base font-bold text-stone-950 font-serif">
              {formatPriceNGN(currentPrice)}
            </p>

            {/* Silhouette Options text moved to bottom right */}
            <span className="capitalize text-stone-500 font-medium text-[11px] tracking-wide">
              {product.variants.length} Silhouette Option{product.variants.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Enlarged Picture Modal / Lightbox (Inspect image without leaving page) */}
      {isEnlarged && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setIsEnlarged(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full bg-[#FAF8F5] rounded-3xl overflow-hidden shadow-2xl border border-stone-200/80 flex flex-col animate-in zoom-in-95 duration-200"
          >
            {/* Lightbox Header */}
            <div className="px-5 py-3.5 bg-[#F4F1EA] border-b border-stone-200/80 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-stone-950 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-xs font-serif font-bold text-stone-800">
                  {formatPriceNGN(currentPrice)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEnlarged(false)}
                className="p-1.5 rounded-full text-stone-500 hover:text-stone-950 hover:bg-stone-200/60 transition-colors cursor-pointer"
                aria-label="Close enlarged picture"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* High-Resolution Picture Display */}
            <div className="relative aspect-[3/4] max-h-[68vh] bg-[#ECE8DF] overflow-hidden">
              <img
                src={product.frontImageUrl}
                alt={product.name}
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Lightbox Footer Actions */}
            <div className="p-4 bg-[#FAF8F5] border-t border-stone-200/80 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleQuickAdd}
                disabled={!inStock}
                className="flex-1 py-2.5 px-4 rounded-xl bg-stone-950 text-stone-50 text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-sm active:scale-98"
              >
                {addedNotice ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Quick Add</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsEnlarged(false);
                  router.push(`/product/${product.slug}`);
                }}
                className="py-2.5 px-4 rounded-xl border border-stone-300 bg-[#FAF8F5] text-stone-900 hover:bg-stone-100 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
              >
                Full Details →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
