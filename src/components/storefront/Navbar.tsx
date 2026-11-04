"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPriceNGN } from "@/lib/utils";
import { DesktopNavLinks, CATEGORIES } from "./DesktopNavLinks";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  ChevronRight,
  User,
  Loader2,
  ArrowRight,
  ArrowUpRight,
  Heart,
  LogOut,
  LogIn,
  UserPlus,
  Shield,
} from "lucide-react";

interface SearchProductResult {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  frontImageUrl: string;
  categoryName: string;
  colors: string[];
  colorHexes?: string[];
  inStock: boolean;
  totalStock: number;
}

export function Navbar() {
  const { totalCount, setIsOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Account dropdown state
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const isAuthenticated = status === "authenticated" && !!session?.user;

  // Live auto-search state
  const [searchResults, setSearchResults] = useState<SearchProductResult[]>([]);
  const [totalMatches, setTotalMatches] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Live search debounced query effect
  useEffect(() => {
    const trimmed = searchQuery.trim();

    if (!trimmed) {
      setSearchResults([]);
      setTotalMatches(0);
      setIsSearching(false);
      setSelectedIndex(-1);
      return;
    }

    setIsSearching(true);
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/products/search?q=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal }
        );
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.products || []);
          setTotalMatches(data.totalMatches || 0);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.warn("Search fetch error:", err);
        }
      } finally {
        setIsSearching(false);
      }
    }, 160);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery]);

  // Focus input when search opens (keeps searchQuery preserved so user doesn't retype)
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSelectedIndex(-1);
    }
  }, [searchOpen]);

  // Handle outside clicks/taps to close search on desktop and mobile without wiping searchQuery
  useEffect(() => {
    if (!searchOpen) return;

    function handleClickOutside(e: MouseEvent | TouchEvent) {
      const target = e.target as Node;
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(target)
      ) {
        const isTrigger = (target as HTMLElement)?.closest?.(
          '[data-search-trigger="true"]'
        );
        if (!isTrigger) {
          setSearchOpen(false);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [searchOpen]);

  // Handle outside clicks to close account dropdown
  useEffect(() => {
    if (!accountMenuOpen) return;
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(e.target as Node)
      ) {
        setAccountMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [accountMenuOpen]);

  // Handle outside clicks/taps to close mobile menu
  useEffect(() => {
    if (!mobileMenuOpen) return;
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      const target = e.target as Node;
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        mobileTriggerRef.current &&
        !mobileTriggerRef.current.contains(target)
      ) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (selectedIndex >= 0 && searchResults[selectedIndex]) {
      const selected = searchResults[selectedIndex];
      setSearchOpen(false);
      router.push(`/product/${selected.slug}`);
      return;
    }

    if (searchQuery.trim()) {
      setSearchOpen(false);
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setSearchOpen(false);
      return;
    }

    if (searchResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < searchResults.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : searchResults.length - 1
      );
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-stone-900 text-stone-200 text-xs py-2 px-4 text-center font-medium tracking-wider">
        <span>
          Made in Ìbàdàn, NG • &ldquo;For the explorer in you&rdquo; • Akobo Atelier • Direct Nigeria-Wide Delivery
        </span>
      </div>

      {/* Main Navbar with Softer White */}
      <header className="sticky top-0 z-40 bg-[#f6f3ec]/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              ref={mobileTriggerRef}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 text-stone-700 hover:text-stone-950"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <button
              data-search-trigger="true"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-stone-700 hover:text-stone-950"
              aria-label="Search items"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Wordmark & Emblem Mark */}
          <div className="flex items-center shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-2.5 group py-1"
              aria-label="Tullipíò Home"
            >
              <img
                src="/brand/emblem.png"
                alt="Tullipíò Emblem"
                className="h-7 sm:h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <span className="text-xl sm:text-2xl font-black tracking-[0.22em] text-stone-950 uppercase font-serif transition-colors group-hover:text-stone-700">
                TULLIPÍÒ
              </span>
            </Link>
          </div>

          {/* Desktop Category Navigation */}
          <DesktopNavLinks />

          {/* Right Utility Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Desktop Search Toggle */}
            <button
              data-search-trigger="true"
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden lg:flex items-center gap-2 text-xs uppercase tracking-wider text-stone-600 hover:text-stone-950 px-2.5 py-2 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>

            {/* Rounded Shopping Bag Button with Soft White and Subtle Shadow */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative w-11 h-11 rounded-2xl bg-[#FAF8F5] border border-stone-200/90 shadow-[0_2px_8px_rgba(28,25,23,0.06)] flex items-center justify-center text-stone-900 hover:border-stone-400 hover:bg-white transition-all cursor-pointer active:scale-96"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-stone-900 text-stone-50 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {totalCount}
                </span>
              )}
            </button>

            {/* User Profile Button & Account Dropdown Menu */}
            <div ref={accountDropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className={`w-11 h-11 rounded-2xl border shadow-[0_2px_8px_rgba(28,25,23,0.06)] flex items-center justify-center transition-all cursor-pointer active:scale-96 ${
                  accountMenuOpen
                    ? "bg-white border-stone-900 text-stone-950"
                    : "bg-[#FAF8F5] border-stone-200/90 text-stone-900 hover:border-stone-400 hover:bg-white"
                }`}
                aria-label="User Account Menu"
                aria-expanded={accountMenuOpen}
              >
                <User className="w-5 h-5 stroke-[1.5]" />
              </button>

              {/* Account Dropdown Popover */}
              {accountMenuOpen && (
                <div className="absolute right-0 top-full mt-2.5 w-60 bg-[#FAF8F5] rounded-2xl border border-stone-200/90 shadow-[0_12px_40px_-8px_rgba(28,25,23,0.14)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {isAuthenticated ? (
                    <>
                      {/* Signed In Header */}
                      <div className="px-4 py-3 bg-[#F4F1EA] border-b border-stone-200/70">
                        <p className="text-xs font-semibold text-stone-950 truncate">
                          {session.user?.name || "Tullipíò Member"}
                        </p>
                        <p className="text-[10px] font-mono text-stone-500 truncate mt-0.5">
                          {session.user?.email}
                        </p>
                      </div>

                      {/* Signed In Links */}
                      <div className="py-1 text-xs">
                        <Link
                          href="/account"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-stone-700 hover:text-stone-950 hover:bg-[#F4F1EA] transition-colors"
                        >
                          <User className="w-4 h-4 text-stone-500" />
                          <span>My Account</span>
                        </Link>

                        <Link
                          href="/wishlist"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center justify-between px-4 py-2.5 text-stone-700 hover:text-stone-950 hover:bg-[#F4F1EA] transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Heart className="w-4 h-4 text-stone-500" />
                            <span>Wishlist</span>
                          </div>
                          {wishlistCount > 0 && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-950 text-stone-50 font-semibold">
                              {wishlistCount}
                            </span>
                          )}
                        </Link>

                        {(session.user as any)?.role === "admin" && (
                          <Link
                            href="/admin"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-stone-700 hover:text-stone-950 hover:bg-[#F4F1EA] transition-colors"
                          >
                            <Shield className="w-4 h-4 text-stone-500" />
                            <span>Atelier Dashboard</span>
                          </Link>
                        )}

                        <div className="my-1 border-t border-stone-200/60" />

                        <button
                          type="button"
                          onClick={() => {
                            setAccountMenuOpen(false);
                            signOut({ callbackUrl: "/" });
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-stone-700 hover:text-rose-700 hover:bg-rose-50/50 transition-colors cursor-pointer text-left"
                        >
                          <LogOut className="w-4 h-4 text-stone-500" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Signed Out Menu */}
                      <div className="px-4 py-3 bg-[#F4F1EA] border-b border-stone-200/70">
                        <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-stone-500 block">
                          Tullipíò Atelier
                        </span>
                        <p className="text-xs font-serif font-bold text-stone-950 mt-0.5">
                          Join the Tulips
                        </p>
                      </div>

                      <div className="py-1 text-xs">
                        <Link
                          href="/login"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-stone-800 hover:text-stone-950 hover:bg-[#F4F1EA] font-semibold transition-colors"
                        >
                          <LogIn className="w-4 h-4 text-stone-500" />
                          <span>Log In</span>
                        </Link>

                        <Link
                          href="/register"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-stone-700 hover:text-stone-950 hover:bg-[#F4F1EA] transition-colors"
                        >
                          <UserPlus className="w-4 h-4 text-stone-500" />
                          <span>Sign Up</span>
                        </Link>

                        <div className="my-1 border-t border-stone-200/60" />

                        <Link
                          href="/wishlist"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center justify-between px-4 py-2.5 text-stone-700 hover:text-stone-950 hover:bg-[#F4F1EA] transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Heart className="w-4 h-4 text-stone-500" />
                            <span>Wishlist</span>
                          </div>
                          {wishlistCount > 0 && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-950 text-stone-50 font-semibold">
                              {wishlistCount}
                            </span>
                          )}
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search Overlay Drawer with Live Auto-Search Popup */}
        {searchOpen && (
          <>
            {/* Click-outside backdrop for mobile & desktop */}
            <div
              onClick={() => setSearchOpen(false)}
              className="fixed inset-0 top-20 z-30 bg-stone-950/25 backdrop-blur-[1px] transition-opacity"
              aria-hidden="true"
            />

            <div className="relative z-40 border-t border-stone-200/80 bg-[#f6f3ec]/98 backdrop-blur-md px-4 py-4 sm:px-6 shadow-md">
              <div ref={searchContainerRef} className="max-w-xl mx-auto relative">
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center gap-3 bg-[#FAF8F5] px-4 py-2.5 rounded-full border border-stone-300 shadow-[0_2px_12px_rgba(28,25,23,0.06)] focus-within:border-stone-900 focus-within:ring-1 focus-within:ring-stone-900 transition-all"
                >
                  <Search className="w-4 h-4 text-stone-400 shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search Agbadas, two-piece sets, adire gowns, or linen tunics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent border-0 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 py-0.5 outline-none font-sans"
                  />

                  {isSearching && (
                    <Loader2 className="w-4 h-4 text-stone-400 animate-spin shrink-0" />
                  )}

                  {searchQuery.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        searchInputRef.current?.focus();
                      }}
                      className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 cursor-pointer"
                      title="Clear search text"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="text-xs text-stone-500 hover:text-stone-950 uppercase tracking-wider px-2 py-1 font-medium shrink-0 border-l border-stone-200 pl-3 cursor-pointer"
                  >
                    Close
                  </button>
                </form>

                {/* Search Results Popover — 576px max-w-xl, clean 2-line stack, color swatches */}
                {searchQuery.trim().length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2.5 bg-[#FAF8F5] rounded-2xl border border-stone-200/90 shadow-[0_12px_40px_-8px_rgba(28,25,23,0.14)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Header */}
                    <div className="px-5 py-3 bg-[#F4F1EA] border-b border-stone-200/70 flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-500">
                        {isSearching
                          ? "Scanning atelier catalog..."
                          : `Found ${totalMatches} Matching ${
                              totalMatches === 1 ? "Garment" : "Garments"
                            }`}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400 hidden sm:inline">
                        ESC to close
                      </span>
                    </div>

                    {/* Results List */}
                    <div className="divide-y divide-stone-200/60 max-h-[380px] overflow-y-auto">
                      {searchResults.length > 0 ? (
                        searchResults.map((product, idx) => {
                          const isHighlighted = idx === selectedIndex;
                          return (
                            <Link
                              key={product.id}
                              href={`/product/${product.slug}`}
                              onClick={() => setSearchOpen(false)}
                              className={`group flex items-center gap-4 px-5 py-3.5 transition-colors ${
                                isHighlighted
                                  ? "bg-[#EDE9E0]"
                                  : "hover:bg-[#F4F1EA]"
                              }`}
                            >
                              {/* Portrait Garment Thumbnail */}
                              <img
                                src={product.frontImageUrl}
                                alt={product.name}
                                className="w-12 h-16 rounded-lg object-cover object-top bg-[#ECE8DF] border border-stone-200/60 shrink-0 shadow-2xs"
                              />

                              {/* Center: Clean 2-Line Stack */}
                              <div className="flex-1 min-w-0">
                                {/* Line 1 (Eyebrow): Category name + tiny inline dot if in stock */}
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-stone-400 truncate">
                                    {product.categoryName || "Tullipio Collection"}
                                  </span>
                                  <span className="text-stone-300">•</span>
                                  <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-700 shrink-0">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    {product.inStock ? "In Stock" : "Sold Out"}
                                  </span>
                                </div>

                                {/* Line 2 (Primary): Full Product Title with room to breathe */}
                                <h4 className="text-sm font-medium text-stone-950 truncate group-hover:text-stone-700 transition-colors">
                                  {product.name}
                                </h4>
                              </div>

                              {/* Right: Price & Color Swatches + subtle ArrowUpRight on hover */}
                              <div className="text-right shrink-0 flex flex-col items-end gap-1.5 pl-3">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-sm font-serif font-bold text-stone-950">
                                    {formatPriceNGN(product.basePrice)}
                                  </span>
                                  <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                                </div>

                                {/* Mini Color Dots instead of long text */}
                                {product.colorHexes && product.colorHexes.length > 0 ? (
                                  <div className="flex items-center gap-1">
                                    {product.colorHexes.slice(0, 4).map((hex, i) => (
                                      <span
                                        key={i}
                                        className="w-2.5 h-2.5 rounded-full border border-stone-300 shadow-2xs"
                                        style={{ backgroundColor: hex }}
                                        title={hex}
                                      />
                                    ))}
                                  </div>
                                ) : null}
                              </div>
                            </Link>
                          );
                        })
                      ) : !isSearching ? (
                        <div className="p-8 text-center space-y-2">
                          <p className="text-xs sm:text-sm font-medium text-stone-800">
                            No garments found matching &ldquo;{searchQuery}&rdquo;
                          </p>
                          <p className="text-xs text-stone-500 max-w-sm mx-auto">
                            Try searching by garment category like &ldquo;Agbada&rdquo;, &ldquo;Two-Piece&rdquo;, &ldquo;Dress&rdquo;, &ldquo;Adire&rdquo;, or &ldquo;Linen&rdquo;.
                          </p>
                        </div>
                      ) : null}
                    </div>

                    {/* Footer CTA */}
                    {totalMatches > 0 && (
                      <button
                        type="button"
                        onClick={() => handleSearchSubmit()}
                        className="w-full flex items-center justify-center gap-2 py-3.5 px-5 bg-[#F4F1EA] hover:bg-[#EDE9E0] border-t border-stone-200/80 text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-stone-900 transition-colors cursor-pointer"
                      >
                        <span>View All {totalMatches} Results in Full Catalog</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <>
            {/* Click-outside backdrop for mobile menu */}
            <div
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 top-20 z-30 bg-stone-950/25 backdrop-blur-[1px] lg:hidden transition-opacity"
              aria-hidden="true"
            />

            <div
              ref={mobileMenuRef}
              className="relative z-40 lg:hidden border-t border-stone-200 bg-[#f6f3ec] px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150"
            >
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-sm uppercase tracking-wider font-medium text-stone-800 py-2 border-b border-stone-200/60"
                >
                  <span>{cat.name}</span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </Link>
              ))}
              {/* Account & Wishlist Links in Mobile Menu */}
              <div className="pt-3 border-t border-stone-200/80 space-y-2">
                <Link
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-xs uppercase tracking-widest text-stone-700 hover:text-stone-950 py-2"
                >
                  <div className="flex items-center gap-2.5">
                    <Heart className="w-4 h-4 text-stone-500" />
                    <span>Wishlist</span>
                  </div>
                  {wishlistCount > 0 && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-950 text-stone-50 font-semibold">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {isAuthenticated ? (
                  <>
                    <Link
                      href="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between text-xs uppercase tracking-widest text-stone-700 hover:text-stone-950 py-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <User className="w-4 h-4 text-stone-500" />
                        <span>Account ({session.user?.name || "Member"})</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-400" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="w-full flex items-center gap-2.5 text-xs uppercase tracking-widest text-rose-700 py-2 cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2.5 pt-1">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 text-center py-2.5 rounded-xl bg-stone-950 text-stone-50 text-xs font-semibold uppercase tracking-wider"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 text-center py-2.5 rounded-xl border border-stone-300 text-stone-800 text-xs font-semibold uppercase tracking-wider"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
}
