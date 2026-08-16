import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <div className="text-5xl">
          📡
        </div>

        <h1 className="mt-5 text-2xl font-bold text-slate-900">
          You&apos;re offline
        </h1>

        <p className="mt-3 text-slate-500">
          Please reconnect to the internet to
          sync your stock reports and updates.
        </p>

        <Link
          href="/dashboard"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white"
        >
          Try Again
        </Link>
      </section>
    </main>
  );
}