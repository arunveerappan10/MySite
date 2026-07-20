import type { ReactNode } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { QueryProvider } from "@/components/admin/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { user } = await requireAdmin();

  return (
    <QueryProvider>
      <div className="flex min-h-screen bg-background text-foreground">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader email={user.email ?? ""} />
          <main className="flex-1 p-4 md:p-8">{children}</main>
        </div>
      </div>
      <Toaster />
    </QueryProvider>
  );
}
