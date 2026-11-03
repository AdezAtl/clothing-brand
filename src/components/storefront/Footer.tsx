import React from "react";
import Link from "next/link";
import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <h3 className="text-xl font-serif font-black tracking-widest text-stone-100 uppercase">
              TULLIPIO
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed font-light">
              Tullipio Fashion House blends traditional African silhouettes with modern, timeless tailoring. Hand-crafted and tailored in our Akobo, Ibadan atelier.
            </p>
            <div className="pt-2">
              <span className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-1 bg-stone-900 border border-stone-800 text-stone-400">
                Plus Code: CWCR+F7 Ibadan
              </span>
            </div>
          </div>

          {/* Atelier Contact & Physical Location */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-100">
              Atelier & Showroom
            </h4>
            <div className="space-y-2 text-xs text-stone-400 leading-relaxed">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                <span>
                  No 5, 31 Road, Akobo,<br />
                  Ibadan 200132, Oyo State, Nigeria
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-stone-500 shrink-0" />
                <a href="tel:07063668847" className="hover:text-stone-200 transition-colors">
                  0706 366 8847
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-stone-500 shrink-0" />
                <span>Mon–Sat: 10:00 AM – 7:00 PM</span>
              </div>
              <div className="pt-2">
                <a
                  href="https://maps.app.goo.gl/7YbMyUjvkVybZGtF6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-stone-300 hover:text-white underline underline-offset-4"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Catalog Categories */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-100">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link href="/shop?category=agbada-traditional" className="hover:text-stone-200 transition-colors">
                  Agbada & Traditional Silhouettes
                </Link>
              </li>
              <li>
                <Link href="/shop?category=modern-two-piece" className="hover:text-stone-200 transition-colors">
                  Modern Two-Piece Co-ords
                </Link>
              </li>
              <li>
                <Link href="/shop?category=dresses" className="hover:text-stone-200 transition-colors">
                  Dresses & Sculpted Gowns
                </Link>
              </li>
              <li>
                <Link href="/shop?category=ready-to-wear" className="hover:text-stone-200 transition-colors">
                  Ready-to-Wear Separates
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-stone-200 transition-colors">
                  Full Catalog Index
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer & Atelier Ops */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-100">
              Operations & Admin
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <span className="text-stone-400">Payment: Bachs Secure Payment Gateway (NGN)</span>
              </li>
              <li>
                <span className="text-stone-400">Shipping: Direct dispatch across Nigeria</span>
              </li>
              <li>
                <Link href="/admin" className="text-stone-300 hover:text-white font-mono underline underline-offset-4">
                  → Tullipio Staff Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 font-light">
          <p>© {new Date().getFullYear()} Tullipio Fashion House. All rights reserved. Akobo, Ibadan, Nigeria.</p>
          <p className="font-mono text-[11px]">Clean Architecture • Drizzle ORM • Bachs Payment System</p>
        </div>
      </div>
    </footer>
  );
}

