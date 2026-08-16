import { notFound, redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { readJsonFile } from "@/lib/db";
import { getDashboardData } from "@/lib/dashboard";

import AppShell from "@/components/layout/app-shell";
import ReturnForm from "@/components/stores/return-form";

import type { Product } from "@/lib/types";

interface ReturnPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ReturnPage({
  params,
}: ReturnPageProps) {
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

  // Prevent reps from accessing stores not assigned to them
  if (!store) {
    notFound();
  }

  const products =
    await readJsonFile<Product[]>("products.json");

  return (
    <AppShell
      user={user}
      unreadCount={
        dashboardData.unreadNotifications.length
      }
    >
      <main className="mx-auto max-w-3xl p-6 md:p-8">
        <div className="mb-8">
          <p className="text-sm font-medium text-orange-600">
            PROCESS RETURN
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            {store.name}
          </h1>

          <p className="mt-2 text-slate-500">
            Report stock that needs to be returned.
          </p>
        </div>

        <ReturnForm
          storeId={store.id}
          products={products}
        />
      </main>
    </AppShell>
  );
}