"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { loginHref } from "@/lib/auth/paths";
import { readBookingIntent } from "@/lib/booking/intent";
import type { BookingIntent } from "@/lib/booking/intent";

type Traveller = {
  fullName: string;
  age: string;
  gender: string;
};

export default function TravelerDetailsPage() {
  const router = useRouter();
  const { isAuthenticated, isReady } = useAuth();

  const [intent, setIntent] = useState<BookingIntent | null>(null);
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [travellers, setTravellers] = useState<Traveller[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isReady) return;

    if (!isAuthenticated) {
      router.replace(loginHref("/booking/traveler-details"));
      return;
    }

    const booking = readBookingIntent();
    setIntent(booking);

    if (booking) {
      const count = Math.max(Number(booking.travellers) || 1, 1);

      setTravellers(
        Array.from({ length: count }, () => ({
          fullName: "",
          age: "",
          gender: "",
        })),
      );
    }
  }, [isAuthenticated, isReady, router]);

  const travellerCount = travellers.length || 1;

  const formattedDate = useMemo(() => {
    if (!intent?.travelDate) return "To be confirmed";

    const date = new Date(`${intent.travelDate}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return intent.travelDate;
    }

    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  }, [intent?.travelDate]);

  function updateTraveller(
    index: number,
    field: keyof Traveller,
    value: string,
  ) {
    setTravellers((current) =>
      current.map((traveller, travellerIndex) =>
        travellerIndex === index
          ? { ...traveller, [field]: value }
          : traveller,
      ),
    );

    setError("");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!intent) return;

    if (!leadEmail.trim() || !leadPhone.trim()) {
      setError("Please enter your email address and mobile number.");
      return;
    }

    const missingTraveller = travellers.some(
      (traveller) =>
        !traveller.fullName.trim() ||
        !traveller.age.trim() ||
        !traveller.gender,
    );

    if (missingTraveller) {
      setError("Please complete the details for every traveller.");
      return;
    }

    router.push("/booking/payment");
  }

  if (!isReady || !isAuthenticated) {
    return <main className="min-h-screen bg-[#F7F9FC]" />;
  }

  if (!intent) {
    return (
      <main className="min-h-screen bg-[#F7F9FC] pt-28 pb-16 sm:pt-32">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <div className="rounded-3xl border border-[#E4EAF2] bg-white p-8 text-center">
            <p className="text-sm text-slate">
              No package is selected yet. Choose a tour to start booking.
            </p>

            <Link
              href="/packages"
              className="mt-5 inline-flex rounded-full bg-navy px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-accent"
            >
              View packages
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_12%_18%,rgba(54,113,202,0.08),transparent_28%),radial-gradient(circle_at_88%_72%,rgba(235,91,145,0.06),transparent_25%),#F7F9FC] pt-28 pb-16 sm:pt-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">

        {/* Header */}
        <div className="max-w-2xl">
          <p className="text-[11px] font-bold tracking-[0.18em] text-accent uppercase">
            Booking
          </p>

          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            Traveller details
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate">
            Tell us who is travelling so we can prepare your booking.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]"
        >
          {/* =========================================================
              LEFT — TRAVELLER FORM
          ========================================================= */}
          <div className="space-y-6">

            {/* Lead Contact */}
            <section className="rounded-3xl border border-[#DCE7F5] bg-white p-6 shadow-[0_16px_50px_-35px_rgba(35,92,160,0.35)] sm:p-8">
              <p className="text-[11px] font-bold tracking-[0.16em] text-accent uppercase">
                Contact details
              </p>

              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-navy">
                Lead traveller
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate">
                We'll use these details for booking updates and confirmations.
              </p>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">

                {/* Email */}
                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-navy">
                    Email address
                  </span>

                  <input
                    type="email"
                    value={leadEmail}
                    onChange={(event) => {
                      setLeadEmail(event.target.value);
                      setError("");
                    }}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-[#E4EAF2] bg-[#F7FAFE] px-4 py-3.5 text-sm text-navy outline-none transition-colors placeholder:text-[#93A4BE] focus:border-blue"
                  />
                </label>

                {/* Mobile */}
                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-navy">
                    Mobile number
                  </span>

                  <input
                    type="tel"
                    value={leadPhone}
                    onChange={(event) => {
                      setLeadPhone(event.target.value);
                      setError("");
                    }}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-2xl border border-[#E4EAF2] bg-[#F7FAFE] px-4 py-3.5 text-sm text-navy outline-none transition-colors placeholder:text-[#93A4BE] focus:border-blue"
                  />
                </label>

              </div>
            </section>

            {/* Travellers */}
            <section className="rounded-3xl border border-[#DCE7F5] bg-white p-6 shadow-[0_16px_50px_-35px_rgba(35,92,160,0.35)] sm:p-8">

              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold tracking-[0.16em] text-accent uppercase">
                    Travellers
                  </p>

                  <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-navy">
                    Who's travelling?
                  </h2>
                </div>

                <span className="rounded-full bg-[#EAF3FF] px-3 py-1.5 text-xs font-bold text-blue">
                  {travellerCount}{" "}
                  {travellerCount === 1 ? "Traveller" : "Travellers"}
                </span>
              </div>

              <div className="mt-7 space-y-6">

                {travellers.map((traveller, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-[#DCE8F7] bg-[#F5F9FF] p-5 sm:p-6"
                  >

                    {/* Traveller heading */}
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue to-accent text-xs font-bold text-white shadow-sm">
                        {index + 1}
                      </span>

                      <h3 className="text-base font-bold text-navy">
                        {index === 0
                          ? "Lead traveller"
                          : `Traveller ${index + 1}`}
                      </h3>
                    </div>

                    <div className="mt-5 grid gap-5 sm:grid-cols-2">

                      {/* Full Name */}
                      <label className="block sm:col-span-2">
                        <span className="mb-2 block text-sm font-semibold text-navy">
                          Full name
                        </span>

                        <input
                          type="text"
                          value={traveller.fullName}
                          onChange={(event) =>
                            updateTraveller(
                              index,
                              "fullName",
                              event.target.value,
                            )
                          }
                          placeholder="Full name"
                          className="w-full rounded-2xl border border-[#E4EAF2] bg-white px-4 py-3.5 text-sm text-navy outline-none transition-colors placeholder:text-[#93A4BE] focus:border-blue"
                        />
                      </label>

                      {/* Age */}
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-navy">
                          Age
                        </span>

                        <input
                          type="number"
                          min="1"
                          max="120"
                          value={traveller.age}
                          onChange={(event) =>
                            updateTraveller(
                              index,
                              "age",
                              event.target.value,
                            )
                          }
                          placeholder="Age"
                          className="w-full rounded-2xl border border-[#E4EAF2] bg-white px-4 py-3.5 text-sm text-navy outline-none transition-colors placeholder:text-[#93A4BE] focus:border-blue"
                        />
                      </label>

                      {/* Gender */}
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-navy">
                          Gender
                        </span>

                        <select
                          value={traveller.gender}
                          onChange={(event) =>
                            updateTraveller(
                              index,
                              "gender",
                              event.target.value,
                            )
                          }
                          className="w-full cursor-pointer rounded-2xl border border-[#E4EAF2] bg-white px-4 py-3.5 text-sm font-medium text-navy outline-none focus:border-blue"
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </label>

                    </div>
                  </div>
                ))}

              </div>
            </section>

            {/* Error */}
            {error ? (
              <p
                className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                role="alert"
              >
                {error}
              </p>
            ) : null}

          </div>

          {/* =========================================================
              RIGHT — MAYURA BOOKING SUMMARY
          ========================================================= */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative min-h-[560px] overflow-hidden rounded-[32px] bg-gradient-to-br from-[#06285F] via-[#0B4F9D] to-[#1676C8] p-7 text-white shadow-[0_30px_80px_-30px_rgba(7,53,112,0.55)] sm:p-8">

              {/* Pink glow */}
              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#F06B9A]/25 blur-3xl" />

              {/* Blue glow */}
              <div className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-[#5FB4FF]/20 blur-3xl" />

              {/* Decorative rings */}
              <div className="pointer-events-none absolute right-7 top-7 h-24 w-24 rounded-full border border-white/10" />

              <div className="pointer-events-none absolute right-12 top-12 h-14 w-14 rounded-full border border-white/10" />

              <div className="relative flex min-h-[500px] flex-col">

                {/* Header */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#F58BAF]" />

                    <p className="text-[10px] font-bold tracking-[0.2em] text-white/65 uppercase">
                      Your booking
                    </p>
                  </div>

                  <h2 className="mt-4 max-w-[280px] text-3xl font-extrabold leading-tight tracking-tight text-white">
                    {intent.packageName}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-white/65">
                    Your journey starts here. Review your trip details before
                    continuing.
                  </p>
                </div>

                {/* Booking Details */}
                <div className="mt-8 rounded-[24px] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-sm">

                  <div className="space-y-5">

                    {/* Travel Date */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <rect
                            x="3"
                            y="4"
                            width="18"
                            height="17"
                            rx="2"
                          />
                          <path d="M16 2v4M8 2v4M3 10h18" />
                        </svg>
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold tracking-[0.12em] text-white/45 uppercase">
                          Travel date
                        </p>

                        <p className="mt-1 text-sm font-semibold text-white">
                          {formattedDate}
                        </p>
                      </div>
                    </div>

                    {/* Travellers */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <circle cx="9" cy="8" r="3" />
                          <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                          <path d="M16 5.5a3 3 0 0 1 0 5.8M18 14c1.7.8 3 2.4 3 4.5" />
                        </svg>
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold tracking-[0.12em] text-white/45 uppercase">
                          Travellers
                        </p>

                        <p className="mt-1 text-sm font-semibold text-white">
                          {intent.travellers}{" "}
                          {intent.travellers === "1"
                            ? "Adult"
                            : "Adults"}
                        </p>
                      </div>
                    </div>

                    {/* Accommodation */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M3 21V9l9-6 9 6v12" />
                          <path d="M7 21v-6h10v6M9 11h6" />
                        </svg>
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold tracking-[0.12em] text-white/45 uppercase">
                          Accommodation
                        </p>

                        <p className="mt-1 text-sm font-semibold capitalize text-white">
                          {intent.accommodation || "To be confirmed"}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Price */}
                <div className="mt-7 flex items-end justify-between border-t border-white/10 pt-6">
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.15em] text-white/45 uppercase">
                      Package price
                    </p>

                    <p className="mt-1 text-2xl font-extrabold text-white">
                      To be confirmed
                    </p>
                  </div>

                  <div className="rounded-full bg-[#F58BAF]/15 px-3 py-1.5">
                    <span className="text-[10px] font-bold text-[#FFC2D3]">
                      MAYURA
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-auto pt-7">
            <button
  type="submit"
  className="group flex w-full items-center justify-center gap-3 rounded-full bg-linear-to-r from-blue to-navy px-5 py-4 text-sm font-extrabold text-white shadow-[0_12px_30px_-10px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-none hover:bg-accent"
>
  Continue to Payment

  <span className="transition-transform duration-300 group-hover:translate-x-1">
    →
  </span>
</button>

                  <p className="mt-4 text-center text-[11px] leading-5 text-white/50">
                    Your booking details will be reviewed before payment.
                  </p>
                </div>

              </div>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}