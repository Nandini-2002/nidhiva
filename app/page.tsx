import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="fixed inset-0 flex items-center justify-center overflow-hidden bg-white text-[var(--color-ink)]">
      <div className="flex w-full max-w-3xl flex-col items-center px-6">
        <img
          src="/brand/nidhiva-logo.jpg"
          alt="Nidhiva. Your Money. Your Treasure."
          className="h-auto w-full max-h-[min(42vh,280px)] max-w-2xl object-contain"
        />
        <div className="mt-8 flex w-full max-w-sm flex-col gap-3">
          <Link
            href="/register"
            className="rounded-lg bg-[var(--color-ink)] px-4 py-3 text-center text-sm font-semibold text-white"
          >
            Create account
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-[var(--color-line)] px-4 py-3 text-center text-sm font-semibold"
          >
            Log in
          </Link>
        </div>
      </div>
    </main>
  );
}
