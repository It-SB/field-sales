import { supabase } from "@/lib/supabase";

import type {
  FridgeReport,
  Product,
  ReturnItem,
  StockBatch,
  Store,
  User,
} from "@/lib/types";

function mapUser(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    password: row.password,
    role: row.role,
    assignedStoreIds: row.assigned_store_ids ?? [],
  };
}

function mapStore(row: any): Store {
  return {
    id: row.id,
    name: row.name,
    address: row.address ?? "",
    assignedRepId: row.assigned_rep_id ?? "",
  };
}

function mapProduct(row: any): Product {
  return {
    id: row.id,
    productLine: row.product_line ?? "",
    name: row.name,
    flavour: row.flavour ?? "",
    size: row.size ?? "",
    sku: row.sku ?? "",
    active: row.active ?? true,
  };
}

function mapStockBatch(row: any): StockBatch {
  return {
    id: row.id,
    storeId: row.store_id,
    productId: row.product_id,
    quantity: row.quantity,
    expiryDate: row.expiry_date,
    capturedBy: row.captured_by,
    capturedAt: row.captured_at,
  };
}

function mapReturn(row: any): ReturnItem {
  return {
    id: row.id,
    storeId: row.store_id,
    productId: row.product_id,
    quantity: row.quantity,
    reason: row.reason,
    notes: row.notes ?? "",
    status: row.status,
    reportedBy: row.reported_by,
    reportedAt: row.reported_at,
  };
}

function mapFridgeReport(row: any): FridgeReport {
  return {
    id: row.id,
    storeId: row.store_id,
    issueType: row.issue_type,
    description: row.description ?? "",
    status: row.status,
    reportedBy: row.reported_by,
    reportedAt: row.reported_at,
  };
}

export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("name");

  if (error) throw error;

  return (data ?? []).map(mapUser);
}

export async function getStores(): Promise<Store[]> {
  const { data, error } = await supabase
    .from("stores")
    .select("*")
    .order("name");

  if (error) throw error;

  return (data ?? []).map(mapStore);
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("name");

  if (error) throw error;

  return (data ?? []).map(mapProduct);
}

export async function getStockBatches(): Promise<StockBatch[]> {
  const { data, error } = await supabase
    .from("stock_batches")
    .select("*")
    .order("captured_at", {
      ascending: false,
    });

  if (error) throw error;

  return (data ?? []).map(mapStockBatch);
}

export async function getReturns(): Promise<ReturnItem[]> {
  const { data, error } = await supabase
    .from("returns")
    .select("*")
    .order("reported_at", {
      ascending: false,
    });

  if (error) throw error;

  return (data ?? []).map(mapReturn);
}

export async function getFridgeReports(): Promise<
  FridgeReport[]
> {
  const { data, error } = await supabase
    .from("fridge_reports")
    .select("*")
    .order("reported_at", {
      ascending: false,
    });

  if (error) throw error;

  return (data ?? []).map(mapFridgeReport);
}

export async function addStockBatch(
  batch: StockBatch
): Promise<StockBatch> {
  const { data, error } = await supabase
    .from("stock_batches")
    .insert({
      id: batch.id,
      store_id: batch.storeId,
      product_id: batch.productId,
      quantity: batch.quantity,
      expiry_date: batch.expiryDate,
      captured_by: batch.capturedBy,
      captured_at: batch.capturedAt,
    })
    .select()
    .single();

  if (error) throw error;

  return mapStockBatch(data);
}

export async function addReturn(
  item: ReturnItem
): Promise<ReturnItem> {
  const { data, error } = await supabase
    .from("returns")
    .insert({
      id: item.id,
      store_id: item.storeId,
      product_id: item.productId,
      quantity: item.quantity,
      reason: item.reason,
      notes: item.notes,
      status: item.status,
      reported_by: item.reportedBy,
      reported_at: item.reportedAt,
    })
    .select()
    .single();

  if (error) throw error;

  return mapReturn(data);
}

export async function addFridgeReport(
  report: FridgeReport
): Promise<FridgeReport> {
  const { data, error } = await supabase
    .from("fridge_reports")
    .insert({
      id: report.id,
      store_id: report.storeId,
      issue_type: report.issueType,
      description: report.description,
      status: report.status,
      reported_by: report.reportedBy,
      reported_at: report.reportedAt,
    })
    .select()
    .single();

  if (error) throw error;

  return mapFridgeReport(data);
}