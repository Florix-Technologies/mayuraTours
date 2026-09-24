"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import { useAuth } from "@/components/auth/AuthProvider";
import { loginHref, safeNextPath, verifyEmailHref } from "@/lib/auth/paths";
import { packages } from "@/lib/data/packages";

const panelImage = packages.find((pkg) => pkg.slug === "coorg") ?? packages[0];

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = safeNextPath(searchParams.get("next"));
  const { isAuthenticated, isReady } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isReady && isAuthenticated) {
      router.replace(nextPath);
    }
  }, [isAuthenticated, isReady, nextPath, router]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || !password) return;
    router.push(verifyEmailHref(email, searchParams.get("next") ?? nextPath));
  }

  return (
    <AuthShell
      kicker="Join Mayura"
      panelTitle="Your next escape begins here"
      panelMessage="Create an account to book packages, save trip details, and pick up exactly where you left off."
      imageSrc={panelImage.image}
      imageAlt={panelImage.imageAlt}
    >
      <h1 className="font-display text-4xl font-bold tracking-tight text-navy sm:text-[2.6rem]">
        Create Account
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate">
        A few details are all we need to start your Mayura Holidays journey.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-navy">
            Full name
          </span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter your name"
            className="w-full rounded-2xl border border-[#E4EAF2] bg-[#F7FAFE] px-4 py-3.5 text-sm text-navy outline-none transition-colors placeholder:text-slate/70 focus:border-blue"
          />
        </label>

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
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a password"
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

        <button
          type="submit"
          className="mt-2 w-full rounded-full bg-accent px-5 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy"
        >
          Sign Up
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate">
        Already have an account?{" "}
        <Link
          href={loginHref(searchParams.get("next"))}
          className="font-semibold text-navy hover:text-accent"
        >
          Sign In
        </Link>
      </p>
    </AuthShell>
  );
}
