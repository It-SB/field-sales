import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { getDashboardData } from "@/lib/dashboard";

import AppShell from "@/components/layout/app-shell";
import AlertsList from "@/components/alerts/alerts-list";

export default async function AlertsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const data = await getDashboardData(user);

  return (
    <AppShell
      user={user}
      unreadCount={data.unreadNotifications.length}
    >
      <main className="mx-auto max-w-4xl p-6 md:p-8">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              NOTIFICATIONS
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Alerts
            </h1>

            <p className="mt-2 text-slate-500">
              Stay updated on expiring stock, returns,
              fridge issues, and system activity.
            </p>
          </div>

          {data.unreadNotifications.length > 0 && (
            <span className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
              {data.unreadNotifications.length} unread
            </span>
          )}
        </header>

        <AlertsList
          initialNotifications={data.notifications}
          currentUserId={user.id}
        />
      </main>
    </AppShell>
  );
}