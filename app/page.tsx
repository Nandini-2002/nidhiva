import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white text-[var(--color-ink)]">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 py-12">
        <img
          src="/brand/nidhiva-logo.jpg"
          alt="Nidhiva. Your Money. Your Treasure."
          className="w-full max-w-3xl"
        />
        <div className="mt-2 flex w-full max-w-sm flex-col gap-3">
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
