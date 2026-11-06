"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { validateRegister } from "@/lib/validations/auth";

export default function RegisterPage() {
  const { register, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const check = validateRegister({ name, email, password, confirm });
    setErrors(check.errors);
    if (!check.ok) return;
    setBusy(true);
    setError(null);
    try {
      await register(name, email, password, confirm);
      router.replace("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setBusy(false);
    }
  }

  async function onGoogle() {
    setBusy(true);
    setError(null);
    try {
      await loginWithGoogle();
      router.replace("/home");
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
      <h1 className="text-2xl font-semibold">Create your account</h1>
      <p className="mt-1 text-sm text-[var(--color-muted)]">
        Use Google, or an email with a strong password
      </p>

      <div className="mt-8">
        <GoogleButton
          onClick={() => void onGoogle()}
          disabled={busy}
          label="Sign up with Google"
        />
      </div>

      <div className="my-5 flex items-center gap-3 text-xs text-[var(--color-muted)]">
        <span className="h-px flex-1 bg-[var(--color-line)]" />
        or email
        <span className="h-px flex-1 bg-[var(--color-line)]" />
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Field error={errors.name}>
          <Input
            placeholder="Your name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        <Field error={errors.email}>
          <Input
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field error={errors.password}>
          <Input
            type="password"
            placeholder="Password (8+ chars, letter and number)"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Field error={errors.confirm}>
          <Input
            type="password"
            placeholder="Confirm password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </Field>
        {error ? <p className="text-sm text-[var(--color-rose)]">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Creating…" : "Create account"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[var(--color-purple)]">
          Log in
        </Link>
      </p>
    </main>
  );
}

function Field({
  error,
  children,
}: {
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
      {error ? <p className="mt-1 text-xs text-[var(--color-rose)]">{error}</p> : null}
    </div>
  );
}
