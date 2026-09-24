"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { readBookingIntent } from "@/lib/booking/intent";
import type { BookingIntent } from "@/lib/booking/intent";

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isReady, signOut } = useAuth();
  const [intent, setIntent] = useState<BookingIntent | null>(null);

  useEffect(() => {
    if (!isReady) return;
    if (!isAuthenticated) {
      router.replace("/login?next=/account");
      return;
    }
    setIntent(readBookingIntent());
  }, [isAuthenticated, isReady, router]);

  if (!isReady || !isAuthenticated) {
    return <main className="min-h-screen bg-paper" />;
  }

  return (
    <main className="min-h-screen bg-[#F7F9FC] pt-28 pb-16 sm:pt-32">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <p className="text-[11px] font-bold tracking-[0.18em] text-accent uppercase">
          My Account
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold text-navy">
          Welcome back
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate">
          Signed in as{" "}
          <span className="font-semibold text-navy">{user?.email}</span>.
          Account details and booking history will connect to the backend later.
        </p>

        {intent && (
          <div className="mt-8 rounded-3xl border border-[#E4EAF2] bg-white p-6">
            <p className="text-[10px] font-bold tracking-[0.16em] text-accent uppercase">
              Continue booking
            </p>
            <h2 className="mt-2 text-xl font-extrabold text-navy">
              {intent.packageName}
            </h2>
            <p className="mt-2 text-sm text-slate">
              {intent.travelDate || "Date to confirm"} · {intent.travellers}{" "}
              travellers
              {intent.accommodation ? ` · ${intent.accommodation}` : ""}
            </p>
            <Link
              href="/booking/traveler-details"
              className="mt-5 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-navy"
            >
              Continue to traveller details
            </Link>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/packages"
            className="inline-flex rounded-full bg-navy px-5 py-3 text-sm font-bold text-white"
          >
            Browse packages
          </Link>
          <button
            type="button"
            onClick={() => {
              signOut();
              router.push("/");
            }}
            className="inline-flex rounded-full border border-[#E4EAF2] bg-white px-5 py-3 text-sm font-bold text-navy"
          >
            Sign out
          </button>
        </div>
      </div>
    </main>
  );
}
