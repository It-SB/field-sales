"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Could not connect to the server");
    } finally {
      setLoading(false);
    }
  }

  function useDemoAccount(email: string, password: string) {
    setEmail(email);
    setPassword(password);
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-slate-900">
          Field Sales
        </h1>

        <p className="mt-2 text-slate-500">
          Sign in to continue
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 border-t pt-6">
          <p className="mb-3 text-sm font-medium text-slate-600">
            Demo Accounts
          </p>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() =>
                useDemoAccount("admin@demo.com", "admin123")
              }
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-left text-sm hover:bg-slate-50"
            >
              👨‍💼 System Admin
            </button>

            <button
              type="button"
              onClick={() =>
                useDemoAccount("john@demo.com", "demo123")
              }
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-left text-sm hover:bg-slate-50"
            >
              🧑‍💼 John Sales
            </button>

            <button
              type="button"
              onClick={() =>
                useDemoAccount("sarah@demo.com", "demo123")
              }
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-left text-sm hover:bg-slate-50"
            >
              🧑‍💼 Sarah Sales
            </button>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Demo accounts automatically fill in the login details.
          </p>
        </div>
      </div>
    </main>
  );
}