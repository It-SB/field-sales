import "server-only";

import { readJsonFile } from "./db";
import {
  getNotificationsForUser,
  getUnreadNotifications,
} from "./notifications";

import type {
  FridgeReport,
  Notification,
  ReturnItem,
  StockBatch,
  Store,
  User,
} from "./types";

export interface DashboardData {
  stores: Store[];
  notifications: Notification[];
  unreadNotifications: Notification[];
  returns: ReturnItem[];
  fridgeReports: FridgeReport[];
  stockBatches: StockBatch[];
}

export async function getDashboardData(
  user: User
): Promise<DashboardData> {
  const [
    allStores,
    allReturns,
    allFridgeReports,
    allStockBatches,
    notifications,
  ] = await Promise.all([
    readJsonFile<Store[]>("stores.json"),
    readJsonFile<ReturnItem[]>("returns.json"),
    readJsonFile<FridgeReport[]>("fridge-reports.json"),
    readJsonFile<StockBatch[]>("stock-batches.json"),
    getNotificationsForUser(user),
  ]);

  const isAdmin = user.role === "admin";

  const stores = isAdmin
    ? allStores
    : allStores.filter((store) =>
        user.assignedStoreIds.includes(store.id)
      );

  const accessibleStoreIds = stores.map((store) => store.id);

  const returns = isAdmin
    ? allReturns
    : allReturns.filter((item) =>
        accessibleStoreIds.includes(item.storeId)
      );

  const fridgeReports = isAdmin
    ? allFridgeReports
    : allFridgeReports.filter((report) =>
        accessibleStoreIds.includes(report.storeId)
      );

  const stockBatches = isAdmin
    ? allStockBatches
    : allStockBatches.filter((batch) =>
        accessibleStoreIds.includes(batch.storeId)
      );

  const unreadNotifications = getUnreadNotifications(
    notifications,
    user.id
  );

  return {
    stores,
    notifications,
    unreadNotifications,
    returns,
    fridgeReports,
    stockBatches,
  };
}