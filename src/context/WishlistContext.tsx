"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";

export interface WishlistItem {
  productId: string;
  name: string;
  slug: string;
  basePrice: number; // in kobo
  frontImageUrl: string;
  categoryName?: string;
  inStock: boolean;
}

interface WishlistContextType {
  items: WishlistItem[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = "tullipio_client_wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize from localStorage on mount (prevents SSR hydration mismatch)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (err) {
      console.warn("Could not load wishlist from localStorage:", err);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync back to localStorage when items update
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.warn("Could not save wishlist to localStorage:", err);
    }
  }, [items, isHydrated]);

  const isInWishlist = useCallback(
    (productId: string) => items.some((i) => i.productId === productId),
    [items]
  );

  const toggleWishlist = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.productId === item.productId);
      if (exists) {
        return prev.filter((i) => i.productId !== item.productId);
      } else {
        return [item, ...prev];
      }
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clearWishlist = useCallback(() => {
    setItems([]);
  }, []);

  const wishlistCount = items.length;

  const value = useMemo(
    () => ({
      items,
      isInWishlist,
      toggleWishlist,
      removeFromWishlist,
      clearWishlist,
      wishlistCount,
    }),
    [items, isInWishlist, toggleWishlist, removeFromWishlist, clearWishlist, wishlistCount]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return ctx;
}

