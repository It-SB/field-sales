import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { readJsonFile, writeJsonFile } from "@/lib/db";
import type { Notification } from "@/lib/types";

export async function POST() {
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

    const notifications =
      await readJsonFile<Notification[]>(
        "notifications.json"
      );

    let updatedCount = 0;

    for (const notification of notifications) {
      const canRead =
        notification.target === "all_users" ||
        (notification.target === "all_sales_reps" &&
          user.role === "sales_rep") ||
        (notification.target === "admins" &&
          user.role === "admin") ||
        (notification.target === "specific_users" &&
          notification.userIds?.includes(user.id));

      if (
        canRead &&
        !notification.readBy.includes(user.id)
      ) {
        notification.readBy.push(user.id);
        updatedCount++;
      }
    }

    await writeJsonFile(
      "notifications.json",
      notifications
    );

    return NextResponse.json({
      success: true,
      updatedCount,
    });
  } catch (error) {
    console.error(
      "Mark all notifications error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update notifications",
      },
      { status: 500 }
    );
  }
}