"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatPriceNGN } from "@/lib/utils";
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

const CATEGORIES = [
  { name: "All Apparel", href: "/shop", slug: null },
  {
    name: "Agbada & Traditional",
    href: "/shop?category=agbada-traditional",
    slug: "agbada-traditional",
  },
  {
    name: "Modern Two-Piece",
    href: "/shop?category=modern-two-piece",
    slug: "modern-two-piece",
  },
  {
    name: "Dresses & Gowns",
    href: "/shop?category=dresses",
    slug: "dresses",
  },
  {
    name: "Ready-to-Wear",
    href: "/shop?category=ready-to-wear",
    slug: "ready-to-wear",
  },
];

function DesktopNavLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  return (
    <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-8">
      {CATEGORIES.map((cat) => {
        const isActive =
          pathname === "/shop" &&
          ((cat.slug === null && !currentCategory) ||
            currentCategory === cat.slug);

        return (
          <Link
            key={cat.href}
            href={cat.href}
            className={`relative py-1 text-[11px] uppercase tracking-[0.16em] whitespace-nowrap transition-colors ${
              isActive
                ? "text-stone-950 font-semibold"
                : "text-stone-600 hover:text-stone-950 font-medium"
            }`}
          >
            {cat.name}
          </Link>
        );
      })}
    </nav>
  );
}

export function Navbar() {
  const { totalCount, setIsOpen } = useCart();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
          Akobo, Ibadan Atelier & Showroom • Mon–Sat 10:00 AM • Direct
          Nigeria-Wide Delivery
        </span>
      </div>

      {/* Main Navbar with Softer White */}
      <header className="sticky top-0 z-40 bg-[#f6f3ec]/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
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

          {/* Brand Wordmark */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-xl sm:text-2xl font-black tracking-widest text-stone-950 uppercase font-serif">
                TULLIPIO
              </span>
            </Link>
          </div>

          {/* Desktop Category Navigation */}
          <Suspense
            fallback={
              <div className="hidden lg:flex items-center justify-center gap-6 xl:gap-8" />
            }
          >
            <DesktopNavLinks />
          </Suspense>

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

            {/* User Profile Button with Soft White and Subtle Shadow */}
            <Link
              href="/admin"
              className="w-11 h-11 rounded-2xl bg-[#FAF8F5] border border-stone-200/90 shadow-[0_2px_8px_rgba(28,25,23,0.06)] flex items-center justify-center text-stone-900 hover:border-stone-400 hover:bg-white transition-all"
              aria-label="User Profile"
              title="Account & Atelier Portal"
            >
              <User className="w-5 h-5 stroke-[1.5]" />
            </Link>
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
          <div className="lg:hidden border-t border-stone-200 bg-[#f6f3ec] px-4 pt-3 pb-6 space-y-3 shadow-lg">
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
            <div className="pt-2">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-stone-600 hover:text-stone-950 py-2"
              >
                <User className="w-4 h-4" />
                <span>Account & Profile →</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
