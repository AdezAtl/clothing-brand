import React from "react";
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

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 border border-stone-200">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span className="uppercase font-semibold tracking-wider">Settled Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-700" />
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
        <div className="bg-white p-5 border border-stone-200">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span className="uppercase font-semibold tracking-wider">Actionable Orders</span>
            <ShoppingBag className="w-4 h-4 text-stone-700" />
          </div>
          <p className="text-2xl font-bold font-mono text-stone-950">
            {pendingOrdersCount}
          </p>
          <p className="text-[11px] text-stone-500 mt-2">
            Awaiting packaging or dispatch
          </p>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-5 border border-stone-200">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span className="uppercase font-semibold tracking-wider">Low Stock SKUs</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-900">
            {lowStockVariantsCount}
          </p>
          <p className="text-[11px] text-stone-500 mt-2">
            Variants with &lt; 3 units available
          </p>
        </div>

        {/* Active Garments */}
        <div className="bg-white p-5 border border-stone-200">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span className="uppercase font-semibold tracking-wider">Active Catalog</span>
            <Layers className="w-4 h-4 text-stone-700" />
          </div>
          <p className="text-2xl font-bold font-mono text-stone-950">
            {activeProductsCount}
          </p>
          <p className="text-[11px] text-stone-500 mt-2">
            Live on Tullipio Storefront
          </p>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white border border-stone-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-900">
              Recent Customer Orders
            </h2>
            <p className="text-xs text-stone-500">
              Real-time feed of purchases through Bachs Gateway
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs uppercase font-mono tracking-wider text-stone-700 hover:text-stone-950 inline-flex items-center gap-1"
          >
            <span>Manage All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-y border-stone-200 text-stone-500 font-mono uppercase">
              <tr>
                <th className="py-2.5 px-3">Order Number</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Destination</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Payment</th>
                <th className="py-2.5 px-3">Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.slice(0, 5).map((order: any) => (
                <tr key={order.id} className="hover:bg-stone-50/70">
                  <td className="py-3 px-3 font-mono font-medium text-stone-900">
                    {order.orderNumber}
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-medium text-stone-900">{order.customerName}</p>
                    <p className="text-[11px] text-stone-400">{order.customerPhone}</p>
                  </td>
                  <td className="py-3 px-3 text-stone-600">
                    {order.shippingAddress?.city}, {order.shippingAddress?.state}
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-stone-950">
                    {formatPriceNGN(order.totalAmount)}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider ${
                        order.paymentStatus === "paid"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider ${
                        order.fulfillmentStatus === "delivered"
                          ? "bg-stone-900 text-stone-50"
                          : order.fulfillmentStatus === "processing"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-stone-100 text-stone-600"
                      }`}
                    >
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

