import Link from "next/link";
import type { User } from "@/lib/types";
import LogoutButton from "./logout-button";

interface AppNavProps {
  user: User;
  unreadCount: number;
}

export default function AppNav({ user, unreadCount }: AppNavProps) {
  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/dashboard" className="text-xl font-bold text-slate-900">
          Field Sales
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 sm:block"
          >
            Dashboard
          </Link>

          <Link
            href="/stores"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Stores
          </Link>

          <Link href="/admin/reports" className="...">
            Reports
          </Link>

          <Link
            href="/alerts"
            className="relative text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Alerts
            {unreadCount > 0 && (
              <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-bold text-white">
                {unreadCount}
              </span>
            )}
          </Link>

          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-800">{user.name}</p>

            <p className="text-xs capitalize text-slate-500">
              {user.role.replace("_", " ")}
            </p>
          </div>

          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}
