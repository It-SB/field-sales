export type UserRole = "admin" | "sales_rep";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  assignedStoreIds: string[];
}

export interface Store {
  id: string;
  name: string;
  address: string;
  assignedRepId: string;
}

export interface Product {
  id: string;
  productLine: "Country Fresh" | "Farmhouse";
  name: string;
  flavour: string;
  size: "1.8L" | "5L";
  sku: string;
  active: boolean;
}

export interface StockBatch {
  id: string;
  storeId: string;
  productId: string;
  quantity: number;
  expiryDate: string;
  capturedBy: string;
  capturedAt: string;
}

export type ReturnReason =
  | "expired"
  | "damaged"
  | "melted"
  | "other";

export type ReturnStatus =
  | "submitted"
  | "collected"
  | "under_review"
  | "approved"
  | "processed";

export interface ReturnItem {
  id: string;
  storeId: string;
  productId: string;
  quantity: number;
  reason: ReturnReason;
  status: ReturnStatus;
  notes?: string;
  reportedBy: string;
  reportedAt: string;
}

export type FridgeIssueType =
  | "switched_off"
  | "competitor_products"
  | "non_company_products"
  | "damaged"
  | "dirty"
  | "inaccessible"
  | "temperature_problem"
  | "other";

export interface FridgeReport {
  id: string;
  storeId: string;
  fridgeAssetNumber?: string;
  issueType: FridgeIssueType;
  description: string;
  status: "open" | "under_review" | "resolved";
  reportedBy: string;
  reportedAt: string;
}

export type NotificationTarget =
  | "all_users"
  | "all_sales_reps"
  | "admins"
  | "specific_users";

export interface Notification {
  id: string;
  type: "expiry_alert" | "return_update" | "fridge_report" | "general";
  title: string;
  message: string;
  target: NotificationTarget;
  userIds?: string[];
  readBy: string[];
  createdAt: string;
}

