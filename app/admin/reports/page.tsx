import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { readJsonFile } from "@/lib/db";
import { getDashboardData } from "@/lib/dashboard";

import AppShell from "@/components/layout/app-shell";
import AdminReports from "@/components/admin/admin-reports";

import type {
  FridgeReport,
  Product,
  ReturnItem,
  StockBatch,
  Store,
  User,
} from "@/lib/types";

export default async function AdminReportsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Only admins may access this page
  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  const dashboardData =
    await getDashboardData(user);

  const [
    stockBatches,
    returns,
    fridgeReports,
    products,
    stores,
    users,
  ] = await Promise.all([
    readJsonFile<StockBatch[]>(
      "stock-batches.json"
    ),
    readJsonFile<ReturnItem[]>(
      "returns.json"
    ),
    readJsonFile<FridgeReport[]>(
      "fridge-reports.json"
    ),
    readJsonFile<Product[]>(
      "products.json"
    ),
    readJsonFile<Store[]>(
      "stores.json"
    ),
    readJsonFile<User[]>(
      "users.json"
    ),
  ]);

  return (
    <AppShell
      user={user}
      unreadCount={
        dashboardData.unreadNotifications.length
      }
    >
      <main className="mx-auto max-w-7xl p-6 md:p-8">
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-600">
            ADMINISTRATION
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Reports Dashboard
          </h1>

          <p className="mt-2 text-slate-500">
            Monitor stock checks, expiry risks,
            returns, and fridge issues across all stores.
          </p>
        </div>

        <AdminReports
          stockBatches={stockBatches}
          returns={returns}
          fridgeReports={fridgeReports}
          products={products}
          stores={stores}
          users={users}
        />
      </main>
    </AppShell>
  );
}