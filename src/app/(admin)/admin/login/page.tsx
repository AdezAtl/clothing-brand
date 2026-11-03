"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ArrowRight, AlertCircle } from "lucide-react";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("admin@tullipio.com");
  const [password, setPassword] = useState("AdminTullipio2026!");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (res?.error) {
        setError("Invalid email or password. Access restricted to Tullipio staff.");
        setLoading(false);
      } else {
        router.push(callbackUrl);
      }
    } catch (err: any) {
      setError(err?.message || "Sign in failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 border border-stone-200 shadow-sm text-stone-900">
        <div className="text-center pb-6 border-b border-stone-100">
          <div className="inline-flex p-3 bg-stone-950 text-stone-100 mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-serif font-bold uppercase tracking-widest text-stone-950">
            Tullipio Atelier Access
          </h1>
          <p className="text-xs text-stone-500 font-mono mt-1">
            Sign in to manage inventory, Bachs orders & storefront
          </p>
        </div>

        {error && (
          <div className="my-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Staff Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs p-2.5 border border-stone-300 focus:border-stone-900 focus:ring-0 text-stone-900 bg-stone-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs p-2.5 border border-stone-300 focus:border-stone-900 focus:ring-0 text-stone-900 bg-stone-50/50"
            />
          </div>

          <div className="p-3 bg-stone-50 border border-stone-200 text-[11px] text-stone-600 space-y-1">
            <p className="font-semibold text-stone-800">Default Atelier Credentials:</p>
            <p className="font-mono">admin@tullipio.com / AdminTullipio2026!</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-stone-950 text-stone-50 text-xs font-semibold uppercase tracking-widest hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
          >
            <span>{loading ? "Authenticating..." : "Enter Atelier Console"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center text-xs font-mono text-stone-500">
          Loading authentication form...
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
