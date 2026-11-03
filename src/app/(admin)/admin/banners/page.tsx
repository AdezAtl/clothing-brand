import React from "react";
import { getHeroBanner } from "@/db/store";
import { BannerManagerClient } from "@/components/admin/BannerManagerClient";

export default async function AdminBannersPage() {
  const banner = await getHeroBanner();

  return <BannerManagerClient initialBanner={banner as any} />;
}

