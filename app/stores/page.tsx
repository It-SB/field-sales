import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDashboardData } from "@/lib/dashboard";
import AppShell from "@/components/layout/app-shell";

export default async function StoresPage() {
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
      <main className="mx-auto max-w-6xl p-6 md:p-8">
        <header>
          <p className="text-sm font-medium text-blue-600">
            STORE MANAGEMENT
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            {user.role === "admin" ? "All Stores" : "My Stores"}
          </h1>

          <p className="mt-2 text-slate-500">
            Select a store to view stock, returns, and fridge reports.
          </p>
        </header>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {data.stores.map((store) => (
            <Link
              key={store.id}
              href={`/stores/${store.id}`}
              className="block cursor-pointer rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow"
            >
              <p className="text-lg font-bold text-slate-900">
                {store.name}
              </p>

              <p className="mt-2 text-slate-500">
                📍 {store.address}
              </p>

              <div className="mt-6 text-sm font-semibold text-blue-600">
                View Store →
              </div>
            </Link>
          ))}
        </div>
      </main>
    </AppShell>
  );
}