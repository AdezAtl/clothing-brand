import React from "react";
import { getOrders } from "@/db/store";
import { OrdersManagementClient } from "@/components/admin/OrdersManagementClient";

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return <OrdersManagementClient initialOrders={orders as any} />;
}

