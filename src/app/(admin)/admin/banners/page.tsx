import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getHeroBanner } from "@/db/store";
import { BannerManagerClient } from "@/components/admin/BannerManagerClient";

export default async function AdminBannersPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    redirect("/admin/login?reason=unauthorized");
  }

  const banner = await getHeroBanner();

  return <BannerManagerClient initialBanner={banner as any} />;
}

