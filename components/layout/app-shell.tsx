import type { ReactNode } from "react";
import type { User } from "@/lib/types";
import AppNav from "./app-nav";
import Link from "next/link";

interface AppShellProps {
  user: User;
  unreadCount: number;
  children: ReactNode;
}

export default function AppShell({
  user,
  unreadCount,
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-100">
        
      <AppNav
        user={user}
        unreadCount={unreadCount}
      />

      {children}
    </div>
  );
}
