import React from "react";
import { SEED_REVIEWS } from "@/db/seed-data";
import { Star } from "lucide-react";

export function Testimonials() {
  return (
    <section className="bg-stone-100/70 border-b border-stone-200 py-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mb-12">
          <span className="text-xs uppercase font-mono tracking-widest text-stone-500">
            Client Feedback & Bespoke Orders
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-normal text-stone-950 mt-1">
            Verified Reviews from Ibadan & Lagos
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SEED_REVIEWS.map((review, idx) => (
            <div
              key={idx}
              className="bg-stone-50 p-6 border border-stone-200/80 flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-stone-900 text-stone-900"
                    />
                  ))}
                  <span className="text-xs font-mono ml-2 text-stone-600 font-semibold">
                    5.0 / 5.0
                  </span>
                </div>
                <p className="text-sm text-stone-700 leading-relaxed font-light">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-200 flex justify-between items-baseline text-xs">
                <div>
                  <h4 className="font-semibold text-stone-900">{review.name}</h4>
                  <p className="text-stone-500">{review.location}</p>
                </div>
                <span className="text-[11px] font-mono text-stone-400">
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

