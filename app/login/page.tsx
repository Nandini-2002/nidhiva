"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { validateLogin } from "@/lib/validations/auth";

function LoginForm() {
  const { login, loginWithGoogle, continueAsGuest } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/home";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const check = validateLogin({ email, password });
    setErrors(check.errors);
    if (!check.ok) return;
    setBusy(true);
    setError(null);
    try {
      await login(email, password);
      router.replace(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  async function onGoogle() {
    setBusy(true);
    setError(null);
    try {
      await loginWithGoogle();
      router.replace(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-10">
      <Link href="/" className="mb-8 flex items-center gap-3">
        <img
          src="/brand/nidhiva-mark.png"
          alt=""
          className="h-14 w-14 rounded-2xl object-cover"
        />
        <span>
          <span className="block text-3xl font-extrabold tracking-tight text-[var(--color-ink)]">
            Nidhiva
          </span>
          <span className="block text-sm text-[var(--color-muted)]">
            Your Money. Your Treasure.
          </span>
        </span>
      </Link>
      <h1 className="text-2xl font-semibold">Welcome back</h1>
      <p className="mt-1 text-sm text-[var(--color-muted)]">
        Sign in with Google or your email
      </p>

      <div className="mt-8">
        <GoogleButton onClick={() => void onGoogle()} disabled={busy} />
      </div>

      <div className="my-5 flex items-center gap-3 text-xs text-[var(--color-muted)]">
        <span className="h-px flex-1 bg-[var(--color-line)]" />
        or email
        <span className="h-px flex-1 bg-[var(--color-line)]" />
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <Input
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email ? (
            <p className="mt-1 text-xs text-[var(--color-rose)]">{errors.email}</p>
          ) : null}
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password ? (
            <p className="mt-1 text-xs text-[var(--color-rose)]">
              {errors.password}
            </p>
          ) : null}
        </div>
        {error ? <p className="text-sm text-[var(--color-rose)]">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Signing in…" : "Log in"}
        </Button>
      </form>
      <Button
        type="button"
        variant="ghost"
        className="mt-3 w-full"
        disabled={busy}
        onClick={() => {
          continueAsGuest();
          router.replace("/home");
        }}
      >
        Continue as guest
      </Button>
      <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
        New here?{" "}
        <Link href="/register" className="font-semibold text-[var(--color-purple)]">
          Create an account
        </Link>
      </p>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--color-ivory)]" />}>
      <LoginForm />
    </Suspense>
  );
}
