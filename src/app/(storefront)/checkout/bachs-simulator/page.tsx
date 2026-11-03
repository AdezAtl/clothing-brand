"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { formatPriceNGN } from "@/lib/utils";
import { ShieldCheck, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

function BachsSimulatorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();

  const reference = searchParams.get("reference") || "";
  const amountStr = searchParams.get("amount") || "0";
  const email = searchParams.get("email") || "";
  const amount = parseInt(amountStr, 10);

  const [processing, setProcessing] = useState(false);

  const handleSimulatePayment = async (status: "success" | "failed") => {
    setProcessing(true);

    try {
      await fetch("/api/webhooks/bachs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-bachs-signature": "simulated_sandbox_signature",
        },
        body: JSON.stringify({
          event: status === "success" ? "payment.success" : "payment.failed",
          data: {
            reference,
            amount,
            status: status === "success" ? "paid" : "failed",
            customer: { email },
            paidAt: new Date().toISOString(),
          },
        }),
      });

      if (status === "success") {
        clearCart();
        router.push(
          `/checkout/confirmation?orderNumber=${encodeURIComponent(
            reference
          )}&ref=${encodeURIComponent(reference)}`
        );
      } else {
        alert("Payment was marked as failed in sandbox.");
        router.push("/checkout");
      }
    } catch (e) {
      console.error("Simulation error", e);
      router.push(
        `/checkout/confirmation?orderNumber=${encodeURIComponent(
          reference
        )}&ref=${encodeURIComponent(reference)}`
      );
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 p-8 bg-white border border-stone-300 shadow-xl text-stone-900">
      <div className="text-center pb-6 border-b border-stone-200">
        <div className="inline-flex p-3 bg-stone-900 text-stone-100 mb-3">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold font-serif tracking-tight">
          Bachs Payment Gateway Sandbox
        </h1>
        <p className="text-xs text-stone-500 font-mono mt-1">
          Simulated Payment Environment for Tullipio
        </p>
      </div>

      <div className="py-6 space-y-3 text-xs">
        <div className="flex justify-between py-1 border-b border-stone-100">
          <span className="text-stone-500">Merchant</span>
          <span className="font-semibold text-stone-900">Tullipio Fashion House</span>
        </div>
        <div className="flex justify-between py-1 border-b border-stone-100">
          <span className="text-stone-500">Transaction Ref</span>
          <span className="font-mono text-stone-700">{reference}</span>
        </div>
        <div className="flex justify-between py-1 border-b border-stone-100">
          <span className="text-stone-500">Customer Email</span>
          <span className="text-stone-700">{email}</span>
        </div>
        <div className="flex justify-between py-2 text-sm font-bold border-b border-stone-200">
          <span>Amount Payable</span>
          <span className="font-mono text-emerald-800">{formatPriceNGN(amount)}</span>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <button
          onClick={() => handleSimulatePayment("success")}
          disabled={processing}
          className="w-full py-3.5 bg-emerald-700 text-white text-xs font-semibold uppercase tracking-wider hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2"
        >
          {processing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
          <span>Simulate Successful Payment (200 OK)</span>
        </button>

        <button
          onClick={() => handleSimulatePayment("failed")}
          disabled={processing}
          className="w-full py-2.5 bg-stone-100 text-stone-700 text-xs font-semibold uppercase tracking-wider hover:bg-stone-200 border border-stone-300 transition-colors flex items-center justify-center gap-2"
        >
          <XCircle className="w-4 h-4 text-red-600" />
          <span>Simulate Failed Payment</span>
        </button>
      </div>

      <p className="mt-6 text-[11px] text-center text-stone-400">
        In live production, this redirects to Bachs Hosted Checkout at <code>api.bachspay.com</code>.
      </p>
    </div>
  );
}

export default function BachsSimulatorPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-xs font-mono text-stone-500">
          Loading Bachs payment sandbox session...
        </div>
      }
    >
      <BachsSimulatorContent />
    </Suspense>
  );
}
