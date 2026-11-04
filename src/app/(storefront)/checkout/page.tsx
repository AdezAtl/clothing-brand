"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPriceNGN } from "@/lib/utils";
import Link from "next/link";
import {
  ShieldCheck,
  ShoppingBag,
  ArrowLeft,
  Lock,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function CheckoutPage() {
  const { items, totalPrice, totalCount, clearCart } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("Ibadan");
  const [state, setState] = useState("Oyo State");
  const [postalCode, setPostalCode] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError("Your shopping bag is empty.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/checkout/bachs/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress: {
            street,
            city,
            state,
            postalCode,
            notes,
          },
          items: items.map((i) => ({
            variantId: i.variantId,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initialize payment");
      }

      // If successful, redirect to Bachs Checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("No checkout URL returned from payment provider.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during checkout.");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="w-18 h-18 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 shadow-[0_4px_20px_-4px_rgba(28,25,23,0.06)] flex items-center justify-center mx-auto mb-5">
          <ShoppingBag className="w-9 h-9 text-stone-400 stroke-1" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">Your Shopping Bag is Empty</h1>
        <p className="text-stone-500 text-xs sm:text-sm mt-2 max-w-md mx-auto">
          Select your garment and variant choices from the catalog before proceeding to secure checkout.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-stone-900 text-stone-50 text-xs uppercase tracking-widest font-semibold hover:bg-stone-800 transition-all shadow-sm active:scale-98"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Tullipio Garments</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-200/80 pb-6 gap-4">
        <div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 uppercase tracking-wider font-mono mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Catalog</span>
          </Link>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-stone-950">
            Secure Delivery & Payment
          </h1>
        </div>
        <div className="inline-flex items-center gap-2 text-xs font-mono text-stone-700 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200/80 shadow-2xs self-start sm:self-auto">
          <Lock className="w-3.5 h-3.5 text-emerald-700" />
          <span>Bachs 256-Bit SSL Protection</span>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200/80 rounded-xl text-red-800 text-xs flex items-center gap-2 shadow-2xs">
          <strong>Checkout Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left Column: Customer and Shipping Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Contact Details Card — Soft White with Subtle Shadow */}
          <div className="bg-[#FAF8F5] p-6 sm:p-7 rounded-2xl border border-stone-200/80 shadow-[0_4px_20px_-4px_rgba(28,25,23,0.06)] space-y-5">
            <h2 className="text-xs uppercase font-mono tracking-widest text-stone-500">
              1. Customer Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Babatunde Adeleke"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-stone-900 bg-[#F4F1EA]/60 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="babatunde@example.ng"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-stone-900 bg-[#F4F1EA]/60 transition-all"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Phone Number (for Courier Dispatch) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0802 123 4567"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-stone-900 bg-[#F4F1EA]/60 transition-all font-mono"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address Card — Soft White with Subtle Shadow */}
          <div className="bg-[#FAF8F5] p-6 sm:p-7 rounded-2xl border border-stone-200/80 shadow-[0_4px_20px_-4px_rgba(28,25,23,0.06)] space-y-5">
            <h2 className="text-xs uppercase font-mono tracking-widest text-stone-500">
              2. Delivery Address (Nigeria-Wide)
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Street Address & Landmark *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Block 4, Close B, Off General Gas Road, Akobo"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-stone-900 bg-[#F4F1EA]/60 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-stone-900 bg-[#F4F1EA]/60 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-stone-900 bg-[#F4F1EA]/60 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    Postal Code (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="200132"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-stone-900 bg-[#F4F1EA]/60 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Atelier Notes or Custom Measurements (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Chest: 44 inches, Sleeve length: 34 inches, or leave with security gate..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-stone-900 bg-[#F4F1EA]/60 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-5">
          <div className="bg-[#FAF8F5] p-6 sm:p-7 rounded-2xl border border-stone-200/90 shadow-[0_4px_24px_-4px_rgba(28,25,23,0.08)] space-y-6 sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200/80">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-900 font-serif">
                Order Summary ({totalCount})
              </h2>
              <span className="text-xs text-stone-500 font-mono">Bachs Express</span>
            </div>

            {/* Garments Breakdown */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-3 text-xs items-center bg-[#F4F1EA]/80 p-3 rounded-xl border border-stone-200/50">
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-12 h-14 object-cover rounded-lg bg-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-900 truncate">
                      {item.productName}
                    </p>
                    <p className="text-[11px] text-stone-500 font-mono">
                      {item.size} • {item.color} • Qty {item.quantity}
                    </p>
                  </div>
                  <span className="font-mono font-bold text-stone-950">
                    {formatPriceNGN(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 pt-4 border-t border-stone-200/80 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-mono">{formatPriceNGN(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Direct Courier (Ibadan / Nigeria)</span>
                <span className="font-mono text-emerald-800 font-semibold">FREE (Promotional)</span>
              </div>
              <div className="pt-3 border-t border-stone-200 flex justify-between text-base font-bold text-stone-950">
                <span>Total Due</span>
                <span className="font-serif text-lg font-bold">{formatPriceNGN(totalPrice)}</span>
              </div>
            </div>

            {/* Payment Action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-full bg-stone-950 text-stone-50 text-xs font-semibold uppercase tracking-widest hover:bg-stone-800 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer active:scale-98"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-stone-300" />
                  <span>Connecting to Bachs Gateway...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Pay Now with Bachs</span>
                </>
              )}
            </button>

            <div className="p-4 rounded-xl bg-[#F4F1EA]/80 border border-stone-200/60 text-[11px] text-stone-600 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-stone-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Bachs Secure Payment Guarantee</span>
              </div>
              <p className="text-[10px] text-stone-500 leading-normal">
                Your payment is encrypted and routed securely through the live Bachs Nigerian payment gateway. Orders are confirmed and stock reserved instantly.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
