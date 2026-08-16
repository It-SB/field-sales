import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { readJsonFile, writeJsonFile } from "@/lib/db";
import type { Notification } from "@/lib/types";

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

    const { notificationId } = body;

    if (!notificationId) {
      return NextResponse.json(
        {
          success: false,
          message: "Notification ID is required",
        },
        { status: 400 }
      );
    }

    const notifications =
      await readJsonFile<Notification[]>(
        "notifications.json"
      );

    const notification = notifications.find(
      (item) => item.id === notificationId
    );

    if (!notification) {
      return NextResponse.json(
        {
          success: false,
          message: "Notification not found",
        },
        { status: 404 }
      );
    }

    // Make sure this user is actually allowed
    // to access this notification.
    const canRead =
      notification.target === "all_users" ||
      (notification.target === "all_sales_reps" &&
        user.role === "sales_rep") ||
      (notification.target === "admins" &&
        user.role === "admin") ||
      (notification.target === "specific_users" &&
        notification.userIds?.includes(user.id));

    if (!canRead) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You do not have access to this notification",
        },
        { status: 403 }
      );
    }

    if (!notification.readBy.includes(user.id)) {
      notification.readBy.push(user.id);
    }

    await writeJsonFile(
      "notifications.json",
      notifications
    );

    return NextResponse.json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    console.error(
      "Notification read error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update notification",
      },
      { status: 500 }
    );
  }
}