"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import { useAuth } from "@/components/auth/AuthProvider";
import { safeNextPath, signupHref } from "@/lib/auth/paths";
import { packages } from "@/lib/data/packages";

const panelImage =
  packages.find((pkg) => pkg.slug === "kerala-munnar") ?? packages[0];

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = safeNextPath(searchParams.get("next"));
  const { signIn, isAuthenticated, isReady } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isReady && isAuthenticated) {
      router.replace(nextPath);
    }
  }, [isAuthenticated, isReady, nextPath, router]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || !password) return;
    signIn(email, remember);
    router.push(nextPath);
  }

  return (
    <AuthShell
      kicker="Mayura Holidays"
      panelTitle="Travel further, travel beautifully"
      panelMessage="Thoughtfully planned journeys from Bengaluru — coast, hills, and heritage, cared for since 1990."
      imageSrc={panelImage.image}
      imageAlt={panelImage.imageAlt}
    >
      <h1 className="font-display text-4xl font-bold tracking-tight text-navy sm:text-[2.6rem]">
        Welcome Back
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate">
        Sign in to access your Mayura account and continue planning your next
        journey.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-navy">
            Email
          </span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            className="w-full rounded-2xl border border-[#E4EAF2] bg-[#F7FAFE] px-4 py-3.5 text-sm text-navy outline-none transition-colors placeholder:text-slate/70 focus:border-blue"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-navy">
            Password
          </span>
          <span className="relative block">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-2xl border border-[#E4EAF2] bg-[#F7FAFE] px-4 py-3.5 pr-12 text-sm text-navy outline-none transition-colors placeholder:text-slate/70 focus:border-blue"
            />
            <button
              type="button"
              onClick={() => setShowPassword((open) => !open)}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-slate hover:text-navy"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </span>
        </label>

        <div className="flex items-center justify-between gap-3 pt-1 text-sm">
          <label className="inline-flex items-center gap-2 text-slate">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="size-4 rounded border-[#C9D6E8] accent-[var(--color-accent)]"
            />
            Remember me
          </label>
          <Link
            href="/forgot-password"
            className="font-medium text-navy transition-colors hover:text-accent"
          >
            Forgot Password
          </Link>
        </div>

        <button
          type="submit"
          className="mt-2 w-full rounded-full bg-accent px-5 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy"
        >
          Sign In
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate">
        Don&apos;t have an account?{" "}
        <Link
          href={signupHref(searchParams.get("next"))}
          className="font-semibold text-navy hover:text-accent"
        >
          Sign Up
        </Link>
      </p>
    </AuthShell>
  );
}
