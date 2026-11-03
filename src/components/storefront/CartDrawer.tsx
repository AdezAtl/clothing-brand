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

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          ref={drawerRef}
          className="w-screen max-w-md bg-stone-50 border-l border-stone-200 shadow-2xl flex flex-col text-stone-900"
        >
          {/* Header */}
          <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-100/70">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-stone-700" />
              <h2 className="text-base font-semibold tracking-tight uppercase">
                Shopping Bag ({totalCount})
              </h2>
            </div>
            <button
              onClick={handleClose}
              aria-label="Close cart"
              className="p-2 -mr-2 text-stone-500 hover:text-stone-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <ShoppingBag className="w-12 h-12 text-stone-300 mb-4 stroke-1" />
                <p className="text-stone-600 font-medium text-sm">Your shopping bag is empty</p>
                <p className="text-stone-400 text-xs mt-1">Explore our curated African silhouettes</p>
                <Link
                  href="/shop"
                  onClick={handleClose}
                  className="mt-6 inline-flex items-center justify-center px-6 py-2.5 bg-stone-900 text-stone-50 text-xs font-semibold tracking-widest uppercase hover:bg-stone-800 transition-colors"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex gap-4 pb-6 border-b border-stone-200 last:border-b-0"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-20 h-24 object-cover rounded-none bg-stone-200 flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-medium text-stone-900 leading-snug">
                          {item.productName}
                        </h3>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-stone-400 hover:text-stone-700 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-stone-500">
                        <span>Size: <strong className="text-stone-700">{item.size}</strong></span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-stone-300"
                            style={{ backgroundColor: item.colorHex }}
                          />
                          {item.color}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-stone-300 bg-white">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="p-1.5 hover:bg-stone-100 text-stone-600"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-semibold text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="p-1.5 hover:bg-stone-100 text-stone-600"
                          disabled={item.quantity >= item.maxStock}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-stone-900">
                        {formatPriceNGN(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-stone-100/70 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-stone-600 font-medium">Subtotal</span>
                <span className="text-base font-bold text-stone-900">
                  {formatPriceNGN(totalPrice)}
                </span>
              </div>
              <p className="text-stone-500 text-xs">
                Taxes and delivery calculated at checkout. Direct shipping across Nigeria.
              </p>
              <Link
                href="/checkout"
                onClick={handleClose}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-stone-900 text-stone-50 text-xs font-semibold tracking-widest uppercase hover:bg-stone-800 transition-colors shadow-sm"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

