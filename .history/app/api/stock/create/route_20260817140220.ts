import { NextResponse } from "next/server";
import { addStockBatch } from "@/lib/db-supabase";
import { getCurrentUser } from "@/lib/auth";
import { readJsonFile, writeJsonFile } from "@/lib/db";
import { createNotification } from "@/lib/notifications";

import type {
  Product,
  StockBatch,
  Store,
} from "@/lib/types";

const EXPIRY_WARNING_DAYS = 10;

function getDaysUntilExpiry(expiryDate: string): number {
  const today = new Date();
  const expiry = new Date(expiryDate);

  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  const difference =
    expiry.getTime() - today.getTime();

  return Math.ceil(
    difference / (1000 * 60 * 60 * 24)
  );
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be logged in",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      storeId,
      productId,
      quantity,
      expiryDate,
    } = body;

    if (
      !storeId ||
      !productId ||
      quantity === undefined ||
      !expiryDate
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    const quantityNumber = Number(quantity);

    if (
      !Number.isInteger(quantityNumber) ||
      quantityNumber <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Quantity must be a positive whole number",
        },
        { status: 400 }
      );
    }

    // Check that the user has access to the store.
    const stores =
      await readJsonFile<Store[]>("stores.json");

    const store = stores.find(
      (item) => item.id === storeId
    );

    if (!store) {
      return NextResponse.json(
        {
          success: false,
          message: "Store not found",
        },
        { status: 404 }
      );
    }

    const canAccessStore =
      user.role === "admin" ||
      user.assignedStoreIds.includes(storeId);

    if (!canAccessStore) {
      return NextResponse.json(
        {
          success: false,
          message: "You do not have access to this store",
        },
        { status: 403 }
      );
    }

    const products =
      await readJsonFile<Product[]>("products.json");

    const product = products.find(
      (item) => item.id === productId
    );

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    const daysUntilExpiry =
      getDaysUntilExpiry(expiryDate);

    const newBatch: StockBatch = {
      id: crypto.randomUUID(),
      storeId,
      productId,
      quantity: quantityNumber,
      expiryDate,
      capturedBy: user.id,
      capturedAt: new Date().toISOString(),
    };

    const stockBatches =
      await readJsonFile<StockBatch[]>(
        "stock-batches.json"
      );

    stockBatches.unshift(newBatch);

    await writeJsonFile(
      "stock-batches.json",
      stockBatches
    );

    // Create an alert if stock expires within 10 days.
    if (daysUntilExpiry >= 0 && daysUntilExpiry <= EXPIRY_WARNING_DAYS) {
      const expiryText =
        daysUntilExpiry === 0
          ? "expires today"
          : `expires in ${daysUntilExpiry} day${
              daysUntilExpiry === 1 ? "" : "s"
            }`;

      await createNotification({
        id: crypto.randomUUID(),
        type: "expiry_alert",
        title: "Stock Expiring Soon",
        message: `${product.name} at ${store.name} ${expiryText}. Please check your assigned stores for similar stock.`,
        target: "all_sales_reps",
        readBy: [],
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Stock batch saved successfully",
      batch: newBatch,
      expiringSoon:
        daysUntilExpiry >= 0 &&
        daysUntilExpiry <= EXPIRY_WARNING_DAYS,
      daysUntilExpiry,
    });
  } catch (error) {
    console.error("Stock creation error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save stock",
      },
      { status: 500 }
    );
  }
}