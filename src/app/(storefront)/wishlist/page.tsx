"use client";

import React from "react";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { formatPriceNGN } from "@/lib/utils";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist, wishlistCount } = useWishlist();
  const { addItem, setIsOpen } = useCart();

  const handleMoveToBag = (item: any) => {
    addItem({
      productId: item.productId,
      productName: item.name,
      productSlug: item.slug,
      variantId: `${item.productId}-var-default`,
      sku: `TLP-${item.productId.slice(0, 6)}`,
      size: "M",
      color: "Default",
      colorHex: "#1C1917",
      price: item.basePrice,
      imageUrl: item.frontImageUrl,
      quantity: 1,
      maxStock: 5,
    });
    setIsOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Editorial Header */}
      <div className="mb-10 pb-6 border-b border-stone-200/80 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase font-mono tracking-widest text-stone-500">
            Personal Curations • Tullipíò
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-950 mt-1">
            Saved Garments & Wishlist
          </h1>
          <p className="text-xs text-stone-600 mt-2 max-w-xl leading-relaxed">
            Your personal selection of bespoke Agbadas, co-ords, and sculpted heritage pieces.
          </p>
        </div>

        {wishlistCount > 0 && (
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-mono text-stone-500">
              {wishlistCount} {wishlistCount === 1 ? "piece" : "pieces"} saved
            </span>
            <button
              type="button"
              onClick={clearWishlist}
              className="text-xs uppercase font-medium tracking-wider text-stone-500 hover:text-stone-900 underline underline-offset-4 cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {wishlistCount === 0 ? (
        <div className="py-20 text-center bg-[#FAF8F5] rounded-3xl border border-stone-200/80 p-8 sm:p-12 shadow-sm max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-full bg-stone-100 border border-stone-200/80 flex items-center justify-center mx-auto mb-4 text-stone-400">
            <Heart className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h2 className="text-xl font-serif font-bold text-stone-900">
            Your wishlist is empty
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-md mx-auto leading-relaxed">
            Explore our contemporary collections and tap the heart icon on any silhouette to curate your personal dressing suite.
          </p>
          <div className="mt-8">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-stone-950 text-stone-50 text-xs uppercase tracking-widest font-semibold hover:bg-stone-800 transition-all shadow-sm active:scale-98"
            >
              <span>Explore Garments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {items.map((item) => (
            <div
              key={item.productId}
              className="group flex flex-col bg-[#FAF8F5] rounded-2xl border border-stone-200/75 shadow-[0_4px_20px_-4px_rgba(28,25,23,0.06)] hover:shadow-[0_8px_30px_-6px_rgba(28,25,23,0.12)] transition-all duration-300 overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden bg-[#ECE8DF]">
                <Link href={`/product/${item.slug}`}>
                  <img
                    src={item.frontImageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-104"
                  />
                </Link>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeFromWishlist(item.productId)}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-[#FAF8F5]/90 hover:bg-white text-stone-600 hover:text-rose-600 border border-stone-200/80 shadow-2xs backdrop-blur-xs flex items-center justify-center transition-all cursor-pointer"
                  title="Remove from wishlist"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Details & Actions */}
              <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-[#FAF8F5]">
                <div>
                  <Link href={`/product/${item.slug}`}>
                    <h3 className="text-sm font-semibold text-stone-900 group-hover:text-stone-700 transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-base font-bold text-stone-950 font-serif mt-1.5">
                    {formatPriceNGN(item.basePrice)}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleMoveToBag(item)}
                    className="flex-1 py-2 px-3 rounded-xl bg-stone-950 hover:bg-stone-800 text-stone-50 text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-98 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Bag</span>
                  </button>
                  <Link
                    href={`/product/${item.slug}`}
                    className="py-2 px-3 rounded-xl border border-stone-300 hover:border-stone-500 bg-[#FAF8F5] text-stone-800 text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center active:scale-98"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

