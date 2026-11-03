import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Image as ImageIcon,
  ExternalLink,
  Store,
  MapPin,
  LogOut,
  ShieldAlert,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-100 flex text-stone-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-950 text-stone-300 flex flex-col justify-between shrink-0 hidden md:flex border-r border-stone-800">
        <div>
          {/* Admin Header */}
          <div className="p-6 border-b border-stone-800/80">
            <Link href="/admin" className="flex flex-col">
              <span className="text-lg font-serif font-bold tracking-widest text-stone-100 uppercase">
                TULLIPIO
              </span>
              <span className="text-[10px] tracking-widest text-stone-400 font-mono uppercase">
                Atelier Operations System
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 text-xs">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-none text-stone-300 hover:text-white hover:bg-stone-900 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-stone-400" />
              <span>Operations Overview</span>
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-3 py-2.5 rounded-none text-stone-300 hover:text-white hover:bg-stone-900 transition-colors"
            >
              <Package className="w-4 h-4 text-stone-400" />
              <span>Products & Variant Matrix</span>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-3 py-2.5 rounded-none text-stone-300 hover:text-white hover:bg-stone-900 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-stone-400" />
              <span>Orders & Fulfillment</span>
            </Link>

            <Link
              href="/admin/banners"
              className="flex items-center gap-3 px-3 py-2.5 rounded-none text-stone-300 hover:text-white hover:bg-stone-900 transition-colors"
            >
              <ImageIcon className="w-4 h-4 text-stone-400" />
              <span>Hero Banner Manager</span>
            </Link>
          </nav>
        </div>

        {/* Bottom Atelier Info */}
        <div className="p-4 border-t border-stone-800 text-[11px] space-y-3">
          <div className="flex items-center gap-2 text-stone-400">
            <MapPin className="w-3.5 h-3.5 text-stone-500" />
            <span>Akobo, Ibadan • Active</span>
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between p-2 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Store className="w-3.5 h-3.5" />
              <span>Open Storefront</span>
            </span>
            <ExternalLink className="w-3 h-3 text-stone-500" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-stone-200 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase tracking-widest text-stone-500">
              Atelier Management Console
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 border border-stone-200 font-mono text-stone-700">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Bachs Gateway Connected</span>
            </span>
            <span className="text-stone-500 hidden sm:inline">
              admin@tullipio.com
            </span>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

