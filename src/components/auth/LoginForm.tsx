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

      {/* Google Sign In */}
      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-[#E4EAF2]" />
        <span className="text-xs font-medium text-slate">or continue with</span>
        <span className="h-px flex-1 bg-[#E4EAF2]" />
      </div>

      <button
        type="button"
        onClick={() => {
          // Google OAuth will be connected here.
        }}
        className="flex w-full items-center justify-center gap-3 rounded-full border border-[#E1E7F0] bg-white px-5 py-3.5 text-sm font-semibold text-navy transition-all duration-300 hover:-translate-y-0.5 hover:border-blue hover:bg-[#F7FAFE]"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fill="#4285F4"
            d="M21.35 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.23a4.47 4.47 0 0 1-1.94 2.93v2.43h3.14c1.84-1.69 2.92-4.18 2.92-7.19Z"
          />
          <path
            fill="#34A853"
            d="M12 21.75c2.63 0 4.84-.87 6.45-2.33l-3.14-2.43c-.87.58-1.98.93-3.31.93-2.54 0-4.7-1.72-5.47-4.03H3.28v2.5A9.74 9.74 0 0 0 12 21.75Z"
          />
          <path
            fill="#FBBC05"
            d="M6.53 13.89A5.85 5.85 0 0 1 6.22 12c0-.66.11-1.3.31-1.89v-2.5H3.28A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.06 1.03 4.39l3.25-2.5Z"
          />
          <path
            fill="#EA4335"
            d="M12 6.08c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.2 14.63 2.25 12 2.25a9.74 9.74 0 0 0-8.72 5.36l3.25 2.5C7.3 7.8 9.46 6.08 12 6.08Z"
          />
        </svg>

        Continue with Google
      </button>

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