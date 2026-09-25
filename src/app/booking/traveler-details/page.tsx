"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { loginHref } from "@/lib/auth/paths";
import { readBookingIntent } from "@/lib/booking/intent";
import type { BookingIntent } from "@/lib/booking/intent";

export default function TravelerDetailsPage() {
  const router = useRouter();
  const { isAuthenticated, isReady } = useAuth();
  const [intent, setIntent] = useState<BookingIntent | null>(null);

  useEffect(() => {
    if (!isReady) return;
    if (!isAuthenticated) {
      router.replace(loginHref("/booking/traveler-details"));
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
          Booking
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold text-navy">
          Traveller details
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate">
          This is the next step in the booking flow. Payment and backend
          confirmation will be added later.
        </p>

        {intent ? (
          <div className="mt-8 rounded-3xl border border-[#E4EAF2] bg-white p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-navy">
              {intent.packageName}
            </h2>
            <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-[10px] font-semibold tracking-[0.12em] text-[#93A4BE] uppercase">
                  Travel date
                </dt>
                <dd className="mt-1 font-semibold text-navy">
                  {intent.travelDate || "To be confirmed"}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold tracking-[0.12em] text-[#93A4BE] uppercase">
                  Travellers
                </dt>
                <dd className="mt-1 font-semibold text-navy">
                  {intent.travellers}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold tracking-[0.12em] text-[#93A4BE] uppercase">
                  Stay
                </dt>
                <dd className="mt-1 font-semibold text-navy">
                  {intent.accommodation || "To be confirmed"}
                </dd>
              </div>
            </dl>

            <form
              className="mt-8 space-y-4"
              onSubmit={(event) => event.preventDefault()}
            >
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-navy">
                  Lead traveller
                </span>
                <input
                  type="text"
                  name="leadName"
                  placeholder="Full name"
                  className="w-full rounded-2xl border border-[#E4EAF2] bg-[#F7FAFE] px-4 py-3.5 text-sm text-navy outline-none focus:border-blue"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-navy">
                  Mobile
                </span>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  className="w-full rounded-2xl border border-[#E4EAF2] bg-[#F7FAFE] px-4 py-3.5 text-sm text-navy outline-none focus:border-blue"
                />
              </label>
              <button
                type="submit"
                className="w-full rounded-full bg-accent px-5 py-3.5 text-sm font-bold text-white sm:w-auto"
              >
                Save and continue
              </button>
            </form>
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-[#E4EAF2] bg-white p-6">
            <p className="text-sm text-slate">
              No package is selected yet. Choose a tour to start booking.
            </p>
            <Link
              href="/packages"
              className="mt-5 inline-flex rounded-full bg-navy px-5 py-3 text-sm font-bold text-white"
            >
              View packages
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
