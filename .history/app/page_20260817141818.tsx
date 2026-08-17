"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bell,
  ClipboardCheck,
  Package,
  ShieldAlert,
  Snowflake,
  Truck,
} from "lucide-react";

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    // Your existing soft-auth logic can replace this later
    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 lg:px-10">
        {/* Header */}
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/30">
              <Snowflake size={24} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight">
                FieldSales
              </h1>
              <p className="text-xs text-slate-400">
                Cold Chain Management
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 md:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            System Online
          </div>
        </header>

        {/* Hero */}
        <section className="grid flex-1 items-center gap-16 py-12 lg:grid-cols-2 lg:py-20">
          {/* Left */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
              <Truck size={16} />
              Field Sales & Stock Management
            </div>

            <h2 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
              Manage your field stock.
              <span className="block text-blue-400">
                Before it becomes a loss.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
              Track stock, monitor expiry dates, process returns, report fridge
              abuse and keep your field sales team connected in one place.
            </p>

            {/* Features */}
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <Feature
                icon={<Package size={20} />}
                title="Stock Tracking"
                description="Capture stock across every assigned store."
              />

              <Feature
                icon={<Bell size={20} />}
                title="Expiry Alerts"
                description="Notify field reps before products expire."
              />

              <Feature
                icon={<ClipboardCheck size={20} />}
                title="Returns Processing"
                description="Record expired, damaged and melted stock."
              />

              <Feature
                icon={<ShieldAlert size={20} />}
                title="Fridge Reports"
                description="Report misuse and cold-chain issues quickly."
              />
            </div>
          </div>

          {/* Login Card */}
          <div className="mx-auto w-full max-w-md">
            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 shadow-2xl backdrop-blur-xl sm:p-10">
              <div className="mb-8">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30">
                  <ArrowRight size={24} />
                </div>

                <h3 className="text-2xl font-bold">Welcome back</h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Sign in to access your stores, stock information and field
                  reports.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Email address
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-12 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Password
                  </label>

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-12 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <button
                  type="submit"
                  className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500 active:scale-[0.98]"
                >
                  Access Dashboard
                  <ArrowRight size={18} />
                </button>
              </form>

              {/* Demo accounts */}
              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Demo Access
                </p>

                <div className="space-y-2 text-xs text-slate-400">
                  <div className="flex justify-between rounded-lg bg-white/5 px-3 py-2">
                    <span>Admin</span>
                    <span>admin@demo.com</span>
                  </div>

                  <div className="flex justify-between rounded-lg bg-white/5 px-3 py-2">
                    <span>Sales Rep</span>
                    <span>john@demo.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 FieldSales. Cold Chain & Field Stock Management.</p>

          <div className="flex items-center gap-2">
            <Snowflake size={14} />
            <span>Built for field operations</span>
          </div>
        </footer>
      </div>
    </main>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-blue-500/30 hover:bg-white/[0.07]">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
        {icon}
      </div>

      <div>
        <h4 className="font-semibold text-white">{title}</h4>
        <p className="mt-1 text-sm leading-5 text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}