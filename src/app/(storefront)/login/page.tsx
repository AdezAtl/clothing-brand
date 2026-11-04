"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Lock, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

function CustomerLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        setError("Invalid email or password. Please try again or create an account.");
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "Sign in failed");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-[#FAF8F5] p-8 sm:p-10 rounded-3xl border border-stone-200/90 shadow-[0_8px_30px_rgb(28,25,23,0.06)] text-stone-900">
      <div className="text-center pb-6 border-b border-stone-200/60">
        <div className="inline-flex p-3 bg-stone-950 text-stone-100 rounded-2xl mb-3 shadow-xs">
          <User className="w-5 h-5 stroke-[1.5]" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-stone-950">
          Welcome to Tullipíò
        </h1>
        <p className="text-xs text-stone-500 font-sans mt-1">
          Sign in to view your orders, saved pieces, and bespoke atelier appointments.
        </p>
      </div>

      {error && (
        <div className="my-4 p-3.5 bg-red-50 border border-red-200/80 rounded-2xl text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-600 mb-1.5 font-medium">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-xs sm:text-sm focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-600 mb-1.5 font-medium">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-xs sm:text-sm focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 px-4 rounded-full bg-stone-950 hover:bg-stone-800 text-stone-50 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-stone-200/60 text-center space-y-2">
        <p className="text-xs text-stone-600">
          Don&apos;t have an account yet?{" "}
          <Link
            href="/register"
            className="font-semibold text-stone-950 hover:underline underline-offset-4"
          >
            Create an Account
          </Link>
        </p>

        <p className="text-[11px] text-stone-400">
          Atelier staff?{" "}
          <Link
            href="/admin/login"
            className="text-stone-600 hover:text-stone-900 underline underline-offset-2"
          >
            Staff Portal
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <Suspense
        fallback={
          <div className="p-8 text-center text-xs font-mono text-stone-500">
            Loading authentication...
          </div>
        }
      >
        <CustomerLoginForm />
      </Suspense>
    </div>
  );
}

