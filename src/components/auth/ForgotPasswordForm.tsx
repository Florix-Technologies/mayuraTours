"use client";

import { useState } from "react";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import { packages } from "@/lib/data/packages";

const panelImage =
  packages.find((pkg) => pkg.slug === "ooty-coonoor") ?? packages[0];

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <AuthShell
      kicker="Mayura Holidays"
      panelTitle="We'll help you get back on the road"
      panelMessage="Reset access to your account and continue planning your next Mayura journey."
      imageSrc={panelImage.image}
      imageAlt={panelImage.imageAlt}
    >
      <h1 className="font-display text-4xl font-bold tracking-tight text-navy sm:text-[2.35rem]">
        Forgot Password
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate">
        Enter the email on your Mayura account. Password reset will be connected
        in a later step — nothing is sent yet.
      </p>

      {submitted ? (
        <div className="mt-8 rounded-2xl border border-line bg-paper px-5 py-6 text-sm leading-6 text-navy">
          If an account exists for{" "}
          <span className="font-semibold">{email}</span>, reset instructions
          will appear here once email delivery is enabled.
        </div>
      ) : (
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

          <button
            type="submit"
            className="mt-2 w-full rounded-full bg-ink px-5 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy"
          >
            Continue
          </button>
        </form>
      )}

      <p className="mt-8 text-center text-sm text-slate">
        Remembered your password?{" "}
        <Link href="/login" className="font-semibold text-navy hover:text-accent">
          Sign In
        </Link>
      </p>
    </AuthShell>
  );
}
