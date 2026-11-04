import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAllUsers } from "@/db/store";
import { UserManagementClient } from "@/components/admin/UserManagementClient";

export default async function AdminUsersPage() {
  const session = await auth();

  // Enforce server-side role check
  if (!session?.user || (session.user as any).role !== "admin") {
    redirect("/admin/login?reason=unauthorized");
  }

  const users = await getAllUsers();
  const currentUserId = (session.user as any).id || "";

  return (
    <UserManagementClient
      initialUsers={users}
      currentUserId={currentUserId}
    />
  );
}

