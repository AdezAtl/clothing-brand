"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut, Loader2 } from "lucide-react";

interface AdminLogoutButtonProps {
  variant?: "header" | "sidebar";
  className?: string;
}

export function AdminLogoutButton({
  variant = "header",
  className = "",
}: AdminLogoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("tullipio_admin_tab_session");
        sessionStorage.removeItem("tullipio_admin_login_time");
        sessionStorage.removeItem("tullipio_just_logged_in");
      }
      await signOut({
        redirect: true,
        callbackUrl: "/admin/login?reason=logged_out",
      });
    } catch {
      window.location.href = "/admin/login?reason=logged_out";
    }
  };

  if (variant === "sidebar") {
    return (
      <button
        onClick={handleLogout}
        disabled={loading}
        className={`w-full flex items-center justify-between p-2.5 rounded-2xl bg-stone-900/80 hover:bg-red-950/40 text-stone-300 hover:text-red-200 border border-stone-800 hover:border-red-900/40 text-xs transition-all ${className}`}
        title="Sign out of Atelier Operations"
      >
        <span className="flex items-center gap-2">
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
          ) : (
            <LogOut className="w-3.5 h-3.5 text-stone-400 group-hover:text-red-400" />
          )}
          <span>{loading ? "Signing out..." : "Log Out"}</span>
        </span>
        <span className="text-[10px] font-mono text-stone-500 uppercase">
          Exit
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-stone-200 bg-white text-stone-700 hover:text-red-700 hover:bg-red-50 hover:border-red-200 text-xs font-medium transition-all shadow-xs ${className}`}
      title="Sign out of Atelier Operations"
    >
      {loading ? (
        <Loader2 className="w-3 h-3 animate-spin text-red-600" />
      ) : (
        <LogOut className="w-3 h-3 text-stone-500 group-hover:text-red-600" />
      )}
      <span>{loading ? "Signing out..." : "Log Out"}</span>
    </button>
  );
}

