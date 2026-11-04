"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { registerCustomerAction } from "@/actions";
import { UserPlus, ArrowRight, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify and try again.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await registerCustomerAction({
        name,
        email,
        password,
      });

      if (!res.success) {
        setError(res.error || "Failed to create account.");
        setLoading(false);
        return;
      }

      setRegistered(true);

      // Sign in automatically
      const loginRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/account",
      });

      if (loginRes?.error) {
        // Fallback to manual login
        router.push("/login?message=Account created successfully. Please sign in.");
      } else {
        router.push("/account");
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-[#FAF8F5] p-8 sm:p-10 rounded-3xl border border-stone-200/90 shadow-[0_8px_30px_rgb(28,25,23,0.06)] text-stone-900">
        <div className="text-center pb-6 border-b border-stone-200/60">
          <div className="inline-flex p-3 bg-stone-950 text-stone-100 rounded-2xl mb-3 shadow-xs">
            <UserPlus className="w-5 h-5 stroke-[1.5]" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-950">
            Create Your Tullipíò Account
          </h1>
          <p className="text-xs text-stone-500 font-sans mt-1">
            Join the Tulips community for expedited bespoke checkout, saved pieces, and atelier releases.
          </p>
        </div>

        {error && (
          <div className="my-4 p-3.5 bg-red-50 border border-red-200/80 rounded-2xl text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {registered && (
          <div className="my-4 p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-2xl text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Account created! Authenticating your session...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-600 mb-1.5 font-medium">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Adeola Adeleke"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-xs sm:text-sm focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-600 mb-1.5 font-medium">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="adeola@example.com"
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
              placeholder="Minimum 6 characters"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-xs sm:text-sm focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-600 mb-1.5 font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-xs sm:text-sm focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading || registered}
            className="w-full mt-2 py-3 px-4 rounded-full bg-stone-950 hover:bg-stone-800 text-stone-50 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-stone-200/60 text-center">
          <p className="text-xs text-stone-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-stone-950 hover:underline underline-offset-4"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

