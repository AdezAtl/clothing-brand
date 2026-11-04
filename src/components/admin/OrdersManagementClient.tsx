"use client";

import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { formatPriceNGN } from "@/lib/utils";
import { updateOrderStatusAction } from "@/app/actions/admin-actions";
import {
  Search,
  Eye,
  CheckCircle,
  Truck,
  Package,
  X,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
} from "lucide-react";

interface OrderItem {
  productNameSnapshot: string;
  variantSnapshot: string;
  quantity: number;
  unitPrice: number;
}

interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode?: string;
    notes?: string;
  };
  totalAmount: number;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  fulfillmentStatus: "unfulfilled" | "processing" | "shipped" | "delivered" | "cancelled";
  bachsReference: string;
  createdAt: string | Date;
  items?: OrderItem[];
}

interface OrdersManagementClientProps {
  initialOrders: OrderRecord[];
}

export function OrdersManagementClient({ initialOrders }: OrdersManagementClientProps) {
  const [orders, setOrders] = useState<OrderRecord[]>(initialOrders);
  const [globalFilter, setGlobalFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [fulfillmentFilter, setFulfillmentFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [updating, setUpdating] = useState(false);

  const filteredData = useMemo(() => {
    return orders.filter((o) => {
      const matchesPayment =
        paymentFilter === "all" ? true : o.paymentStatus === paymentFilter;
      const matchesFulfillment =
        fulfillmentFilter === "all"
          ? true
          : o.fulfillmentStatus === fulfillmentFilter;
      return matchesPayment && matchesFulfillment;
    });
  }, [orders, paymentFilter, fulfillmentFilter]);

  const handleUpdateStatus = async (
    orderId: string,
    updates: {
      paymentStatus?: OrderRecord["paymentStatus"];
      fulfillmentStatus?: OrderRecord["fulfillmentStatus"];
    }
  ) => {
    setUpdating(true);
    try {
      const res = await updateOrderStatusAction(orderId, updates);
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, ...updates } : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, ...updates } : null));
        }
      }
    } finally {
      setUpdating(false);
    }
  };

  const columns = useMemo<ColumnDef<OrderRecord>[]>(
    () => [
      {
        accessorKey: "orderNumber",
        header: "Order #",
        cell: ({ row }) => (
          <span className="font-mono font-bold text-stone-900">
            {row.original.orderNumber}
          </span>
        ),
      },
      {
        accessorKey: "customerName",
        header: "Customer",
        cell: ({ row }) => (
          <div>
            <p className="font-semibold text-stone-900">
              {row.original.customerName}
            </p>
            <p className="text-[11px] font-mono text-stone-400">
              {row.original.customerPhone}
            </p>
          </div>
        ),
      },
      {
        id: "destination",
        header: "Destination",
        cell: ({ row }) => (
          <span className="text-stone-600">
            {row.original.shippingAddress?.city},{" "}
            {row.original.shippingAddress?.state}
          </span>
        ),
      },
      {
        accessorKey: "totalAmount",
        header: "Total",
        cell: ({ row }) => (
          <span className="font-mono font-bold text-stone-950">
            {formatPriceNGN(row.original.totalAmount)}
          </span>
        ),
      },
      {
        accessorKey: "paymentStatus",
        header: "Payment",
        cell: ({ row }) => {
          const status = row.original.paymentStatus;
          return (
            <span
              className={`inline-block px-3 py-1 rounded-full text-[10px] uppercase font-mono tracking-wider ${
                status === "paid"
                  ? "bg-emerald-100 text-emerald-800"
                  : status === "failed"
                  ? "bg-red-100 text-red-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: "fulfillmentStatus",
        header: "Fulfillment Status",
        cell: ({ row }) => {
          const status = row.original.fulfillmentStatus;
          return (
            <span
              className={`inline-block px-3 py-1 rounded-full text-[10px] uppercase font-mono tracking-wider ${
                status === "delivered"
                  ? "bg-stone-900 text-stone-50"
                  : status === "shipped"
                  ? "bg-blue-100 text-blue-900 font-bold"
                  : status === "processing"
                  ? "bg-stone-200 text-stone-800"
                  : "bg-stone-100 text-stone-500"
              }`}
            >
              {status}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <button
            onClick={() => setSelectedOrder(row.original)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs uppercase font-mono tracking-wider transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-mono uppercase tracking-widest text-stone-500">
          Order Management
        </span>
        <h1 className="text-2xl font-serif text-stone-950 mt-1">
          Bachs Orders & Atelier Fulfillment
        </h1>
      </div>

      {/* Curvy Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-[24px] border border-stone-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search order #, customer, phone..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-full border border-stone-300 focus:border-stone-900 bg-stone-50/60 text-stone-900 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-stone-500 uppercase text-[11px]">Payment:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="border border-stone-300 rounded-full px-3 py-1.5 bg-stone-50 text-stone-800 focus:border-stone-900"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-500 uppercase text-[11px]">Fulfillment:</span>
            <select
              value={fulfillmentFilter}
              onChange={(e) => setFulfillmentFilter(e.target.value)}
              className="border border-stone-300 rounded-full px-3 py-1.5 bg-stone-50 text-stone-800 focus:border-stone-900"
            >
              <option value="all">All Statuses</option>
              <option value="unfulfilled">Unfulfilled</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      {/* TanStack Table with Curvy Container */}
      <div className="bg-white rounded-[28px] border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-500 font-mono uppercase text-[11px]">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="py-3 px-4 font-semibold">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-stone-100">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-12 text-center text-stone-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-stone-50/70 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-3 px-4 align-top">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 bg-stone-50/40">
          <span className="font-mono text-[11px]">Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}</span>
          <div className="flex gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-4 py-1.5 rounded-full border border-stone-300 disabled:opacity-40 hover:bg-white text-xs font-medium transition-all"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-4 py-1.5 rounded-full border border-stone-300 disabled:opacity-40 hover:bg-white text-xs font-medium transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Order Detail Sheet / Modal with Curvy Styling */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full p-6 md:p-8 rounded-[32px] border border-stone-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto text-stone-900">
            <div className="flex justify-between items-start border-b border-stone-100 pb-4">
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-stone-500">
                  Order Inspection
                </span>
                <h2 className="text-xl font-serif font-bold text-stone-950 mt-0.5">
                  {selectedOrder.orderNumber}
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Contact & Address in Curvy Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-stone-50 p-5 rounded-2xl border border-stone-200/80">
              <div className="space-y-1.5">
                <p className="font-bold text-stone-900 text-sm">
                  {selectedOrder.customerName}
                </p>
                <p className="text-stone-600 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <span>{selectedOrder.customerPhone}</span>
                </p>
                <p className="text-stone-500 font-mono text-[11px]">{selectedOrder.customerEmail}</p>
              </div>

              <div className="space-y-1.5">
                <p className="font-bold text-stone-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>Delivery Destination</span>
                </p>
                <p className="text-stone-600">
                  {selectedOrder.shippingAddress?.street}
                </p>
                <p className="text-stone-600">
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}
                </p>
                {selectedOrder.shippingAddress?.notes && (
                  <p className="text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200 mt-2 text-[11px]">
                    <strong>Custom Notes:</strong> {selectedOrder.shippingAddress.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Ordered Garments */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                Ordered Items
              </h3>
              <div className="rounded-2xl border border-stone-200 divide-y divide-stone-100 overflow-hidden">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex justify-between items-center text-xs bg-white">
                    <div>
                      <p className="font-semibold text-stone-900">
                        {item.productNameSnapshot}
                      </p>
                      <p className="text-[11px] text-stone-500 font-mono">
                        {item.variantSnapshot}
                      </p>
                    </div>
                    <div className="text-right font-mono">
                      <p className="text-stone-600 text-[11px]">Qty: {item.quantity}</p>
                      <p className="font-bold text-stone-950">
                        {formatPriceNGN(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-baseline pt-2 text-sm font-bold border-t border-stone-100">
                <span>Grand Total Settled:</span>
                <span className="font-serif text-base">{formatPriceNGN(selectedOrder.totalAmount)}</span>
              </div>
            </div>

            {/* Status Modification Controls with Pill Buttons */}
            <div className="pt-4 border-t border-stone-100 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                Update Fulfillment Pipeline
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  disabled={updating}
                  onClick={() =>
                    handleUpdateStatus(selectedOrder.id, { fulfillmentStatus: "processing" })
                  }
                  className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider border transition-all ${
                    selectedOrder.fulfillmentStatus === "processing"
                      ? "bg-blue-900 text-blue-50 border-blue-900 font-bold shadow-xs"
                      : "bg-white text-stone-700 border-stone-300 hover:bg-stone-50"
                  }`}
                >
                  Mark Processing
                </button>

                <button
                  disabled={updating}
                  onClick={() =>
                    handleUpdateStatus(selectedOrder.id, { fulfillmentStatus: "shipped" })
                  }
                  className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider border transition-all ${
                    selectedOrder.fulfillmentStatus === "shipped"
                      ? "bg-stone-900 text-stone-50 border-stone-900 font-bold shadow-xs"
                      : "bg-white text-stone-700 border-stone-300 hover:bg-stone-50"
                  }`}
                >
                  Mark Shipped
                </button>

                <button
                  disabled={updating}
                  onClick={() =>
                    handleUpdateStatus(selectedOrder.id, { fulfillmentStatus: "delivered" })
                  }
                  className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider border transition-all ${
                    selectedOrder.fulfillmentStatus === "delivered"
                      ? "bg-emerald-900 text-emerald-50 border-emerald-900 font-bold shadow-xs"
                      : "bg-white text-stone-700 border-stone-300 hover:bg-stone-50"
                  }`}
                >
                  Mark Delivered
                </button>
              </div>
            </div>

            <div className="text-[11px] font-mono text-stone-400 pt-3 border-t border-stone-100 flex justify-between">
              <span>Bachs Gateway Reference: {selectedOrder.bachsReference}</span>
              <span>Atelier Akobo, Ibadan</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
