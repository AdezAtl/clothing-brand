import React from "react";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { SeedBanner } from "@/db/seed-data";

interface HeroBannerProps {
  banner: SeedBanner;
}

export function HeroBanner({ banner }: HeroBannerProps) {
  return (
    <section className="relative bg-stone-900 text-stone-100 overflow-hidden">
      {/* Background with Dark Subtle Gradient & Architectural Crop */}
      <div className="absolute inset-0 z-0">
        <img
          src={banner.imageUrl}
          alt={banner.title}
          className="w-full h-full object-cover object-top opacity-35 filter brightness-90 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-800/80 border border-stone-700 text-stone-300 text-xs uppercase tracking-widest font-mono">
            <MapPin className="w-3.5 h-3.5 text-stone-400" />
            <span>Atelier & Showroom: Akobo, Ibadan</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-stone-50 leading-[1.1]">
            {banner.title}
          </h1>

          <p className="text-base sm:text-lg text-stone-300 font-light leading-relaxed max-w-xl">
            {banner.subtitle}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <Link
              href={banner.ctaLink || "/shop"}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-stone-100 text-stone-950 text-xs font-semibold tracking-widest uppercase hover:bg-stone-200 transition-colors shadow-lg"
            >
              <span>{banner.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/shop?category=agbada-traditional"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-stone-200 border border-stone-600 text-xs font-semibold tracking-widest uppercase hover:bg-stone-800/60 transition-colors"
            >
              Agbada Collections
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-8 border-t border-stone-800/80 grid grid-cols-3 gap-4 text-xs text-stone-400">
            <div>
              <p className="font-semibold text-stone-200 text-base">280+ GSM</p>
              <p className="tracking-wide">Structured Textiles</p>
            </div>
            <div>
              <p className="font-semibold text-stone-200 text-base">36-Hour</p>
              <p className="tracking-wide">Dispatch to Lagos/Ibadan</p>
            </div>
            <div>
              <p className="font-semibold text-stone-200 text-base">100% Bespoke</p>
              <p className="tracking-wide">Hand-Finished Seams</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

