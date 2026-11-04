"use client";

import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export function AdminSessionGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { status } = useSession();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Skip guard on login page itself
    if (pathname === "/admin/login") {
      setChecking(false);
      return;
    }

    // Check if browser tab was reloaded
    let isReload = false;
    try {
      if (typeof window !== "undefined") {
        const navEntries = performance.getEntriesByType("navigation");
        if (navEntries.length > 0) {
          isReload = (navEntries[0] as PerformanceNavigationTiming).type === "reload";
        } else if ((window.performance as any)?.navigation?.type === 1) {
          isReload = true;
        }
      }
    } catch {
      isReload = false;
    }

    const justLoggedIn = sessionStorage.getItem("tullipio_just_logged_in");
    const tabActive = sessionStorage.getItem("tullipio_admin_tab_session");
    const loginTimeStr = sessionStorage.getItem("tullipio_admin_login_time");
    const loginTime = loginTimeStr ? parseInt(loginTimeStr, 10) : 0;
    const now = Date.now();
    const twentyFourHoursMs = 24 * 60 * 60 * 1000;

    // 1. If this was a fresh login just now from the login form
    if (justLoggedIn === "1") {
      sessionStorage.removeItem("tullipio_just_logged_in");
      setChecking(false);
      return;
    }

    // 2. If the user explicitly reloaded this browser tab
    if (isReload) {
      sessionStorage.removeItem("tullipio_admin_tab_session");
      sessionStorage.removeItem("tullipio_admin_login_time");
      signOut({ redirect: true, callbackUrl: "/admin/login?reason=reloaded" });
      return;
    }

    // 3. If there is no tab session marker (e.g. newly opened tab or restored session)
    if (!tabActive) {
      sessionStorage.removeItem("tullipio_admin_tab_session");
      sessionStorage.removeItem("tullipio_admin_login_time");
      signOut({ redirect: true, callbackUrl: "/admin/login?reason=tab_session_required" });
      return;
    }

    // 4. Check 24-hour expiration
    if (loginTime > 0 && now - loginTime > twentyFourHoursMs) {
      sessionStorage.removeItem("tullipio_admin_tab_session");
      sessionStorage.removeItem("tullipio_admin_login_time");
      signOut({ redirect: true, callbackUrl: "/admin/login?reason=expired" });
      return;
    }

    // Tab is valid and within 24hr window
    setChecking(false);

    // Setup periodic 24hr expiration watcher
    const remainingTime = Math.max(1000, twentyFourHoursMs - (now - loginTime));
    const timer = setTimeout(() => {
      sessionStorage.removeItem("tullipio_admin_tab_session");
      sessionStorage.removeItem("tullipio_admin_login_time");
      signOut({ redirect: true, callbackUrl: "/admin/login?reason=expired" });
    }, remainingTime);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (checking && pathname !== "/admin/login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-3xl border border-stone-200 shadow-sm text-stone-600 text-xs">
          <Loader2 className="w-5 h-5 animate-spin text-stone-900" />
          <span>Verifying active atelier tab session...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

