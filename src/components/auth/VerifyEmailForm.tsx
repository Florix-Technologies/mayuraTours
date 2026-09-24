"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import { useAuth } from "@/components/auth/AuthProvider";
import { safeNextPath, signupHref } from "@/lib/auth/paths";
import { packages } from "@/lib/data/packages";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

const panelImage = packages.find((pkg) => pkg.slug === "goa") ?? packages[0];

export default function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = safeNextPath(searchParams.get("next"));
  const email = (searchParams.get("email") ?? "").trim();
  const { signIn, isAuthenticated, isReady } = useAuth();

  const [digits, setDigits] = useState<string[]>(() =>
    Array.from({ length: OTP_LENGTH }, () => ""),
  );
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [error, setError] = useState("");
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const code = digits.join("");
  const canVerify = code.length === OTP_LENGTH;

  useEffect(() => {
    if (isReady && isAuthenticated) {
      router.replace(nextPath);
    }
  }, [isAuthenticated, isReady, nextPath, router]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = window.setTimeout(() => {
      setSecondsLeft((value) => value - 1);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [secondsLeft]);

  function updateDigit(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    setDigits((current) => {
      const next = [...current];
      next[index] = digit;
      return next;
    });
    setError("");
    if (digit && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array.from({ length: OTP_LENGTH }, (_, index) => pasted[index] ?? "");
    setDigits(next);
    setError("");
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputsRef.current[focusIndex]?.focus();
  }

  function handleResend() {
    if (secondsLeft > 0) return;
    setDigits(Array.from({ length: OTP_LENGTH }, () => ""));
    setError("");
    setSecondsLeft(RESEND_SECONDS);
    inputsRef.current[0]?.focus();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canVerify) {
      setError("Enter the 6-digit code to continue.");
      return;
    }
    if (!email) {
      router.push(signupHref(searchParams.get("next")));
      return;
    }
    signIn(email, true);
    router.push(nextPath);
  }

  return (
    <AuthShell
      kicker="Mayura Holidays"
      panelTitle="One last step before you travel"
      panelMessage="Confirm your email so we can keep your bookings and trip details waiting for you."
      imageSrc={panelImage.image}
      imageAlt={panelImage.imageAlt}
    >
      <h1 className="font-display text-4xl font-bold tracking-tight text-navy sm:text-[2.6rem]">
        Verify Your Email
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate">
        We sent a 6-digit code to{" "}
        <span className="font-semibold text-navy">
          {email || "your email address"}
        </span>
        . Enter it below to continue.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <span className="mb-2 block text-sm font-semibold text-navy">
            Verification code
          </span>
          <div className="flex justify-between gap-2">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(node) => {
                  inputsRef.current[index] = node;
                }}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
                maxLength={1}
                value={digit}
                onChange={(event) => updateDigit(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                onPaste={handlePaste}
                className="h-12 w-10 rounded-2xl border border-[#E4EAF2] bg-[#F7FAFE] text-center text-lg font-semibold text-navy outline-none transition-colors focus:border-blue sm:h-14 sm:w-12"
              />
            ))}
          </div>
          {error ? (
            <p className="mt-2 text-sm text-accent-ink" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={!canVerify}
          className="mt-2 w-full rounded-full bg-accent px-5 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-accent"
        >
          Verify
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate">
        Didn&apos;t receive the code?{" "}
        {secondsLeft > 0 ? (
          <span className="font-semibold text-navy">
            Resend Code in {secondsLeft}s
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="font-semibold text-navy hover:text-accent"
          >
            Resend Code
          </button>
        )}
      </p>

      <p className="mt-4 text-center text-sm text-slate">
        <Link
          href={signupHref(searchParams.get("next"))}
          className="font-semibold text-navy hover:text-accent"
        >
          Change email
        </Link>
      </p>
    </AuthShell>
  );
}
