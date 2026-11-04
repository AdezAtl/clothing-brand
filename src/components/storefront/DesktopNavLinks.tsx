"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export const CATEGORIES = [
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

function DesktopNavLinksContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams?.get("category");

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

export function DesktopNavLinks() {
  return (
    <Suspense
      fallback={
        <div className="hidden lg:flex items-center justify-center gap-6 xl:gap-8" />
      }
    >
      <DesktopNavLinksContent />
    </Suspense>
  );
}

