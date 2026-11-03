import React from "react";
import { getProducts, getCategories } from "@/db/store";
import { ProductManagementClient } from "@/components/admin/ProductManagementClient";

export default async function AdminProductsPage() {
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

