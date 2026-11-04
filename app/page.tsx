import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[var(--color-ink)] text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-between px-6 py-10 sm:py-16">
        <p className="text-sm font-semibold tracking-[0.2em] text-white/50 uppercase">
          Nidhiva
        </p>
        <div className="max-w-xl space-y-5">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            Personal finance, built for clarity.
          </h1>
          <p className="text-base text-white/65 sm:text-lg">
            Income, expenses, transfers, splits and reports in one professional
            workspace — without treating every outflow as spending.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:max-w-sm">
          <Link
            href="/register"
            className="rounded-lg bg-white px-4 py-3 text-center text-sm font-semibold text-[var(--color-ink)]"
          >
            Create account
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-white/20 px-4 py-3 text-center text-sm font-semibold text-white"
          >
            Log in
          </Link>
        </div>
      </div>
    </main>
  );
}
