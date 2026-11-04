import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getOrders, getProducts } from "@/db/store";
import { formatPriceNGN } from "@/lib/utils";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  AlertTriangle,
  Layers,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default async function AdminOverviewPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    redirect("/admin/login?reason=unauthorized");
  }

  const [orders, products] = await Promise.all([getOrders(), getProducts()]);

  // Compute KPIs
  const paidOrders = orders.filter((o: any) => o.paymentStatus === "paid");
  const totalRevenueKobo = paidOrders.reduce((sum: number, o: any) => sum + o.totalAmount, 0);
  const pendingOrdersCount = orders.filter((o: any) => o.paymentStatus === "pending" || o.fulfillmentStatus === "unfulfilled").length;

  // Compute low stock variants (< 3 units)
  let lowStockVariantsCount = 0;
  for (const prod of products) {
    if (prod.variants) {
      for (const v of prod.variants) {
        if (v.stockQuantity < 3) {
          lowStockVariantsCount++;
        }
      }
    }
  }

  const activeProductsCount = products.filter((p: any) => p.isActive).length;

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-mono uppercase tracking-widest text-stone-500">
          Atelier Performance
        </span>
        <h1 className="text-2xl font-serif text-stone-950 mt-1">
          Operations Overview
        </h1>
      </div>

      {/* 4 Curvy KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-[24px] border border-stone-200/80 shadow-xs hover:border-stone-300 transition-all">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span className="uppercase font-semibold tracking-wider">Settled Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-stone-950">
            {formatPriceNGN(totalRevenueKobo)}
          </p>
          <p className="text-[11px] text-stone-500 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            <span>Via Bachs Payment System</span>
          </p>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-6 rounded-[24px] border border-stone-200/80 shadow-xs hover:border-stone-300 transition-all">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span className="uppercase font-semibold tracking-wider">Actionable Orders</span>
            <div className="p-2 rounded-xl bg-stone-100 text-stone-700">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-stone-950">
            {pendingOrdersCount}
          </p>
          <p className="text-[11px] text-stone-500 mt-2">
            Awaiting packaging or dispatch
          </p>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-[24px] border border-stone-200/80 shadow-xs hover:border-stone-300 transition-all">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span className="uppercase font-semibold tracking-wider">Low Stock SKUs</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-amber-900">
            {lowStockVariantsCount}
          </p>
          <p className="text-[11px] text-stone-500 mt-2">
            Variants with &lt; 3 units available
          </p>
        </div>

        {/* Active Garments */}
        <div className="bg-white p-6 rounded-[24px] border border-stone-200/80 shadow-xs hover:border-stone-300 transition-all">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span className="uppercase font-semibold tracking-wider">Active Catalog</span>
            <div className="p-2 rounded-xl bg-stone-100 text-stone-700">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-stone-950">
            {activeProductsCount}
          </p>
          <p className="text-[11px] text-stone-500 mt-2">
            Live on Tullipio Storefront
          </p>
        </div>
      </div>

      {/* Recent Orders Section with Curvy Frame */}
      <div className="bg-white border border-stone-200/80 rounded-[28px] p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-900">
              Recent Customer Orders
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Real-time feed of purchases through Bachs Gateway
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs uppercase font-mono tracking-wider text-stone-700 hover:text-stone-950 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-200 hover:border-stone-400 transition-all"
          >
            <span>Manage All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-stone-200/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-500 font-mono uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Order Number</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.slice(0, 5).map((order: any) => (
                <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-stone-900">
                    {order.orderNumber}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-stone-900">{order.customerName}</p>
                    <p className="text-[11px] text-stone-400">{order.customerPhone}</p>
                  </td>
                  <td className="py-3 px-4 text-stone-600">
                    {order.shippingAddress?.city}, {order.shippingAddress?.state}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-stone-950">
                    {formatPriceNGN(order.totalAmount)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase font-mono tracking-wider ${
                        order.paymentStatus === "paid"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 capitalize text-stone-700">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] uppercase font-mono">
                      {order.fulfillmentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
