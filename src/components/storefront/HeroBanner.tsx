import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SeedBanner } from "@/db/seed-data";

interface HeroBannerProps {
  banner: SeedBanner;
}

export function HeroBanner({ banner }: HeroBannerProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 sm:py-8">
      <div className="relative rounded-3xl bg-stone-950 text-stone-100 overflow-hidden border border-stone-800/80 shadow-xl">
        {/* Background Editorial Image */}
        <div className="relative h-[300px] sm:h-[380px] lg:absolute lg:inset-0 lg:h-full w-full overflow-hidden">
          <img
            src={banner.imageUrl}
            alt={banner.title}
            className="w-full h-full object-cover object-[center_20%] lg:object-[70%_20%] opacity-90 lg:opacity-55 transition-transform duration-700"
          />
          {/* Mobile gradient: keeps top 65% clear for the model's face, blends smoothly into stone-950 at the bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent lg:hidden" />
          {/* Desktop gradient: darkens left side for text, keeps right side clear for the garment */}
          <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/85 to-stone-950/10" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 px-5 pb-8 pt-6 sm:px-8 sm:pb-10 lg:px-14 lg:py-20 -mt-12 sm:-mt-16 lg:mt-0">
          <div className="max-w-xl space-y-4 sm:space-y-6">
            {/* Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-normal tracking-tight text-stone-50 leading-[1.12]">
              {banner.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-base text-stone-300 font-light leading-relaxed max-w-lg">
              {banner.subtitle}
            </p>

            {/* Compact Dual CTA Row */}
            <div className="pt-2 flex flex-row items-center gap-2.5 sm:gap-4">
              <Link
                href={banner.ctaLink || "/shop"}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-3.5 rounded-full bg-stone-100 text-stone-950 text-[11px] sm:text-xs font-semibold tracking-[0.14em] uppercase hover:bg-white transition-all shadow-md whitespace-nowrap"
              >
                <span>Shop Season</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </Link>

              <Link
                href="/shop?category=agbada-traditional"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center px-4 sm:px-7 py-3.5 rounded-full bg-stone-900/90 text-stone-200 border border-stone-700 text-[11px] sm:text-xs font-semibold tracking-[0.14em] uppercase hover:bg-stone-800 hover:border-stone-500 transition-all whitespace-nowrap"
              >
                Agbada Sets
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}