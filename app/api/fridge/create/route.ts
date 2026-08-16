import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { readJsonFile, writeJsonFile } from "@/lib/db";
import { createNotification } from "@/lib/notifications";

import type {
  FridgeIssueType,
  FridgeReport,
  Store,
} from "@/lib/types";

const validIssueTypes: FridgeIssueType[] = [
  "switched_off",
  "competitor_products",
  "non_company_products",
  "damaged",
  "dirty",
  "temperature_problem",
  "inaccessible",
  "other",
];

const issueLabels: Record<
  FridgeIssueType,
  string
> = {
  switched_off: "Fridge Switched Off",
  competitor_products: "Competitor Products Inside",
  non_company_products: "Non-Company Products Inside",
  damaged: "Fridge Damaged",
  dirty: "Dirty / Poorly Maintained",
  temperature_problem: "Temperature Problem",
  inaccessible: "Fridge Inaccessible",
  other: "Other Issue",
};

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
      issueType,
      description,
    } = body;

    if (!storeId || !issueType) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Store and issue type are required",
        },
        { status: 400 }
      );
    }

    if (
      !validIssueTypes.includes(
        issueType as FridgeIssueType
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid fridge issue type",
        },
        { status: 400 }
      );
    }

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
          message:
            "You do not have access to this store",
        },
        { status: 403 }
      );
    }

    const fridgeReport: FridgeReport = {
      id: crypto.randomUUID(),
      storeId,
      issueType:
        issueType as FridgeIssueType,
      description:
        description?.trim() || undefined,
      status: "open",
      reportedBy: user.id,
      reportedAt: new Date().toISOString(),
    };

    const reports =
      await readJsonFile<FridgeReport[]>(
        "fridge-reports.json"
      );

    reports.unshift(fridgeReport);

    await writeJsonFile(
      "fridge-reports.json",
      reports
    );

    await createNotification({
      id: crypto.randomUUID(),
      type: "fridge_report",
      title: "New Fridge Issue Reported",
      message: `${user.name} reported "${issueLabels[fridgeReport.issueType]}" at ${store.name}.`,
      target: "admins",
      readBy: [],
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message:
        "Fridge issue reported successfully",
      report: fridgeReport,
    });
  } catch (error) {
    console.error(
      "Fridge report creation error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to submit fridge report",
      },
      { status: 500 }
    );
  }
}