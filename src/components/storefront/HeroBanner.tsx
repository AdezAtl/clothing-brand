import React from "react";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { SeedBanner } from "@/db/seed-data";

interface HeroBannerProps {
  banner: SeedBanner;
}

export function HeroBanner({ banner }: HeroBannerProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Framed Luxury Hero Container — Balanced Curvature */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-900 text-stone-100 border border-stone-800 shadow-lg">
        {/* Architectural Image Backdrop — Subject-focused & Dynamic Gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src={
              banner.imageUrl ||
              "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&q=80&w=1800"
            }
            alt={banner.title}
            className="w-full h-full object-cover object-[center_30%] sm:object-right-top opacity-55 sm:opacity-40 filter brightness-95 contrast-105"
          />
          {/* Mobile bottom-to-top gradient (keeps top section visible, bottom section dark for crisp text); Desktop left-to-right */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/75 to-stone-950/20 sm:bg-gradient-to-r sm:from-stone-950 sm:via-stone-950/85 sm:to-transparent" />
        </div>

        {/* Hero Content — Compact padding on mobile so entire hero fits above fold */}
        <div className="relative z-10 px-5 sm:px-12 lg:px-16 py-8 sm:py-20 lg:py-24">
          <div className="max-w-2xl space-y-4 sm:space-y-6">
            {/* Atelier Pill Badge — Single line on mobile */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-stone-900/85 border border-stone-700/80 text-stone-300 text-[10px] sm:text-xs uppercase tracking-widest font-mono backdrop-blur-xs whitespace-nowrap">
              <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="sm:hidden">Akobo, Ibadan Atelier</span>
              <span className="hidden sm:inline">Atelier & Showroom • Akobo, Ibadan</span>
            </div>

            <h1 className="text-2xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-stone-50 leading-[1.16]">
              {banner.title}
            </h1>

            {/* Subtitle — max 3 lines on mobile */}
            <p className="text-xs sm:text-base lg:text-lg text-stone-300 font-light leading-relaxed max-w-xl line-clamp-3 sm:line-clamp-none">
              {banner.subtitle}
            </p>

            {/* Action Buttons — Single line, centered, no text wrap */}
            <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row gap-2.5 sm:gap-4">
              <Link
                href={banner.ctaLink || "/shop"}
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-stone-100 text-stone-950 text-xs font-semibold tracking-widest uppercase hover:bg-stone-200 transition-all shadow-md active:scale-98 whitespace-nowrap text-center"
              >
                <span className="sm:hidden">Shop New Season</span>
                <span className="hidden sm:inline">{banner.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              </Link>
              <Link
                href="/shop?category=agbada-traditional"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-stone-900/70 backdrop-blur-xs text-stone-200 border border-stone-700 text-xs font-semibold tracking-widest uppercase hover:bg-stone-800/80 transition-all active:scale-98 whitespace-nowrap text-center"
              >
                Agbada Collections
              </Link>
            </div>

            {/* Quick Metrics Cards */}
            <div className="pt-6 sm:pt-8 border-t border-stone-800/80 grid grid-cols-3 gap-2 sm:gap-4 text-xs text-stone-400">
              <div className="p-2.5 sm:p-3.5 rounded-xl bg-stone-950/50 backdrop-blur-xs border border-stone-800/60 text-center sm:text-left">
                <p className="font-semibold text-stone-200 text-xs sm:text-base">280+ GSM</p>
                <p className="tracking-wide text-[10px] sm:text-[11px] text-stone-400 truncate">Structured Textiles</p>
              </div>
              <div className="p-2.5 sm:p-3.5 rounded-xl bg-stone-950/50 backdrop-blur-xs border border-stone-800/60 text-center sm:text-left">
                <p className="font-semibold text-stone-200 text-xs sm:text-base">36-Hour</p>
                <p className="tracking-wide text-[10px] sm:text-[11px] text-stone-400 truncate">Dispatch in Nigeria</p>
              </div>
              <div className="p-2.5 sm:p-3.5 rounded-xl bg-stone-950/50 backdrop-blur-xs border border-stone-800/60 text-center sm:text-left">
                <p className="font-semibold text-stone-200 text-xs sm:text-base">100% Bespoke</p>
                <p className="tracking-wide text-[10px] sm:text-[11px] text-stone-400 truncate">Hand-Finished Seams</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
