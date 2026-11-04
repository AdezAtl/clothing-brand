"use client";

import React, { useState } from "react";
import { SeedBanner } from "@/db/seed-data";
import { updateHeroBannerAction } from "@/actions";
import { Check, Loader2, Sparkles, Image as ImageIcon, Eye } from "lucide-react";

interface BannerManagerClientProps {
  initialBanner: SeedBanner;
}

export function BannerManagerClient({ initialBanner }: BannerManagerClientProps) {
  const [title, setTitle] = useState(initialBanner.title);
  const [subtitle, setSubtitle] = useState(initialBanner.subtitle);
  const [imageUrl, setImageUrl] = useState(initialBanner.imageUrl);
  const [ctaText, setCtaText] = useState(initialBanner.ctaText);
  const [ctaLink, setCtaLink] = useState(initialBanner.ctaLink);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    const res = await updateHeroBannerAction({
      title,
      subtitle,
      imageUrl,
      ctaText,
      ctaLink,
    });

    setSaving(false);
    if (res.success) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <span className="text-xs font-mono uppercase tracking-widest text-stone-500">
          Storefront Display
        </span>
        <h1 className="text-2xl font-serif text-stone-950 mt-1">
          Hero Banner & Editorial Promotion
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Update the primary headline, imagery, and call-to-action on the Tullipio homepage.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Curvy Form Column */}
        <form onSubmit={handleSave} className="lg:col-span-7 bg-white p-7 sm:p-8 rounded-[28px] border border-stone-200/80 shadow-xs space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Headline *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:border-stone-900 bg-stone-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Subtext & Craft Narrative *
            </label>
            <textarea
              rows={3}
              required
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:border-stone-900 bg-stone-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Hero Editorial Image URL (R2 / CDN) *
            </label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:border-stone-900 bg-stone-50/50 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                CTA Button Text *
              </label>
              <input
                type="text"
                required
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:border-stone-900 bg-stone-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                CTA Target Route *
              </label>
              <input
                type="text"
                required
                value={ctaLink}
                onChange={(e) => setCtaLink(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:border-stone-900 bg-stone-50/50 font-mono"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-stone-100">
            {savedSuccess ? (
              <span className="text-xs text-emerald-700 flex items-center gap-1.5 font-medium px-3 py-1 rounded-full bg-emerald-50">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Published to Storefront!</span>
              </span>
            ) : <span />}

            <button
              type="submit"
              disabled={saving}
              className="px-7 py-3 rounded-full bg-stone-950 text-stone-50 text-xs font-semibold uppercase tracking-widest hover:bg-stone-800 transition-all flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <span>Publish Updates</span>
              )}
            </button>
          </div>
        </form>

        {/* Live Preview Column with Curvy Frame */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-500">
            <Eye className="w-4 h-4" />
            <span>Storefront Live Simulation</span>
          </div>

          <div className="relative aspect-[4/5] rounded-[28px] overflow-hidden bg-stone-900 text-stone-100 p-6 flex flex-col justify-end shadow-md border border-stone-800">
            <img
              src={imageUrl}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover object-top opacity-40 filter contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent" />

            <div className="relative z-10 space-y-3">
              <span className="text-[10px] uppercase font-mono tracking-widest px-3 py-1 rounded-full bg-stone-800/90 text-stone-300 inline-block border border-stone-700/60">
                Akobo, Ibadan
              </span>
              <h3 className="text-xl font-serif font-bold text-stone-50 leading-tight">
                {title}
              </h3>
              <p className="text-xs text-stone-300 line-clamp-2 font-light">
                {subtitle}
              </p>
              <div className="pt-2">
                <span className="inline-block px-5 py-2.5 rounded-full bg-stone-100 text-stone-950 text-[11px] font-semibold uppercase tracking-wider shadow-sm">
                  {ctaText} →
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
