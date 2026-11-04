import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getOrders } from "@/db/store";
import { OrdersManagementClient } from "@/components/admin/OrdersManagementClient";

export default async function AdminOrdersPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    redirect("/admin/login?reason=unauthorized");
  }

  const orders = await getOrders();

  return <OrdersManagementClient initialOrders={orders as any} />;
}

