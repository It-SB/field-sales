import { notFound, redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { getDashboardData } from "@/lib/dashboard";

import AppShell from "@/components/layout/app-shell";
import FridgeReportForm from "@/components/stores/fridge-report-form";

interface FridgePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FridgePage({
  params,
}: FridgePageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;

  const dashboardData =
    await getDashboardData(user);

  const store = dashboardData.stores.find(
    (item) => item.id === id
  );

  // Prevent users from manually accessing
  // stores they are not allowed to access.
  if (!store) {
    notFound();
  }

  return (
    <AppShell
      user={user}
      unreadCount={
        dashboardData.unreadNotifications.length
      }
    >
      <main className="mx-auto max-w-3xl p-6 md:p-8">
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-700">
            FRIDGE REPORT
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            {store.name}
          </h1>

          <p className="mt-2 text-slate-500">
            Report fridge abuse, damage, or any
            other equipment problem.
          </p>
        </div>

        <FridgeReportForm
          storeId={store.id}
        />
      </main>
    </AppShell>
  );
}