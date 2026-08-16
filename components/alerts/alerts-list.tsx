"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { Notification } from "@/lib/types";

interface AlertsListProps {
  initialNotifications: Notification[];
  currentUserId: string;
}

function getNotificationTypeLabel(
  type: Notification["type"]
) {
  switch (type) {
    case "expiry_alert":
      return "Expiry Alert";

    case "return_update":
      return "Return Update";

    case "fridge_report":
      return "Fridge Report";

    case "general":
      return "General";

    default:
      return "Notification";
  }
}

function getNotificationIcon(
  type: Notification["type"]
) {
  switch (type) {
    case "expiry_alert":
      return "⚠️";

    case "return_update":
      return "🔄";

    case "fridge_report":
      return "🧊";

    case "general":
      return "📢";

    default:
      return "🔔";
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat(
    "en-ZA",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(date);
}

export default function AlertsList({
  initialNotifications,
  currentUserId,
}: AlertsListProps) {
  const router = useRouter();

  const [notifications, setNotifications] =
    useState(initialNotifications);

  const [loadingId, setLoadingId] =
    useState<string | null>(null);

  const [markingAll, setMarkingAll] =
    useState(false);

  const [error, setError] = useState("");

  const unreadCount = notifications.filter(
    (notification) =>
      !notification.readBy.includes(currentUserId)
  ).length;

  async function markAsRead(
    notificationId: string
  ) {
    setError("");
    setLoadingId(notificationId);

    try {
      const response = await fetch(
        "/api/notifications/read",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            notificationId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to mark notification as read"
        );
        return;
      }

      setNotifications((current) =>
        current.map((notification) => {
          if (notification.id !== notificationId) {
            return notification;
          }

          if (
            notification.readBy.includes(
              currentUserId
            )
          ) {
            return notification;
          }

          return {
            ...notification,
            readBy: [
              ...notification.readBy,
              currentUserId,
            ],
          };
        })
      );

      router.refresh();
    } catch {
      setError(
        "Could not connect to the server"
      );
    } finally {
      setLoadingId(null);
    }
  }

  async function markAllAsRead() {
    setError("");
    setMarkingAll(true);

    try {
      const response = await fetch(
        "/api/notifications/read-all",
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to mark notifications as read"
        );
        return;
      }

      setNotifications((current) =>
        current.map((notification) => {
          if (
            notification.readBy.includes(
              currentUserId
            )
          ) {
            return notification;
          }

          return {
            ...notification,
            readBy: [
              ...notification.readBy,
              currentUserId,
            ],
          };
        })
      );

      router.refresh();
    } catch {
      setError(
        "Could not connect to the server"
      );
    } finally {
      setMarkingAll(false);
    }
  }

  if (notifications.length === 0) {
    return (
      <div className="rounded-xl bg-white p-10 text-center shadow-sm">
        <p className="text-4xl">🔔</p>

        <h2 className="mt-4 text-xl font-bold text-slate-900">
          No alerts yet
        </h2>

        <p className="mt-2 text-slate-500">
          Notifications relevant to you will appear here.
        </p>
      </div>
    );
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {unreadCount > 0
            ? `${unreadCount} unread notification${
                unreadCount === 1 ? "" : "s"
              }`
            : "You're all caught up!"}
        </p>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            disabled={markingAll}
            className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-100 disabled:opacity-50"
          >
            {markingAll
              ? "Marking..."
              : "Mark All as Read"}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {notifications.map((notification) => {
          const isRead =
            notification.readBy.includes(
              currentUserId
            );

          return (
            <article
              key={notification.id}
              className={`rounded-xl border p-5 shadow-sm transition ${
                isRead
                  ? "border-slate-200 bg-white"
                  : "border-blue-200 bg-blue-50"
              }`}
            >
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-xl shadow-sm">
                  {getNotificationIcon(
                    notification.type
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                          {getNotificationTypeLabel(
                            notification.type
                          )}
                        </span>

                        {!isRead && (
                          <span className="rounded-full bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white">
                            New
                          </span>
                        )}
                      </div>

                      <h2 className="mt-3 font-bold text-slate-900">
                        {notification.title}
                      </h2>
                    </div>

                    <time className="shrink-0 text-xs text-slate-400">
                      {formatDate(
                        notification.createdAt
                      )}
                    </time>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {notification.message}
                  </p>

                  {!isRead && (
                    <button
                      onClick={() =>
                        markAsRead(
                          notification.id
                        )
                      }
                      disabled={
                        loadingId ===
                        notification.id
                      }
                      className="mt-4 text-sm font-semibold text-blue-600 hover:underline disabled:opacity-50"
                    >
                      {loadingId ===
                      notification.id
                        ? "Updating..."
                        : "Mark as Read"}
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}