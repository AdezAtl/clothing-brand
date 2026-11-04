"use client";

import React, { useState } from "react";
import { toggleUserRoleAction } from "@/actions";
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
} from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  createdAt: Date | string;
}

interface UserManagementClientProps {
  initialUsers: UserItem[];
  currentUserId: string;
}

export function UserManagementClient({
  initialUsers,
  currentUserId,
}: UserManagementClientProps) {
  const [usersList, setUsersList] = useState<UserItem[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "customer">("all");
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleToggleRole = async (user: UserItem) => {
    const newRole: "customer" | "admin" = user.role === "admin" ? "customer" : "admin";
    const actionLabel = newRole === "admin" ? "grant administrator privileges to" : "revoke administrator privileges from";

    const confirmed = window.confirm(
      `Are you sure you want to ${actionLabel} ${user.name} (${user.email})?`
    );
    if (!confirmed) return;

    setLoadingUserId(user.id);
    setFeedback(null);

    try {
      const res = await toggleUserRoleAction(user.id, newRole);
      if (!res.success) {
        setFeedback({
          type: "error",
          message: res.error || "Failed to update role.",
        });
      } else {
        setUsersList((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
        );
        setFeedback({
          type: "success",
          message: `Successfully updated ${user.name}'s role to ${newRole === "admin" ? "Atelier Administrator" : "Customer"}.`,
        });
      }
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err?.message || "An unexpected error occurred.",
      });
    } finally {
      setLoadingUserId(null);
    }
  };

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalAdmins = usersList.filter((u) => u.role === "admin").length;
  const totalCustomers = usersList.filter((u) => u.role === "customer").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-mono uppercase tracking-widest text-stone-500">
          Atelier Access Control
        </span>
        <h1 className="text-2xl font-serif text-stone-950 mt-1">
          Staff & User Privileges
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Manage system roles and grant staff members administration privileges to manage atelier products, inventory, and orders.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-[22px] border border-stone-200/80 shadow-2xs">
          <span className="text-[11px] font-mono uppercase text-stone-400 block mb-1">
            Total Accounts
          </span>
          <span className="text-2xl font-serif font-bold text-stone-950">
            {usersList.length}
          </span>
        </div>

        <div className="bg-white p-5 rounded-[22px] border border-stone-200/80 shadow-2xs">
          <span className="text-[11px] font-mono uppercase text-stone-400 block mb-1">
            Atelier Administrators
          </span>
          <span className="text-2xl font-serif font-bold text-emerald-800">
            {totalAdmins}
          </span>
        </div>

        <div className="bg-white p-5 rounded-[22px] border border-stone-200/80 shadow-2xs">
          <span className="text-[11px] font-mono uppercase text-stone-400 block mb-1">
            Customer Accounts
          </span>
          <span className="text-2xl font-serif font-bold text-stone-800">
            {totalCustomers}
          </span>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center justify-between gap-3 ${
            feedback.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-stone-400 hover:text-stone-700 text-xs font-mono uppercase cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Controls: Search & Role Filter */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:border-stone-900 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <button
            type="button"
            onClick={() => setRoleFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
              roleFilter === "all"
                ? "bg-stone-950 text-white shadow-2xs"
                : "bg-stone-100 text-stone-600 hover:text-stone-950"
            }`}
          >
            All ({usersList.length})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter("admin")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
              roleFilter === "admin"
                ? "bg-emerald-900 text-white shadow-2xs"
                : "bg-stone-100 text-stone-600 hover:text-stone-950"
            }`}
          >
            Admins ({totalAdmins})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter("customer")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
              roleFilter === "customer"
                ? "bg-stone-900 text-white shadow-2xs"
                : "bg-stone-100 text-stone-600 hover:text-stone-950"
            }`}
          >
            Customers ({totalCustomers})
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[24px] border border-stone-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-[#FAF8F5] text-stone-500 font-mono text-[10px] uppercase tracking-wider border-b border-stone-200/80">
              <tr>
                <th className="py-3.5 px-6">User / Account</th>
                <th className="py-3.5 px-6">System Role</th>
                <th className="py-3.5 px-6">Member Since</th>
                <th className="py-3.5 px-6 text-right">Access Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-stone-400">
                    No registered user accounts match the current filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isCurrent = user.id === currentUserId;
                  const isLoading = loadingUserId === user.id;
                  const isAdmin = user.role === "admin";
                  const initial = user.name ? user.name.charAt(0).toUpperCase() : "U";
                  const dateStr = user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "Unknown";

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-stone-50/70 transition-colors"
                    >
                      {/* Name & Email */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-stone-900 text-stone-100 font-serif font-bold text-sm flex items-center justify-center shrink-0">
                            {initial}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-stone-950">
                                {user.name}
                              </span>
                              {isCurrent && (
                                <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-stone-400 font-mono text-[11px] block mt-0.5">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role Pill */}
                      <td className="py-4 px-6">
                        {isAdmin ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-[10px] uppercase font-bold tracking-wider">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Atelier Admin</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-600 font-mono text-[10px] uppercase font-medium tracking-wider">
                            <span>Customer</span>
                          </span>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="py-4 px-6 font-mono text-stone-500 text-[11px]">
                        {dateStr}
                      </td>

                      {/* Action Button */}
                      <td className="py-4 px-6 text-right">
                        {isCurrent ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-stone-400 italic">
                            <Lock className="w-3 h-3" />
                            <span>Active Session</span>
                          </span>
                        ) : isAdmin ? (
                          <button
                            type="button"
                            onClick={() => handleToggleRole(user)}
                            disabled={isLoading}
                            className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 active:scale-96 shadow-2xs"
                            title="Revoke admin access (demote to Customer)"
                          >
                            {isLoading ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <>
                                <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                                <span>Revoke Admin</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleToggleRole(user)}
                            disabled={isLoading}
                            className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 active:scale-96 shadow-2xs"
                            title="Grant staff administrator privileges"
                          >
                            {isLoading ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <>
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Grant Admin</span>
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

