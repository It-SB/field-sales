import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { readJsonFile, writeJsonFile } from "@/lib/db";
import { createNotification } from "@/lib/notifications";

import type {
  Product,
  ReturnItem,
  Store,
} from "@/lib/types";

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
      reason,
      notes,
    } = body;

    if (
      !storeId ||
      !productId ||
      quantity === undefined ||
      !reason
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All required fields must be completed",
        },
        { status: 400 }
      );
    }

    const validReasons = [
      "expired",
      "damaged",
      "melted",
      "other",
    ];

    if (!validReasons.includes(reason)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid return reason",
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

    // Verify store exists and user can access it
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

    // Verify product exists
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

    const returnItem: ReturnItem = {
      id: crypto.randomUUID(),
      storeId,
      productId,
      quantity: quantityNumber,
      reason,
      status: "submitted",
      notes: notes?.trim() || undefined,
      reportedBy: user.id,
      reportedAt: new Date().toISOString(),
    };

    const returns =
      await readJsonFile<ReturnItem[]>("returns.json");

    returns.unshift(returnItem);

    await writeJsonFile("returns.json", returns);

    // Notify admins
    await createNotification({
      id: crypto.randomUUID(),
      type: "return_update",
      title: "New Return Submitted",
      message: `${user.name} submitted a ${reason} return for ${quantityNumber} × ${product.name} at ${store.name}.`,
      target: "admins",
      readBy: [],
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Return submitted successfully",
      returnItem,
    });
  } catch (error) {
    console.error("Return creation error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit return",
      },
      { status: 500 }
    );
  }
}