"use client";

import React, { useState } from "react";
import { SeedBanner } from "@/db/seed-data";
import { updateHeroBannerAction } from "@/app/actions/admin-actions";
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
        {/* Form Column */}
        <form onSubmit={handleSave} className="lg:col-span-7 bg-white p-6 border border-stone-200 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Headline *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs p-2.5 border border-stone-300 focus:border-stone-900 bg-stone-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Subtext & Craft Narrative *
            </label>
            <textarea
              rows={3}
              required
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full text-xs p-2.5 border border-stone-300 focus:border-stone-900 bg-stone-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Hero Editorial Image URL (R2 / CDN) *
            </label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full text-xs p-2.5 border border-stone-300 focus:border-stone-900 bg-stone-50/50 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                CTA Button Text *
              </label>
              <input
                type="text"
                required
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                className="w-full text-xs p-2.5 border border-stone-300 focus:border-stone-900 bg-stone-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                CTA Target Route *
              </label>
              <input
                type="text"
                required
                value={ctaLink}
                onChange={(e) => setCtaLink(e.target.value)}
                className="w-full text-xs p-2.5 border border-stone-300 focus:border-stone-900 bg-stone-50/50 font-mono"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-stone-200">
            {savedSuccess && (
              <span className="text-xs text-emerald-700 flex items-center gap-1.5 font-medium">
                <Check className="w-4 h-4" />
                <span>Published to Storefront!</span>
              </span>
            )}
            {!savedSuccess && <div />}

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-stone-950 text-stone-50 text-xs font-semibold uppercase tracking-widest hover:bg-stone-800 transition-colors flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <span>Publish Changes</span>
              )}
            </button>
          </div>
        </form>

        {/* Live Preview Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-stone-500">
            <Eye className="w-4 h-4" />
            <span>Storefront Preview</span>
          </div>

          <div className="relative bg-stone-900 text-stone-100 p-6 aspect-[4/5] flex flex-col justify-end overflow-hidden border border-stone-800">
            <img
              src={imageUrl}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-transparent" />

            <div className="relative z-10 space-y-3">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-stone-800 border border-stone-700">
                Akobo Atelier
              </span>
              <h3 className="text-xl font-serif text-stone-100 leading-tight">
                {title}
              </h3>
              <p className="text-xs text-stone-300 font-light line-clamp-3">
                {subtitle}
              </p>
              <div className="pt-2">
                <span className="inline-block px-4 py-2 bg-stone-100 text-stone-950 text-[10px] font-bold uppercase tracking-widest">
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

