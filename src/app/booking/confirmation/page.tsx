"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Download,
  Home,
  Mail,
  Phone,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  readBookingIntent,
  BookingIntent,
} from "@/lib/booking/intent";
import { packages } from "@/lib/data/packages";

export default function BookingConfirmationPage() {
  const router = useRouter();

  const [intent, setIntent] = useState<BookingIntent | null>(null);

  useEffect(() => {
    const booking = readBookingIntent();

    if (!booking) {
      router.replace("/packages");
      return;
    }

    setIntent(booking);
  }, [router]);

  if (!intent) {
    return null;
  }

  const travellerCount = Number(intent.travellers) || 1;

  const packageData = packages.find(
    (pkg) => pkg.slug === intent.slug
  );

  const pricePerPerson = packageData?.priceValue ?? null;

  const totalAmount =
    pricePerPerson !== null
      ? pricePerPerson * travellerCount
      : null;

  const formattedDate = intent.travelDate
    ? new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(`${intent.travelDate}T00:00:00`))
    : "Not selected";

  const bookingReference = `MAY-${intent.slug
    .slice(0, 4)
    .toUpperCase()}-${Date.now().toString().slice(-6)}`;

  return (
    <main className="min-h-screen bg-[#F5F8FC]">
      {/* =========================
          CONFIRMATION HERO
      ========================== */}
      <section className="relative overflow-hidden bg-linear-to-br from-navy via-[#0D4C91] to-blue px-5 pb-28 pt-24 sm:px-8 sm:pt-28">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />

        <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Green Confirmation Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#22C55E] text-white shadow-[0_15px_45px_-12px_rgba(34,197,94,0.65)]">
            <Check size={42} strokeWidth={3} />
          </div>

          <p className="mt-7 text-[10px] font-bold tracking-[0.22em] text-white/65 uppercase">
            Booking Confirmed
          </p>

          <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.04em] text-white sm:text-5xl">
            Your trip is all set!
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
            Thank you for booking with Mayura. Your booking has
            been successfully confirmed.
          </p>
        </div>
      </section>

      {/* =========================
          MAIN CONTENT
      ========================== */}
      <section className="relative -mt-14 pb-16 sm:pb-20">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          {/* =========================
              BOOKING REFERENCE
          ========================== */}
          <section className="rounded-3xl border border-[#DCE7F4] bg-white px-6 py-6 text-center shadow-[0_24px_70px_-35px_rgba(8,33,76,0.4)] sm:px-8 sm:py-7">
            <p className="text-[10px] font-bold tracking-[0.18em] text-[#8B9BB2] uppercase">
              Booking Reference
            </p>

            <p className="mt-2 text-2xl font-extrabold tracking-[0.08em] text-navy sm:text-3xl">
              {bookingReference}
            </p>

            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#ECFDF3] px-3.5 py-1.5">
              <span className="h-2 w-2 rounded-full bg-[#22C55E]" />

              <span className="text-[11px] font-bold text-[#15803D]">
                Confirmed
              </span>
            </div>
          </section>

          {/* =========================
              TRIP DETAILS
          ========================== */}
          <section className="mt-6 overflow-hidden rounded-3xl border border-[#DCE7F4] bg-white shadow-[0_18px_50px_-35px_rgba(8,33,76,0.3)]">
            <div className="border-b border-[#E5EBF3] px-6 py-6 sm:px-8">
              <p className="text-[10px] font-bold tracking-[0.18em] text-accent uppercase">
                Your Trip
              </p>

              <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-navy">
                {intent.packageName}
              </h2>
            </div>

            <div className="grid divide-y divide-[#E5EBF3] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {/* Travel Date */}
              <div className="flex items-center gap-4 px-6 py-5 sm:px-7">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue/10 text-blue">
                  <CalendarDays size={20} />
                </div>

                <div>
                  <p className="text-[10px] font-semibold tracking-[0.12em] text-[#8B9BB2] uppercase">
                    Travel Date
                  </p>

                  <p className="mt-1 text-sm font-bold text-navy">
                    {formattedDate}
                  </p>
                </div>
              </div>

              {/* Travellers */}
              <div className="flex items-center gap-4 px-6 py-5 sm:px-7">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue/10 text-blue">
                  <Users size={20} />
                </div>

                <div>
                  <p className="text-[10px] font-semibold tracking-[0.12em] text-[#8B9BB2] uppercase">
                    Travellers
                  </p>

                  <p className="mt-1 text-sm font-bold text-navy">
                    {travellerCount}{" "}
                    {travellerCount === 1 ? "Adult" : "Adults"}
                  </p>
                </div>
              </div>

              {/* Accommodation */}
              <div className="flex items-center gap-4 px-6 py-5 sm:px-7">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <ShieldCheck size={20} />
                </div>

                <div>
                  <p className="text-[10px] font-semibold tracking-[0.12em] text-[#8B9BB2] uppercase">
                    Accommodation
                  </p>

                  <p className="mt-1 text-sm font-bold capitalize text-navy">
                    {intent.accommodation || "To be confirmed"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* =========================
              TRAVELLER INFORMATION
          ========================== */}
          <section className="mt-6 rounded-3xl border border-[#DCE7F4] bg-white px-6 py-7 shadow-[0_18px_50px_-35px_rgba(8,33,76,0.3)] sm:px-8">
            <div className="flex items-center gap-3">
              <div className="h-1 w-8 rounded-full bg-accent" />

              <p className="text-[10px] font-bold tracking-[0.18em] text-accent uppercase">
                Lead Traveller
              </p>
            </div>

            <h2 className="mt-1.5 text-2xl font-extrabold text-navy">
              Traveller Information
            </h2>

            {/* Contact Information */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-2xl bg-[#F7FAFE] px-4 py-3.5 ring-1 ring-[#E2EAF4]">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue/10 text-blue">
                  <Mail size={17} />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-semibold tracking-[0.1em] text-[#8B9BB2] uppercase">
                    Email
                  </p>

                  <p className="mt-0.5 break-all text-sm font-semibold text-navy">
                    {intent.leadEmail || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-[#F7FAFE] px-4 py-3.5 ring-1 ring-[#E2EAF4]">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue/10 text-blue">
                  <Phone size={17} />
                </div>

                <div>
                  <p className="text-[9px] font-semibold tracking-[0.1em] text-[#8B9BB2] uppercase">
                    Mobile
                  </p>

                  <p className="mt-0.5 text-sm font-semibold text-navy">
                    {intent.leadPhone || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Traveller Details */}
            {intent.travellerDetails?.length ? (
              <div className="mt-7 border-t border-[#E5EBF3] pt-6">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[10px] font-bold tracking-[0.16em] text-blue uppercase">
                    Travellers
                  </p>

                  <p className="text-xs font-semibold text-slate">
                    {intent.travellerDetails.length}{" "}
                    {intent.travellerDetails.length === 1
                      ? "Traveller"
                      : "Travellers"}
                  </p>
                </div>

                <div className="mt-4 space-y-2.5">
                  {intent.travellerDetails.map(
                    (traveller, index) => (
                      <div
                        key={`${traveller.fullName}-${index}`}
                        className="flex flex-col gap-3 rounded-2xl bg-[#F7FAFE] px-4 py-3.5 ring-1 ring-[#E2EAF4] sm:flex-row sm:items-center sm:justify-between"
                      >
                        {/* Name */}
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue text-[11px] font-bold text-white">
                            {index + 1}
                          </span>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-navy">
                              {traveller.fullName}
                            </p>

                            <p className="mt-0.5 text-[11px] text-slate">
                              Traveller {index + 1}
                            </p>
                          </div>
                        </div>

                        {/* Age + Gender */}
                        <div className="flex items-center gap-2 pl-12 sm:pl-0">
                          <span className="rounded-full bg-[#EEF4FB] px-3 py-1.5 text-[10px] font-semibold text-slate">
                            Age {traveller.age}
                          </span>

                          <span className="rounded-full bg-accent/10 px-3 py-1.5 text-[10px] font-semibold capitalize text-accent">
                            {traveller.gender || "Not specified"}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            ) : null}
          </section>

          {/* =========================
              BOTTOM: NEXT STEPS + PAYMENT
          ========================== */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            {/* What's Next */}
            <section className="rounded-3xl border border-blue/10 bg-[#F1F6FC] px-6 py-7 sm:px-8">
              <p className="text-[10px] font-bold tracking-[0.18em] text-blue uppercase">
                What Happens Next
              </p>

              <h2 className="mt-2 text-xl font-extrabold text-navy">
                Your travel documents
              </h2>

              <p className="mt-2 max-w-lg text-sm leading-6 text-slate">
                Your booking confirmation and e-ticket will be
                sent to your registered email once the booking
                system is connected.
              </p>

              <div className="mt-5 flex items-start gap-3 rounded-2xl bg-white px-4 py-3.5 ring-1 ring-blue/10">
                <Mail
                  size={17}
                  className="mt-0.5 shrink-0 text-blue"
                />

                <p className="text-xs leading-5 text-slate">
                  Keep your booking reference handy for any future
                  enquiries or support.
                </p>
              </div>
            </section>

            {/* Payment Summary */}
            <section className="overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_-30px_rgba(8,33,76,0.4)] ring-1 ring-[#DCE7F4]">
              <div className="bg-linear-to-br from-navy to-[#0C559F] px-6 py-5 text-white">
                <p className="text-[10px] font-bold tracking-[0.18em] text-white/65 uppercase">
                  Payment
                </p>

                <h2 className="mt-1.5 text-xl font-extrabold">
                  Payment Summary
                </h2>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate">
                      Price per person
                    </span>

                    <span className="text-sm font-bold text-navy">
                      {pricePerPerson !== null
                        ? `₹${pricePerPerson.toLocaleString(
                            "en-IN"
                          )}`
                        : "On request"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate">
                      Travellers
                    </span>

                    <span className="text-sm font-bold text-navy">
                      {travellerCount}
                    </span>
                  </div>

                  <div className="border-t border-[#E5EBF3] pt-5">
                    <p className="text-[9px] font-semibold tracking-[0.12em] text-[#8B9BB2] uppercase">
                      Total Paid
                    </p>

                    <p className="mt-1 text-3xl font-extrabold text-blue">
                      {totalAmount !== null
                        ? `₹${totalAmount.toLocaleString(
                            "en-IN"
                          )}`
                        : "On request"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 rounded-2xl bg-[#ECFDF3] px-4 py-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#22C55E] text-white">
                    <Check size={14} strokeWidth={3} />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-[#15803D]">
                      Payment Successful
                    </p>

                    <p className="mt-0.5 text-[10px] text-[#4D7C5B]">
                      Your payment has been recorded.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* =========================
              ACTIONS
          ========================== */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              disabled
              className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-[#CBD4E1] px-7 py-3.5 text-sm font-bold text-white sm:w-auto"
            >
              <Download size={17} />
              Download E-ticket
            </button>

            <button
              type="button"
              onClick={() => router.push("/account")}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-blue to-navy px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_-10px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-none hover:bg-accent sm:w-auto"
            >
              View My Booking

              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </button>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-navy ring-1 ring-[#DCE7F4] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent hover:text-white sm:w-auto"
            >
              <Home size={17} />
              Back to Home
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}