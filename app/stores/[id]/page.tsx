import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { getDashboardData } from "@/lib/dashboard";
import AppShell from "@/components/layout/app-shell";

interface StorePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function StorePage({
  params,
}: StorePageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;

  const data = await getDashboardData(user);

  const store = data.stores.find(
    (item) => item.id === id
  );

  if (!store) {
    notFound();
  }

  const storeStock = data.stockBatches.filter(
    (batch) => batch.storeId === store.id
  );

  const storeReturns = data.returns.filter(
    (item) => item.storeId === store.id
  );

  const storeFridgeReports = data.fridgeReports.filter(
    (item) => item.storeId === store.id
  );

  const openReturns = storeReturns.filter(
    (item) => item.status !== "collected"
  );

  const openFridgeReports = storeFridgeReports.filter(
    (item) => item.status !== "resolved"
  );

  return (
    <AppShell
      user={user}
      unreadCount={data.unreadNotifications.length}
    >
      <main className="mx-auto max-w-6xl p-6 md:p-8">
        {/* Back */}
        <Link
          href="/stores"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
        >
          ← Back to My Stores
        </Link>

        {/* Store Header */}
        <section className="mt-5 overflow-hidden rounded-2xl bg-slate-900 shadow-lg">
          <div className="p-6 md:p-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
              <div>
                <div className="inline-flex items-center rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300">
                  STORE OVERVIEW
                </div>

                <h1 className="mt-4 text-3xl font-bold text-white md:text-4xl">
                  {store.name}
                </h1>

                <p className="mt-3 flex items-center gap-2 text-slate-300">
                  <span>📍</span>
                  {store.address}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/10 px-5 py-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Store Status
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400" />

                  <span className="font-semibold text-white">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-blue-50 p-3 text-xl">
                📦
              </div>

              <span className="text-xs font-semibold text-slate-400">
                CAPTURED
              </span>
            </div>

            <p className="mt-5 text-3xl font-bold text-slate-900">
              {storeStock.length}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Stock batches recorded
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-orange-50 p-3 text-xl">
                🔄
              </div>

              {openReturns.length > 0 && (
                <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-600">
                  {openReturns.length} OPEN
                </span>
              )}
            </div>

            <p className="mt-5 text-3xl font-bold text-slate-900">
              {storeReturns.length}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Returns reported
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-red-50 p-3 text-xl">
                🧊
              </div>

              {openFridgeReports.length > 0 && (
                <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600">
                  {openFridgeReports.length} OPEN
                </span>
              )}
            </div>

            <p className="mt-5 text-3xl font-bold text-slate-900">
              {storeFridgeReports.length}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Fridge issues reported
            </p>
          </div>
        </section>

        {/* Actions */}
        <section className="mt-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600">
                QUICK ACTIONS
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                What would you like to do?
              </h2>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {/* Stock */}
            <Link
              href={`/stores/${store.id}/stock`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="rounded-2xl bg-blue-50 p-4 text-2xl">
                  📦
                </div>

                <span className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600">
                  →
                </span>
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-900">
                Check Stock
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Capture product quantities and expiry dates
                for this store.
              </p>

              <div className="mt-6 text-sm font-semibold text-blue-600">
                Start stock check →
              </div>
            </Link>

            {/* Returns */}
            <Link
              href={`/stores/${store.id}/returns`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-orange-400 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="rounded-2xl bg-orange-50 p-4 text-2xl">
                  🔄
                </div>

                <span className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-orange-600">
                  →
                </span>
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-900">
                Process Return
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Report expired, damaged, or melted
                products.
              </p>

              <div className="mt-6 text-sm font-semibold text-orange-600">
                Create return →
              </div>
            </Link>

            {/* Fridge */}
            <Link
              href={`/stores/${store.id}/fridge`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-red-400 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="rounded-2xl bg-red-50 p-4 text-2xl">
                  🧊
                </div>

                <span className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-red-600">
                  →
                </span>
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-900">
                Report Fridge Issue
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Report fridge abuse, damage, temperature,
                or maintenance problems.
              </p>

              <div className="mt-6 text-sm font-semibold text-red-600">
                Report issue →
              </div>
            </Link>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-6">
            <p className="text-sm font-semibold text-blue-600">
              STORE ACTIVITY
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Recent activity
            </h2>
          </div>

          <div className="p-6">
            {storeStock.length === 0 &&
            storeReturns.length === 0 &&
            storeFridgeReports.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-3xl">📋</p>

                <p className="mt-3 font-semibold text-slate-700">
                  No activity recorded yet
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Use one of the actions above to start
                  recording store activity.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-slate-500">
                  Activity has been recorded for this store.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </AppShell>
  );
}