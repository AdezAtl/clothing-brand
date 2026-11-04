"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ArrowRight, AlertCircle, RefreshCw, Clock, LogOut } from "lucide-react";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const reason = searchParams.get("reason");

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
        // Mark tab session active and timestamp for 24hr duration
        if (typeof window !== "undefined") {
          sessionStorage.setItem("tullipio_admin_tab_session", "active");
          sessionStorage.setItem("tullipio_admin_login_time", Date.now().toString());
          sessionStorage.setItem("tullipio_just_logged_in", "1");
        }
        router.push(callbackUrl);
      }
    } catch (err: any) {
      setError(err?.message || "Sign in failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-[32px] border border-stone-200/80 shadow-xl text-stone-900">
        <div className="text-center pb-6 border-b border-stone-100">
          <div className="inline-flex p-3.5 bg-stone-950 text-stone-100 rounded-2xl mb-3 shadow-sm">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-serif font-bold uppercase tracking-widest text-stone-950">
            Tullipio Atelier Access
          </h1>
          <p className="text-xs text-stone-500 font-mono mt-1">
            Sign in to manage inventory, Bachs orders & storefront
          </p>
        </div>

        {/* Reason Banner */}
        {reason === "reloaded" && (
          <div className="my-4 p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl text-amber-900 text-xs flex items-center gap-2.5 shadow-2xs">
            <RefreshCw className="w-4 h-4 shrink-0 text-amber-600" />
            <span>Tab reloaded. Re-authentication required for atelier security.</span>
          </div>
        )}

        {reason === "expired" && (
          <div className="my-4 p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl text-amber-900 text-xs flex items-center gap-2.5 shadow-2xs">
            <Clock className="w-4 h-4 shrink-0 text-amber-600" />
            <span>Your 24-hour atelier session has expired. Please log in again.</span>
          </div>
        )}

        {reason === "logged_out" && (
          <div className="my-4 p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-2xl text-emerald-900 text-xs flex items-center gap-2.5 shadow-2xs">
            <LogOut className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>You have been successfully logged out of the Atelier console.</span>
          </div>
        )}

        {reason === "tab_session_required" && (
          <div className="my-4 p-3.5 bg-stone-100 border border-stone-200 rounded-2xl text-stone-700 text-xs flex items-center gap-2.5 shadow-2xs">
            <Lock className="w-4 h-4 shrink-0 text-stone-600" />
            <span>Please log in to initiate an active atelier session in this tab.</span>
          </div>
        )}

        {error && (
          <div className="my-4 p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Staff Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-stone-900 bg-stone-50/60 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-stone-900 bg-stone-50/60 transition-all"
            />
          </div>

          <div className="p-3.5 bg-stone-50 border border-stone-200/80 rounded-2xl text-[11px] text-stone-600 space-y-1">
            <p className="font-semibold text-stone-800">Default Atelier Credentials:</p>
            <p className="font-mono text-stone-600">admin@tullipio.com / AdminTullipio2026!</p>
            <p className="text-[10px] text-stone-400 mt-1">Sessions expire on tab reload or after 24 hours.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-stone-950 text-stone-50 text-xs font-semibold uppercase tracking-widest hover:bg-stone-800 rounded-full transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
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
