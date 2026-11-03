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
    // Find variant with same size if possible, or first with this color
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

  const allImages = [
    { label: "Front Angle", url: product.frontImageUrl },
    { label: "Back Angle", url: product.backImageUrl },
    ...product.galleryUrls.map((url, i) => ({
      label: `Detail ${i + 1}`,
      url,
    })),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Garment Image Showcase & Front/Back Switcher */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Angle Thumbnails */}
          <div className="flex md:flex-col gap-3 overflow-x-auto md:w-24 shrink-0">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img.url)}
                className={`relative aspect-[3/4] w-20 md:w-full border-2 overflow-hidden transition-all bg-stone-100 ${
                  activeImage === img.url
                    ? "border-stone-900 ring-1 ring-stone-900"
                    : "border-stone-200 hover:border-stone-400 opacity-75 hover:opacity-100"
                }`}
              >
                <img
                  src={img.url}
                  alt={img.label}
                  className="w-full h-full object-cover object-top"
                />
                <span className="absolute bottom-0 inset-x-0 bg-stone-950/80 text-[9px] text-stone-200 text-center py-0.5 font-mono uppercase">
                  {img.label}
                </span>
              </button>
            ))}
          </div>

          {/* Main Visual Display */}
          <div className="flex-1 relative aspect-[3/4] bg-stone-100 border border-stone-200 overflow-hidden">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover object-top"
            />

            {/* Quick Toggle Pills: Front vs Back */}
            <div className="absolute top-4 left-4 flex gap-2">
              <button
                onClick={() => setActiveImage(product.frontImageUrl)}
                className={`px-3 py-1 text-xs font-mono uppercase tracking-wider border shadow-xs transition-colors ${
                  activeImage === product.frontImageUrl
                    ? "bg-stone-900 text-stone-50 border-stone-900 font-bold"
                    : "bg-stone-50/90 text-stone-700 border-stone-300 hover:bg-stone-100"
                }`}
              >
                Front View
              </button>
              <button
                onClick={() => setActiveImage(product.backImageUrl)}
                className={`px-3 py-1 text-xs font-mono uppercase tracking-wider border shadow-xs transition-colors ${
                  activeImage === product.backImageUrl
                    ? "bg-stone-900 text-stone-50 border-stone-900 font-bold"
                    : "bg-stone-50/90 text-stone-700 border-stone-300 hover:bg-stone-100"
                }`}
              >
                Back View
              </button>
            </div>

            {/* Stock status overlay */}
            <div className="absolute top-4 right-4">
              {!inStock ? (
                <span className="bg-red-950 text-red-50 text-xs font-bold uppercase tracking-wider px-3 py-1 border border-red-800">
                  Sold Out
                </span>
              ) : stockCount <= 2 ? (
                <span className="bg-amber-950 text-amber-50 text-xs font-bold uppercase tracking-wider px-3 py-1 border border-amber-800">
                  Only {stockCount} In Stock
                </span>
              ) : (
                <span className="bg-emerald-950 text-emerald-50 text-xs font-bold uppercase tracking-wider px-3 py-1 border border-emerald-800">
                  In Stock ({stockCount} units)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Product Details & Variant Selectors */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
          <div>
            {/* Category & Atelier Badge */}
            <div className="flex items-center justify-between text-xs text-stone-500 mb-2 font-mono">
              <span className="uppercase tracking-widest">{categoryName || "Tullipio Apparel"}</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-stone-400" />
                Akobo Atelier
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif text-stone-950 leading-tight">
              {product.name}
            </h1>

            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-2xl font-bold text-stone-950">
                {formatPriceNGN(currentPrice)}
              </span>
              <span className="text-xs text-stone-400 font-mono">
                SKU: {currentVariant?.sku}
              </span>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-stone-600 leading-relaxed font-light border-y border-stone-200 py-4">
              {product.description}
            </p>

            {/* Color Selector */}
            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="uppercase font-semibold tracking-wider text-stone-700">
                  Colorway:
                </span>
                <span className="font-medium text-stone-900">{currentVariant?.color}</span>
              </div>
              <div className="flex items-center gap-3">
                {uniqueColors.map((c) => {
                  const isSelected = currentVariant?.color === c.color;
                  return (
                    <button
                      key={c.color}
                      onClick={() => handleSelectColor(c.color)}
                      className={`group flex items-center gap-2 p-1 border transition-all ${
                        isSelected
                          ? "border-stone-900 ring-2 ring-stone-900/40 bg-stone-100"
                          : "border-stone-200 hover:border-stone-400 bg-white"
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-none border border-stone-300"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="text-xs text-stone-800 pr-1">{c.color}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="uppercase font-semibold tracking-wider text-stone-700">
                  Garment Size:
                </span>
                <span className="font-mono text-stone-500">
                  Standard West African Fit
                </span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {uniqueSizes.map((size) => {
                  const isSelected = currentVariant?.size === size;
                  // check if available in this color
                  const variantForCombo = product.variants.find(
                    (v) => v.size === size && v.color === currentVariant?.color
                  );
                  const isAvailable =
                    variantForCombo && variantForCombo.stockQuantity > 0;

                  return (
                    <button
                      key={size}
                      onClick={() => handleSelectSize(size)}
                      className={`py-3 text-xs font-mono font-medium border text-center transition-all ${
                        isSelected
                          ? "bg-stone-900 text-stone-50 border-stone-900 font-bold"
                          : isAvailable
                          ? "bg-white text-stone-800 border-stone-200 hover:border-stone-400"
                          : "bg-stone-100 text-stone-400 border-stone-200 line-through opacity-70"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Stepper & Add to Cart */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center border border-stone-300 bg-white h-12">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 text-stone-600 hover:bg-stone-100 h-full"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 text-xs font-mono font-bold text-stone-900">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(stockCount, q + 1))
                  }
                  className="px-3.5 text-stone-600 hover:bg-stone-100 h-full"
                  disabled={quantity >= stockCount}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex-1 h-12 bg-stone-900 text-stone-50 text-xs font-semibold uppercase tracking-widest hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 disabled:bg-stone-300 disabled:cursor-not-allowed shadow-md"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Added to Bag</span>
                  </>
                ) : !inStock ? (
                  <span>Out of Stock in this Variant</span>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Shopping Bag • {formatPriceNGN(currentPrice * quantity)}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quality & Dispatch Highlights */}
          <div className="border-t border-stone-200 pt-6 space-y-3 text-xs text-stone-600">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-stone-800" />
              <span>Direct delivery to Ibadan & Lagos in 24–48 hours; Nigeria-wide within 3–4 days.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-stone-800" />
              <span>Bachs Payment Gateway: 256-bit encrypted checkout with instant receipt.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-stone-800" />
              <span>Tailored at No 5, 31 Road, Akobo, Ibadan. Custom sizing available upon request.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

