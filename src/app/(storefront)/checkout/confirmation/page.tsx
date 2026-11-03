import React from "react";
import Link from "next/link";
import { CheckCircle, MapPin, ArrowRight, PackageCheck, Phone } from "lucide-react";

interface ConfirmationPageProps {
  searchParams: Promise<{
    orderNumber?: string;
    ref?: string;
  }>;
}

export default async function ConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const resolved = await searchParams;
  const orderNumber = resolved.orderNumber || "TLP-2026-CONFIRMED";
  const ref = resolved.ref || "";

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="inline-flex p-4 bg-emerald-100 text-emerald-800 rounded-full mb-6">
        <CheckCircle className="w-12 h-12" />
      </div>

      <h1 className="text-3xl font-serif text-stone-950 mb-2">
        Order Confirmed
      </h1>
      <p className="text-xs uppercase font-mono tracking-widest text-stone-500 mb-6">
        Order Number: {orderNumber}
      </p>

      <div className="bg-white p-8 border border-stone-200 text-left space-y-4 mb-8 text-xs text-stone-700">
        <div className="flex items-start gap-3 pb-4 border-b border-stone-100">
          <PackageCheck className="w-5 h-5 text-stone-800 shrink-0" />
          <div>
            <h3 className="font-semibold text-stone-900 text-sm">
              Tailoring & Dispatch In Progress
            </h3>
            <p className="text-stone-500 mt-0.5 leading-relaxed">
              Your payment via the Bachs Gateway has been verified. Your garment is entering quality inspection at our Akobo atelier.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 pb-4 border-b border-stone-100">
          <MapPin className="w-5 h-5 text-stone-800 shrink-0" />
          <div>
            <h3 className="font-semibold text-stone-900 text-sm">Atelier Pickup / Direct Dispatch</h3>
            <p className="text-stone-500 mt-0.5 leading-relaxed">
              No 5, 31 Road, Akobo, Ibadan 200132, Oyo State. Direct courier dispatch within 24–48 hours across Ibadan & Lagos.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-stone-800 shrink-0" />
          <div>
            <h3 className="font-semibold text-stone-900 text-sm">Need Adjustments or Sizing Help?</h3>
            <p className="text-stone-500 mt-0.5 leading-relaxed">
              Call our Akobo atelier team directly at <strong className="text-stone-800">0706 366 8847</strong> with reference <code className="font-mono text-stone-900">{ref || orderNumber}</code>.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-stone-900 text-stone-50 text-xs font-semibold uppercase tracking-widest hover:bg-stone-800 transition-colors"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-stone-100 border border-stone-300 text-stone-800 text-xs font-semibold uppercase tracking-widest hover:bg-stone-200 transition-colors font-mono"
        >
          <span>View in Admin Orders →</span>
        </Link>
      </div>
    </div>
  );
}

