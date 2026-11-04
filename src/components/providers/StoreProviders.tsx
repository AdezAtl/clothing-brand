"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

export function StoreProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <WishlistProvider>
        <CartProvider>{children}</CartProvider>
      </WishlistProvider>
    </SessionProvider>
  );
}

