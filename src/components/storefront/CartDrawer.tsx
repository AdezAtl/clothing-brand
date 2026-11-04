"use client";

import React, { useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { formatPriceNGN } from "@/lib/utils";
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import anime from "animejs";

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice, totalCount } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (backdropRef.current) {
        anime({
          targets: backdropRef.current,
          opacity: [0, 1],
          duration: 350,
          easing: "easeOutQuad",
        });
      }
      if (drawerRef.current) {
        anime({
          targets: drawerRef.current,
          translateX: ["100%", "0%"],
          duration: 400,
          easing: "easeOutCubic",
        });
      }
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    if (drawerRef.current && backdropRef.current) {
      anime({
        targets: backdropRef.current,
        opacity: [1, 0],
        duration: 250,
        easing: "easeInQuad",
      });
      anime({
        targets: drawerRef.current,
        translateX: ["0%", "100%"],
        duration: 300,
        easing: "easeInCubic",
        complete: () => {
          setIsOpen(false);
        },
      });
    } else {
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={handleClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        {/* Curvy Drawer Container — Balanced Curvature & Warm Palette */}
        <div
          ref={drawerRef}
          className="w-screen max-w-md bg-[#F6F3EC] rounded-l-2xl border-l border-stone-200/85 shadow-2xl flex flex-col text-stone-900 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-stone-200/80 flex items-center justify-between bg-[#FAF8F5]/90 backdrop-blur-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-stone-200/60 text-stone-900">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-semibold tracking-wider uppercase font-serif">
                Shopping Bag ({totalCount})
              </h2>
            </div>
            <button
              onClick={handleClose}
              aria-label="Close cart"
              className="p-2 rounded-xl text-stone-500 hover:text-stone-950 hover:bg-stone-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 flex items-center justify-center mb-4 shadow-sm">
                  <ShoppingBag className="w-8 h-8 text-stone-400 stroke-1" />
                </div>
                <p className="text-stone-800 font-medium text-sm">Your shopping bag is empty</p>
                <p className="text-stone-500 text-xs mt-1">Explore our curated African silhouettes</p>
                <Link
                  href="/shop"
                  onClick={handleClose}
                  className="mt-6 inline-flex items-center justify-center px-7 py-3 rounded-full bg-stone-900 text-stone-50 text-xs font-semibold tracking-widest uppercase hover:bg-stone-800 transition-all shadow-xs active:scale-98"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex gap-4 p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-200/80 shadow-[0_2px_12px_-2px_rgba(28,25,23,0.05)]"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-20 h-24 object-cover rounded-lg bg-stone-200 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-xs font-semibold text-stone-900 leading-snug line-clamp-1">
                          {item.productName}
                        </h3>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-stone-400 hover:text-red-600 p-1 rounded-md transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-stone-500">
                        <span className="px-2 py-0.5 rounded-full bg-stone-200/60 font-mono">
                          {item.size}
                        </span>
                        <span className="capitalize">{item.color}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-200/60">
                      {/* Curvy Quantity Stepper */}
                      <div className="flex items-center border border-stone-200 rounded-full bg-stone-100/80 px-1 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="p-1 rounded-full text-stone-600 hover:text-stone-950 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-mono font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          disabled={item.quantity >= item.maxStock}
                          className="p-1 rounded-full text-stone-600 hover:text-stone-950 disabled:opacity-30 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold font-serif text-stone-950">
                        {formatPriceNGN(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-6 bg-[#FAF8F5] border-t border-stone-200/85 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-500">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatPriceNGN(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Nigeria Delivery (Flat)</span>
                  <span className="font-mono text-emerald-700">Calculated at Checkout</span>
                </div>
                <div className="pt-2 border-t border-stone-100 flex justify-between text-sm font-semibold text-stone-950">
                  <span>Total Due</span>
                  <span className="font-serif text-base font-bold">{formatPriceNGN(totalPrice)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={handleClose}
                className="w-full py-3.5 rounded-full bg-stone-950 text-stone-50 text-xs font-semibold uppercase tracking-widest hover:bg-stone-800 transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <p className="text-[10px] text-center text-stone-400 font-mono">
                🔒 Secured by Bachs Payment System • 256-Bit Encryption
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
