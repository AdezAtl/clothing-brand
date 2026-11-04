"use client";

import React, { useState } from "react";
import { SeedProduct } from "@/db/seed-data";
import { formatPriceNGN } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import {
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  MapPin,
} from "lucide-react";

interface ProductDetailClientProps {
  product: SeedProduct;
  categoryName?: string;
}

export function ProductDetailClient({
  product,
  categoryName,
}: ProductDetailClientProps) {
  const { addItem } = useCart();

  // Variant selection state
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0]?.id || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>(product.frontImageUrl);
  const [added, setAdded] = useState(false);

  const currentVariant =
    product.variants.find((v) => v.id === selectedVariantId) ||
    product.variants[0];

  const currentPrice = currentVariant?.priceOverride ?? product.basePrice;
  const inStock = (currentVariant?.stockQuantity ?? 0) > 0;
  const stockCount = currentVariant?.stockQuantity ?? 0;

  // Extract unique attributes
  const uniqueSizes = Array.from(new Set(product.variants.map((v) => v.size)));
  const uniqueColors = Array.from(
    new Map(
      product.variants.map((v) => [v.color, { color: v.color, hex: v.colorHex }])
    ).values()
  );

  const handleSelectColor = (colorName: string) => {
    const currentSize = currentVariant?.size;
    const match =
      product.variants.find(
        (v) => v.color === colorName && v.size === currentSize
      ) || product.variants.find((v) => v.color === colorName);
    if (match) setSelectedVariantId(match.id);
  };

  const handleSelectSize = (sizeName: string) => {
    const currentColor = currentVariant?.color;
    const match =
      product.variants.find(
        (v) => v.size === sizeName && v.color === currentColor
      ) || product.variants.find((v) => v.size === sizeName);
    if (match) setSelectedVariantId(match.id);
  };

  const handleAddToCart = () => {
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
      quantity,
      maxStock: currentVariant.stockQuantity,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const gallery = Array.from(
    new Set(
      [product.frontImageUrl, product.backImageUrl, ...(product.galleryUrls || [])].filter(Boolean)
    )
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Garment Image Showcase & Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Gallery Thumbnails */}
          {gallery.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:w-20 shrink-0">
              {gallery.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(url)}
                  className={`relative aspect-[3/4] w-16 md:w-full rounded-xl border-2 overflow-hidden transition-all bg-[#ECE8DF] cursor-pointer ${
                    activeImage === url
                      ? "border-stone-900 ring-1 ring-stone-900 shadow-sm"
                      : "border-stone-200/80 hover:border-stone-400 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={url}
                    alt={`${product.name} view ${idx + 1}`}
                    className="w-full h-full object-cover object-top"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Visual Display */}
          <div className="flex-1 relative aspect-[3/4] bg-[#ECE8DF] rounded-2xl border border-stone-200/80 overflow-hidden shadow-[0_4px_24px_-4px_rgba(28,25,23,0.08)]">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover object-top transition-all duration-300"
            />

            {/* Stock Pill */}
            <div className="absolute top-4 right-4">
              {!inStock ? (
                <span className="px-3.5 py-1.5 rounded-full bg-red-900/90 backdrop-blur-xs text-red-50 text-[11px] uppercase font-bold tracking-wider shadow-xs">
                  Sold Out
                </span>
              ) : stockCount <= 2 ? (
                <span className="px-3.5 py-1.5 rounded-full bg-amber-700/90 backdrop-blur-xs text-amber-50 text-[11px] uppercase font-bold tracking-wider shadow-xs">
                  Only {stockCount} Left in Akobo
                </span>
              ) : (
                <span className="px-3.5 py-1.5 rounded-full bg-stone-900/80 backdrop-blur-xs text-stone-100 text-[11px] uppercase font-mono tracking-wider shadow-xs">
                  In Stock • Ready to Dispatch
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Garment Details & Variant Selection (The Dedicated Place for Color/Size Selection) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-stone-500 mb-2">
                <span>{categoryName || "Bespoke Collection"}</span>
                <span>•</span>
                <span>SKU: {currentVariant?.sku}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-stone-950 leading-tight">
                {product.name}
              </h1>

              <p className="mt-3 text-2xl font-bold font-serif text-stone-950">
                {formatPriceNGN(currentPrice)}
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-[#FAF8F5] border border-stone-200/80 shadow-xs">
              <p className="text-xs text-stone-700 leading-relaxed font-light">
                {product.description}
              </p>
            </div>

            {/* Color Variant Selector */}
            <div>
              <div className="flex justify-between items-center text-xs mb-2.5">
                <span className="font-semibold uppercase tracking-wider text-stone-700">
                  Colorway:
                </span>
                <span className="capitalize text-stone-900 font-medium font-mono">
                  {currentVariant?.color}
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {uniqueColors.map((c) => {
                  const isSelected = currentVariant?.color === c.color;
                  return (
                    <button
                      key={c.color}
                      onClick={() => handleSelectColor(c.color)}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs transition-all cursor-pointer ${
                        isSelected
                          ? "border-stone-950 bg-stone-950 text-white shadow-xs"
                          : "border-stone-200/80 bg-[#FAF8F5] text-stone-700 hover:border-stone-400"
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.color}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Variant Selector */}
            <div>
              <div className="flex justify-between items-center text-xs mb-2.5">
                <span className="font-semibold uppercase tracking-wider text-stone-700">
                  Size Specification:
                </span>
                <span className="text-stone-500 text-[11px] font-mono">
                  Yoruba Tailoring Proportions
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {uniqueSizes.map((s) => {
                  const isSelected = currentVariant?.size === s;
                  const matched = product.variants.find(
                    (v) => v.size === s && v.color === currentVariant?.color
                  );
                  const isSizeInStock = (matched?.stockQuantity ?? 0) > 0;

                  return (
                    <button
                      key={s}
                      onClick={() => handleSelectSize(s)}
                      disabled={!isSizeInStock}
                      className={`px-4 py-2 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                        isSelected
                          ? "bg-stone-950 text-white shadow-xs"
                          : isSizeInStock
                          ? "bg-[#FAF8F5] text-stone-700 border border-stone-200/80 hover:border-stone-400"
                          : "bg-stone-200/40 text-stone-400 border border-stone-200 cursor-not-allowed line-through"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Stepper and Add to Bag */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              {/* Stepper */}
              <div className="flex items-center justify-between border border-stone-300 rounded-full px-4 py-2 sm:w-32 bg-[#FAF8F5]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-stone-600 hover:text-stone-950 font-bold p-1 text-sm cursor-pointer"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="font-mono text-xs font-bold text-stone-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(stockCount, quantity + 1))}
                  className="text-stone-600 hover:text-stone-950 font-bold p-1 text-sm disabled:opacity-30 cursor-pointer"
                  disabled={quantity >= stockCount}
                >
                  +
                </button>
              </div>

              {/* Add to Bag Pill Button */}
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex-1 py-3.5 px-8 rounded-full bg-stone-950 text-stone-50 text-xs font-semibold uppercase tracking-widest hover:bg-stone-800 transition-all flex items-center justify-center gap-2 shadow-md active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{inStock ? "Add to Shopping Bag" : "Out of Stock"}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Atelier Guarantees — Softer White with Subtle Shadows */}
          <div className="grid grid-cols-2 gap-3 pt-6 border-t border-stone-200/80 text-xs text-stone-600">
            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-200/80 flex items-start gap-2.5 shadow-2xs">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-stone-900 text-[11px]">Akobo Showroom</p>
                <p className="text-[10px] text-stone-500">Pick up or local delivery</p>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-200/80 flex items-start gap-2.5 shadow-2xs">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-stone-900 text-[11px]">Express Courier</p>
                <p className="text-[10px] text-stone-500">Ibadan, Lagos & Abuja</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
