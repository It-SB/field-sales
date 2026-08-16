import "server-only";

import { readJsonFile, writeJsonFile } from "./db";
import type { Notification, User } from "./types";

export async function getNotificationsForUser(
  user: User
): Promise<Notification[]> {
  const notifications =
    await readJsonFile<Notification[]>("notifications.json");

  return notifications.filter((notification) => {
    switch (notification.target) {
      case "all_users":
        return true;

      case "all_sales_reps":
        return user.role === "sales_rep";

      case "admins":
        return user.role === "admin";

      case "specific_users":
        return notification.userIds?.includes(user.id) ?? false;

      default:
        return false;
    }
  });
}

export function getUnreadNotifications(
  notifications: Notification[],
  userId: string
): Notification[] {
  return notifications.filter(
    (notification) => !notification.readBy.includes(userId)
  );
}

export async function createNotification(
  notification: Notification
): Promise<Notification> {
  const notifications =
    await readJsonFile<Notification[]>("notifications.json");

  notifications.unshift(notification);

  await writeJsonFile(
    "notifications.json",
    notifications
  );

  return notification;
}