import React from "react";
import Link from "next/link";
import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <h3 className="text-xl font-serif font-black tracking-[0.2em] text-stone-100 uppercase">
              TULLIPÍÒ
            </h3>
            <p className="text-xs text-amber-200/90 font-mono tracking-wider uppercase">
              Made in Ìbàdàn, NG • For the explorer in you
            </p>
            <p className="text-xs text-stone-400 leading-relaxed font-light">
              Contemporary womenswear and fashion bridging Nigerian cultural heritage (Aṣọ Òkè and Àdìrẹ) with modern cutting-edge tailoring and architectural structure. Handcrafted for the Tulips in our Akobo, Ibadan atelier.
            </p>
          </div>

          {/* Atelier Contact & Physical Location */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-100">
              Atelier & Showroom
            </h4>
            <div className="space-y-2.5 text-xs text-stone-400 leading-relaxed">
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
            <ul className="space-y-2.5 text-xs text-stone-400">
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
              Customer Care & Delivery
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <span className="text-stone-400">Payment: Verified Secure Checkout</span>
              </li>
              <li>
                <span className="text-stone-400">Shipping: Direct dispatch across Nigeria</span>
              </li>
              <li>
                <span className="text-stone-400">Fittings: Bespoke showroom sessions in Akobo</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 font-light">
          <p>© {new Date().getFullYear()} Tullipíò. All rights reserved. Made in Ìbàdàn, Nigeria.</p>
        </div>
      </div>
    </footer>
  );
}
