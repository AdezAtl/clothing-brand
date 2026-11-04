import React from "react";
import { SEED_REVIEWS } from "@/db/seed-data";
import { Star } from "lucide-react";

export function Testimonials() {
  return (
    <section className="bg-[#f0ece3]/70 border-b border-stone-200/80 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mb-12">
          <span className="text-xs uppercase font-mono tracking-widest text-stone-500">
            Client Feedback & Bespoke Orders
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 mt-1">
            Verified Reviews from Ibadan & Lagos
          </h2>
        </div>

        {/* Testimonial Cards — Softer White with Subtle Shadow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
          {SEED_REVIEWS.map((review, idx) => (
            <div
              key={idx}
              className="bg-[#FAF8F5] p-6 sm:p-7 rounded-2xl border border-stone-200/80 flex flex-col justify-between shadow-[0_4px_20px_-4px_rgba(28,25,23,0.06)] hover:shadow-[0_8px_30px_-6px_rgba(28,25,23,0.12)] transition-all duration-300"
            >
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4F1EA] mb-5 border border-stone-200/60">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-amber-500 text-amber-500"
                    />
                  ))}
                  <span className="text-[11px] font-mono ml-1.5 text-stone-700 font-semibold">
                    5.0 / 5.0
                  </span>
                </div>
                <p className="text-sm text-stone-700 leading-relaxed font-light italic">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-200/60 flex justify-between items-baseline text-xs">
                <div>
                  <h4 className="font-semibold text-stone-900">{review.name}</h4>
                  <p className="text-stone-500 text-[11px] mt-0.5">{review.location}</p>
                </div>
                <span className="text-[10px] font-mono text-stone-400">
                  {review.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
