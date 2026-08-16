import { notFound, redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { readJsonFile } from "@/lib/db";
import { getDashboardData } from "@/lib/dashboard";

import AppShell from "@/components/layout/app-shell";
import StockCheckForm from "@/components/stores/stock-check-form";

import type {
  Product,
  Store,
} from "@/lib/types";

interface StockPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function StockPage({
  params,
}: StockPageProps) {
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
          <p className="text-sm font-medium text-blue-600">
            STOCK CHECK
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            {store.name}
          </h1>

          <p className="mt-2 text-slate-500">
            Capture the product quantity and expiry date.
          </p>
        </div>

        <StockCheckForm
          storeId={store.id}
          products={products}
        />
      </main>
    </AppShell>
  );
}