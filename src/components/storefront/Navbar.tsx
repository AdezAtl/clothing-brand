"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Search, Menu, X, ChevronRight } from "lucide-react";

export function Navbar() {
  const { totalCount, setIsOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { name: "All Apparel", href: "/shop" },
    { name: "Agbada & Traditional", href: "/shop?category=agbada-traditional" },
    { name: "Modern Two-Piece", href: "/shop?category=modern-two-piece" },
    { name: "Dresses & Gowns", href: "/shop?category=dresses" },
    { name: "Ready-to-Wear", href: "/shop?category=ready-to-wear" },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-stone-900 text-stone-200 text-xs py-2 px-4 text-center font-medium tracking-wider">
        <span>Akobo, Ibadan Atelier & Showroom • Mon–Sat 10:00 AM • Direct Nigeria-Wide Delivery</span>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-stone-50/90 backdrop-blur-md border-b border-stone-200 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Mobile menu trigger */}
          <div className="flex items-center gap-4 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 text-stone-700 hover:text-stone-950"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-stone-700 hover:text-stone-950"
              aria-label="Search items"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Wordmark */}
          <div className="flex items-center">
            <Link href="/" className="flex flex-col items-center sm:items-start group">
              <span className="text-xl sm:text-2xl font-black tracking-widest text-stone-950 uppercase font-serif">
                TULLIPIO
              </span>
              <span className="text-[10px] tracking-[0.25em] text-stone-500 uppercase -mt-1 group-hover:text-stone-800 transition-colors">
                Fashion House • Ibadan
              </span>
            </Link>
          </div>

          {/* Desktop Category Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {categories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="text-xs uppercase tracking-widest font-medium text-stone-600 hover:text-stone-950 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Right Utility Actions */}
          <div className="flex items-center space-x-4">
            {/* Desktop Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden lg:flex items-center gap-2 text-xs uppercase tracking-wider text-stone-600 hover:text-stone-950 px-2 py-1"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>

            {/* Admin Link */}
            <Link
              href="/admin"
              className="text-xs uppercase tracking-wider text-stone-500 hover:text-stone-900 hidden sm:inline-block px-2 py-1 border border-stone-200"
            >
              Atelier Admin
            </Link>

            {/* Shopping Cart Trigger */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2 text-stone-900 hover:text-stone-700 transition-colors"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
              {totalCount > 0 && (
                <span className="absolute top-1 right-1 bg-stone-900 text-stone-50 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Overlay Drawer */}
        {searchOpen && (
          <div className="border-t border-stone-200 bg-stone-100/95 px-4 py-4 sm:px-6">
            <div className="max-w-3xl mx-auto flex items-center gap-3">
              <Search className="w-5 h-5 text-stone-400" />
              <input
                type="text"
                placeholder="Search Agbadas, two-piece sets, adire gowns, or linen tunics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
                  }
                }}
                className="w-full bg-transparent border-0 border-b border-stone-400 focus:border-stone-950 focus:ring-0 text-sm text-stone-900 placeholder:text-stone-400 py-1"
                autoFocus
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-xs text-stone-500 hover:text-stone-900 uppercase tracking-wider px-2 py-1"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-stone-50 px-4 pt-3 pb-6 space-y-3">
            {categories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-sm uppercase tracking-wider font-medium text-stone-800 py-2 border-b border-stone-100"
              >
                <span>{cat.name}</span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </Link>
            ))}
            <div className="pt-2">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs uppercase tracking-widest text-stone-500 py-2"
              >
                Atelier Admin Dashboard →
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

