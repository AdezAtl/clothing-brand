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
        <ShoppingBag className="w-16 h-16 text-stone-300 mx-auto mb-4 stroke-1" />
        <h1 className="text-2xl font-serif text-stone-900">Your Shopping Bag is Empty</h1>
        <p className="text-stone-500 text-sm mt-2">
          Select your garment and variant choices from the catalog before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-stone-50 text-xs uppercase tracking-widest font-semibold hover:bg-stone-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Tullipio Garments</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex items-center justify-between border-b border-stone-200 pb-4">
        <div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 uppercase tracking-wider font-mono mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Catalog</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-serif text-stone-950">
            Secure Delivery & Payment
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-stone-600 bg-stone-100 px-3 py-1.5 border border-stone-200">
          <Lock className="w-3.5 h-3.5 text-emerald-700" />
          <span>Bachs 256-Bit SSL Protection</span>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-none">
          <strong>Checkout Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Customer and Shipping Form */}
        <div className="lg:col-span-7 space-y-8">
          {/* Contact Details */}
          <div className="bg-white p-6 border border-stone-200 space-y-4">
            <h2 className="text-xs uppercase font-mono tracking-widest text-stone-500">
              1. Customer Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Babatunde Adeleke"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-stone-300 focus:border-stone-900 focus:ring-0 text-stone-900 bg-stone-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Email Address (for Receipt & Tracking) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="babatunde@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full text-xs p-2.5 border border-stone-300 focus:border-stone-900 focus:ring-0 text-stone-900 bg-stone-50/50"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Phone Number (for Courier Dispatch) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0803 123 4567"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full text-xs p-2.5 border border-stone-300 focus:border-stone-900 focus:ring-0 text-stone-900 bg-stone-50/50"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white p-6 border border-stone-200 space-y-4">
            <h2 className="text-xs uppercase font-mono tracking-widest text-stone-500">
              2. Delivery Address (Nigeria)
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Street Address & Apartment/House No *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 15 General Gas Road, Akobo"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full text-xs p-2.5 border border-stone-300 focus:border-stone-900 focus:ring-0 text-stone-900 bg-stone-50/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ibadan"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-300 focus:border-stone-900 focus:ring-0 text-stone-900 bg-stone-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Oyo State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-300 focus:border-stone-900 focus:ring-0 text-stone-900 bg-stone-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Optional Postal Code
                </label>
                <input
                  type="text"
                  placeholder="200132"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full text-xs p-2.5 border border-stone-300 focus:border-stone-900 focus:ring-0 text-stone-900 bg-stone-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Special Tailoring or Delivery Instructions (e.g. Chest 42&quot;, Height 6ft)
                </label>
                <textarea
                  rows={3}
                  placeholder="Add any specific measurements or landmark delivery notes for our Akobo atelier."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs p-2.5 border border-stone-300 focus:border-stone-900 focus:ring-0 text-stone-900 bg-stone-50/50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Bachs Gateway Button */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-100 p-6 border border-stone-200 space-y-6">
            <h2 className="text-xs uppercase font-mono tracking-widest text-stone-500">
              Order Review ({totalCount} Garments)
            </h2>

            <div className="divide-y divide-stone-200 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.variantId} className="py-3 flex gap-3 text-xs">
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-14 h-16 object-cover bg-stone-200 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-medium text-stone-900">{item.productName}</p>
                      <p className="text-stone-500 text-[11px] mt-0.5">
                        {item.size} • {item.color}
                      </p>
                    </div>
                    <div className="flex justify-between items-baseline font-mono">
                      <span className="text-stone-500">Qty: {item.quantity}</span>
                      <span className="font-semibold text-stone-900">
                        {formatPriceNGN(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-300 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Merchandise Subtotal</span>
                <span className="font-mono font-medium">{formatPriceNGN(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Doorstep Courier (Nigeria)</span>
                <span className="font-mono text-emerald-700 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-base font-bold text-stone-950 pt-2 border-t border-stone-200">
                <span>Total Due</span>
                <span className="font-mono">{formatPriceNGN(totalPrice)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-stone-950 text-stone-50 text-xs font-semibold uppercase tracking-widest hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 shadow-md disabled:bg-stone-400"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Securing Order Session...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Pay with Bachs Payment • {formatPriceNGN(totalPrice)}</span>
                </>
              )}
            </button>

            <div className="text-[11px] text-stone-500 space-y-1.5 pt-2 border-t border-stone-200">
              <p className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-stone-400" />
                <span>All prices stored and settled in Nigerian Naira (₦).</span>
              </p>
              <p className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-stone-400" />
                <span>Inventory is locked atomically upon payment confirmation.</span>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

