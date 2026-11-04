"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/context/WishlistContext";
import { deleteAccountAction } from "@/actions";
import {
  User,
  Heart,
  Package,
  ShieldAlert,
  LogOut,
  ArrowRight,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const { wishlistCount } = useWishlist();
  const router = useRouter();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (status === "loading") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
      </div>
    );
  }

  if (status === "unauthenticated" || !session?.user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#FAF8F5] border border-stone-200/80 shadow-md">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4 text-stone-700">
            <User className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-950">
            Account Access
          </h1>
          <p className="text-xs text-stone-500 mt-2 leading-relaxed">
            Please sign in to view your profile, manage your wishlisted garments, and track your orders.
          </p>

          <div className="mt-8 space-y-3">
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-stone-950 text-stone-50 text-xs uppercase tracking-widest font-semibold hover:bg-stone-800 transition-all shadow-sm"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/register"
              className="w-full inline-flex items-center justify-center py-3 px-5 rounded-full border border-stone-300 bg-[#FAF8F5] text-stone-800 text-xs uppercase tracking-widest font-semibold hover:bg-stone-100 transition-all"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const user = session.user;
  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : "T";
  const isAdmin = (user as any).role === "admin";

  const handleDeleteAccount = async () => {
    if (deleteConfirmText.trim().toLowerCase() !== "delete") {
      setDeleteError("Please type DELETE to confirm account deletion.");
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const res = await deleteAccountAction();
      if (!res.success) {
        setDeleteError(res.error || "Failed to delete account. Please try again.");
        setIsDeleting(false);
        return;
      }

      await signOut({ callbackUrl: "/" });
    } catch (err: any) {
      setDeleteError(err?.message || "An error occurred while deleting your account.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Profile Overview Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF8F5] border border-stone-200/80 shadow-[0_4px_24px_-4px_rgba(28,25,23,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="w-16 h-16 rounded-2xl bg-stone-950 text-stone-50 font-serif text-2xl font-bold flex items-center justify-center shrink-0 shadow-sm">
            {userInitial}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-950">
                {user.name || "Tullipíò Explorer"}
              </h1>
              <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-stone-200/80 text-stone-800 font-semibold border border-stone-300/60">
                {isAdmin ? "Atelier Staff" : "Member"}
              </span>
            </div>
            <p className="text-xs text-stone-500 font-mono mt-1">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              href="/admin"
              className="py-2.5 px-4 rounded-xl bg-stone-900 text-stone-100 hover:bg-stone-800 text-xs font-semibold uppercase tracking-wider transition-all"
            >
              Atelier Dashboard
            </Link>
          )}

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-xl border border-stone-300 hover:border-stone-500 bg-[#FAF8F5] text-stone-800 hover:text-stone-950 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Wishlist Shortcut */}
        <Link
          href="/wishlist"
          className="group p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 shadow-2xs hover:shadow-md hover:border-stone-300 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-200/60">
              <Heart className="w-5 h-5 fill-rose-600" />
            </div>
            <span className="text-xl font-serif font-bold text-stone-950">
              {wishlistCount}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-900 group-hover:text-stone-700 transition-colors">
              Saved Garments & Wishlist
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              View your curated bespoke Agbadas and co-ords
            </p>
          </div>
        </Link>

        {/* Orders Card */}
        <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-stone-100 text-stone-800 border border-stone-200/80">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Active
            </span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-900">
              Orders & Deliveries
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Direct Nigeria-wide delivery dispatched from Akobo atelier
            </p>
          </div>
        </div>

        {/* Concierge & Bespoke Fitting */}
        <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/60">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500">
              Showroom
            </span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-900">
              Akobo Fitting Concierge
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Book personalized measurement sessions at our Ibadan atelier
            </p>
          </div>
        </div>
      </div>

      {/* Account Settings & Danger Zone */}
      <div className="rounded-3xl bg-[#FAF8F5] border border-stone-200/80 shadow-sm overflow-hidden divide-y divide-stone-200/60">
        <div className="p-6 sm:p-8">
          <h2 className="text-lg font-serif font-bold text-stone-950 mb-1">
            Account Preferences
          </h2>
          <p className="text-xs text-stone-500">
            Manage your personal profile and atelier notifications.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-white border border-stone-200/70">
              <span className="text-stone-400 font-mono uppercase text-[10px] block mb-1">
                Full Name
              </span>
              <span className="font-semibold text-stone-900">{user.name || "Not provided"}</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-stone-200/70">
              <span className="text-stone-400 font-mono uppercase text-[10px] block mb-1">
                Email Address
              </span>
              <span className="font-semibold text-stone-900">{user.email}</span>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-6 sm:p-8 bg-red-50/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-red-700">
                <ShieldAlert className="w-4 h-4" />
                <h3 className="text-sm font-bold uppercase tracking-wider font-mono">
                  Danger Zone
                </h3>
              </div>
              <p className="text-xs text-stone-600 mt-1">
                Permanently delete your Tullipíò account, saved wishlists, and order records.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowDeleteModal(true);
                setDeleteError(null);
                setDeleteConfirmText("");
              }}
              className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-xs shrink-0 cursor-pointer active:scale-98"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full bg-[#FAF8F5] p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-2xl space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-serif font-bold text-stone-950">
                Are you absolutely sure?
              </h3>
              <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                This action cannot be undone. This will permanently remove your user account and unlink any stored preferences from our atelier database.
              </p>
            </div>

            {deleteError && (
              <div className="p-3 bg-red-100/70 border border-red-200 rounded-xl text-red-800 text-xs">
                {deleteError}
              </div>
            )}

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-600 mb-1">
                Type <span className="font-bold text-red-700">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-xs font-mono focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="py-2.5 px-4 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold uppercase tracking-wider hover:bg-stone-100 transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeleting || deleteConfirmText.trim().toLowerCase() !== "delete"}
                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-40 cursor-pointer shadow-xs active:scale-98 flex items-center gap-1.5"
              >
                {isDeleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span>Permanently Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

