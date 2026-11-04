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
  Users,
} from "lucide-react";
import { SessionProvider } from "next-auth/react";
import { AdminSessionGuard } from "@/components/admin/AdminSessionGuard";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AdminSessionGuard>
        <div className="min-h-screen bg-stone-100 flex text-stone-900 font-sans">
          {/* Sidebar */}
          <aside className="w-68 bg-stone-950 text-stone-300 flex flex-col justify-between shrink-0 hidden md:flex border-r border-stone-800/80">
            <div>
              {/* Admin Header */}
              <div className="p-6 border-b border-stone-800/80">
                <Link href="/admin" className="flex flex-col">
                  <span className="text-xl font-serif font-bold tracking-widest text-stone-100 uppercase">
                    TULLIPIO
                  </span>
                  <span className="text-[10px] tracking-widest text-stone-400 font-mono uppercase mt-0.5">
                    Atelier Operations System
                  </span>
                </Link>
              </div>

              {/* Navigation Links with Curvy Edges */}
              <nav className="p-4 space-y-1.5 text-xs">
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-stone-300 hover:text-white hover:bg-stone-900 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4 text-stone-400" />
                  <span className="font-medium">Operations Overview</span>
                </Link>

                <Link
                  href="/admin/products"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-stone-300 hover:text-white hover:bg-stone-900 transition-all"
                >
                  <Package className="w-4 h-4 text-stone-400" />
                  <span className="font-medium">Products & Variant Matrix</span>
                </Link>

                <Link
                  href="/admin/orders"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-stone-300 hover:text-white hover:bg-stone-900 transition-all"
                >
                  <ShoppingBag className="w-4 h-4 text-stone-400" />
                  <span className="font-medium">Orders & Fulfillment</span>
                </Link>

                <Link
                  href="/admin/banners"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-stone-300 hover:text-white hover:bg-stone-900 transition-all"
                >
                  <ImageIcon className="w-4 h-4 text-stone-400" />
                  <span className="font-medium">Hero Banner Manager</span>
                </Link>

                <Link
                  href="/admin/users"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-stone-300 hover:text-white hover:bg-stone-900 transition-all"
                >
                  <Users className="w-4 h-4 text-stone-400" />
                  <span className="font-medium">Staff & User Privileges</span>
                </Link>
              </nav>
            </div>

            {/* Bottom Atelier Info & Sign Out */}
            <div className="p-4 border-t border-stone-800/80 text-[11px] space-y-3">
              <div className="flex items-center gap-2 px-1 text-stone-400">
                <MapPin className="w-3.5 h-3.5 text-stone-500" />
                <span>Akobo, Ibadan • Active</span>
              </div>

              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-between p-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white transition-all border border-stone-800/60"
              >
                <span className="flex items-center gap-2">
                  <Store className="w-3.5 h-3.5" />
                  <span>Open Storefront</span>
                </span>
                <ExternalLink className="w-3 h-3 text-stone-500" />
              </Link>

              {/* Sidebar Logout Button */}
              <AdminLogoutButton variant="sidebar" />
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Top Header */}
            <header className="h-16 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-6 flex items-center justify-between sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono uppercase tracking-widest text-stone-500">
                  Atelier Management Console
                </span>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 text-xs">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 border border-stone-200 rounded-full font-mono text-stone-700 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Bachs Live</span>
                </span>

                <span className="text-stone-500 hidden sm:inline font-mono text-[11px]">
                  admin@tullipio.com
                </span>

                {/* Top Header Logout Button */}
                <AdminLogoutButton variant="header" />
              </div>
            </header>

            {/* Content Body */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </AdminSessionGuard>
    </SessionProvider>
  );
}
