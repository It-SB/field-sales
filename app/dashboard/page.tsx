import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDashboardData } from "@/lib/dashboard";
import StatCard from "@/components/dashboard/stat-card";
import AppShell from "@/components/layout/app-shell";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const data = await getDashboardData(user);

  const openReturns = data.returns.filter(
    (item) =>
      item.status === "submitted" ||
      item.status === "under_review"
  );

  const openFridgeReports = data.fridgeReports.filter(
    (report) =>
      report.status === "open" ||
      report.status === "under_review"
  );

  return (
    <AppShell
      user={user}
      unreadCount={data.unreadNotifications.length}
    >
      <main className="mx-auto max-w-6xl p-6 md:p-8">
        <header className="mb-8">
          <p className="text-sm font-medium text-blue-600">
            {user.role === "admin" ? "ADMIN PORTAL" : "FIELD SALES"}
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Good evening, {user.name}
          </h1>

          <p className="mt-2 text-slate-500">
            Here is an overview of your field activity.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title={user.role === "admin" ? "Total Stores" : "My Stores"}
            value={data.stores.length}
            description="Stores you can access"
          />

          <StatCard
            title="Unread Alerts"
            value={data.unreadNotifications.length}
            description="Notifications requiring attention"
          />

          <StatCard
            title="Open Returns"
            value={openReturns.length}
            description="Returns still being processed"
          />

          <StatCard
            title="Fridge Issues"
            value={openFridgeReports.length}
            description="Open fridge reports"
          />
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              {user.role === "admin" ? "All Stores" : "My Stores"}
            </h2>

            <div className="mt-4 space-y-3">
              {data.stores.map((store) => (
                <a
                  key={store.id}
                  href={`/stores/${store.id}`}
                  className="block rounded-lg border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50"
                >
                  <p className="font-semibold text-slate-800">
                    {store.name}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {store.address}
                  </p>
                </a>
              ))}
            </div>
          </section>

          <section className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                Notifications
              </h2>

              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
                {data.unreadNotifications.length} unread
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {data.notifications.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No notifications yet.
                </p>
              ) : (
                data.notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`rounded-lg border p-4 ${
                      notification.readBy.includes(user.id)
                        ? "border-slate-200 bg-white"
                        : "border-blue-200 bg-blue-50"
                    }`}
                  >
                    <p className="font-semibold text-slate-800">
                      {notification.title}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      {notification.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </AppShell>
  );
}