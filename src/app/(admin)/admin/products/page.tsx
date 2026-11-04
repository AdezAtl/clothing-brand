import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getProducts, getCategories } from "@/db/store";
import { ProductManagementClient } from "@/components/admin/ProductManagementClient";

export default async function AdminProductsPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    redirect("/admin/login?reason=unauthorized");
  }

  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <ProductManagementClient
      initialProducts={products as any}
      categories={categories as any}
    />
  );
}

