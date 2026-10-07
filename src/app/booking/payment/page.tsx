"use client";

import { packages } from "@/lib/data/packages";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  LockKeyhole,
} from "lucide-react";
import {
  readBookingIntent,
  BookingIntent,
} from "@/lib/booking/intent";

export default function PaymentPage() {
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

  return (
    <main className="min-h-screen bg-[#F7F9FC] text-navy">



{/* =====================================================
    CREATIVE HERO
===================================================== */}

<section className="relative overflow-hidden bg-white pt-28 pb-20 sm:pt-32 sm:pb-24">

  {/* =================================================
      BACKGROUND ATMOSPHERE
  ================================================= */}

  <div className="pointer-events-none absolute inset-0">

    {/* soft blue glow */}
    <div className="absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-blue-50/80 blur-3xl" />

    {/* soft pink glow */}
    <div className="absolute -left-40 bottom-[-14rem] h-[30rem] w-[30rem] rounded-full bg-pink-50/60 blur-3xl" />

    {/* fine editorial grid */}
    <div
      className="absolute inset-0 opacity-[0.025]"
      style={{
        backgroundImage:
          "linear-gradient(#0B294B 1px, transparent 1px), linear-gradient(90deg, #0B294B 1px, transparent 1px)",
        backgroundSize: "70px 70px",
      }}
    />

  </div>


  {/* =================================================
      OVERSIZED STEP NUMBER
  ================================================= */}

  <div className="pointer-events-none absolute right-[-20px] top-20 hidden select-none lg:block">

    <span className="text-[260px] font-black leading-none tracking-[-0.08em] text-navy/[0.025]">
      03
    </span>

  </div>


  <div className="relative mx-auto max-w-7xl px-5 sm:px-8">

    {/* =================================================
        BACK
    ================================================= */}

    <button
      type="button"
      onClick={() => router.back()}
      className="group mb-16 inline-flex items-center gap-2 text-sm font-semibold text-slate transition hover:text-navy"
    >

      <ArrowLeft
        size={16}
        className="transition-transform duration-300 group-hover:-translate-x-1"
      />

      Back to Traveller Details

    </button>


    {/* =================================================
        MAIN HERO
    ================================================= */}

    <div className="relative grid items-center gap-14 lg:grid-cols-[1fr_0.75fr]">


      {/* =================================================
          LEFT — TITLE
      ================================================= */}

      <div className="relative z-10 max-w-3xl">

        {/* label */}

        <div className="mb-6 flex items-center gap-3">

          <span className="h-px w-12 bg-accent" />

          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
            Final step · 03
          </p>

        </div>


        {/* title */}

        <h1 className="text-5xl font-extrabold leading-[0.98] tracking-[-0.055em] text-navy sm:text-6xl lg:text-[76px]">

          Your journey

          <br />

          <span className="text-blue">
            is almost ready.
          </span>

        </h1>


        {/* description */}

        <p className="mt-8 max-w-xl text-sm leading-7 text-slate sm:text-base">
          Take one final look at your travel details before you
          complete your payment and set your journey in motion.
        </p>


        {/* progress */}

        <div className="mt-10 flex items-center gap-3">

          <div className="flex items-center gap-2">

            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-navy text-[9px] font-bold text-white">
              ✓
            </span>

            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate">
              Package
            </span>

          </div>


          <span className="h-px w-7 bg-slate-200 sm:w-10" />


          <div className="flex items-center gap-2">

            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-navy text-[9px] font-bold text-white">
              ✓
            </span>

            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate">
              Travellers
            </span>

          </div>


          <span className="h-px w-7 bg-accent/40 sm:w-10" />


          <div className="flex items-center gap-2">

            <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-accent">

              <span className="h-1.5 w-1.5 rounded-full bg-white" />

              <span className="absolute inset-[-4px] rounded-full border border-accent/20" />

            </span>

            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-navy">
              Payment
            </span>

          </div>

        </div>

      </div>


      {/* =================================================
          RIGHT — JOURNEY TICKET
      ================================================= */}

      <div className="relative">

        {/* floating label */}

        <div className="absolute -right-1 -top-8 z-20 hidden rounded-full border border-blue-100 bg-white px-4 py-2 shadow-sm sm:block">

          <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue">
            Your reservation
          </span>

        </div>


        {/* ticket */}

        <div className="relative overflow-hidden rounded-[2rem] bg-[#071C35] p-7 text-white shadow-[0_30px_80px_-35px_rgba(7,28,53,0.65)] sm:p-9">


          {/* decorative route */}

          <svg
            viewBox="0 0 500 170"
            fill="none"
            className="pointer-events-none absolute right-0 top-0 h-full w-full opacity-40"
            preserveAspectRatio="none"
          >

            <path
              d="M-30 135 C80 15 145 35 220 85 S370 160 540 25"
              stroke="white"
              strokeOpacity="0.08"
              strokeWidth="1.5"
            />

            <path
              d="M-30 135 C80 15 145 35 220 85 S370 160 540 25"
              stroke="white"
              strokeOpacity="0.15"
              strokeWidth="1"
              strokeDasharray="4 8"
            />

            <circle
              cx="220"
              cy="85"
              r="5"
              fill="#E84B8A"
              fillOpacity="0.9"
            />

            <circle
              cx="220"
              cy="85"
              r="11"
              stroke="#E84B8A"
              strokeOpacity="0.12"
            />

          </svg>


          {/* subtle circle */}

          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/[0.06]" />


          <div className="relative">


            {/* top */}

            <div className="flex items-start justify-between gap-5">

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-200">
                  Going to
                </p>

                <h2 className="mt-2 max-w-[260px] text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {intent.packageName}
                </h2>

              </div>


              <div className="text-right">

                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-200">
                  Step
                </p>

                <p className="mt-1 text-2xl font-black text-white/90">
                  03
                </p>

              </div>

            </div>


            {/* route */}

            <div className="relative my-9 h-8">

              <div className="absolute left-0 right-0 top-1/2 h-px bg-white/10" />

              <div className="absolute left-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-white" />

              <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">

                <span className="h-3 w-3 rounded-full bg-accent shadow-[0_0_0_6px_rgba(232,75,138,0.12)]" />

              </div>

              <div className="absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-white" />

            </div>


            {/* details */}

            <div className="grid grid-cols-2 gap-x-8 gap-y-7">

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-200">
                  Date
                </p>

                <p className="mt-2 text-sm font-semibold">
                  {formattedDate}
                </p>

              </div>


              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-200">
                  Travellers
                </p>

                <p className="mt-2 text-sm font-semibold">
                  {travellerCount}{" "}
                  {travellerCount === 1
                    ? "Adult"
                    : "Adults"}
                </p>

              </div>


              <div className="col-span-2 border-t border-white/10 pt-5">

                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-200">
                  Accommodation
                </p>

                <p className="mt-2 text-sm font-semibold capitalize">
                  {intent.accommodation ||
                    "To be confirmed"}
                </p>

              </div>

            </div>


            {/* bottom */}

            <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">

              <p className="text-[9px] uppercase tracking-[0.15em] text-blue-200">
                Mayura Holidays
              </p>

              <p className="text-[9px] font-semibold text-white/40">
                Travel with confidence
              </p>

            </div>

          </div>

        </div>


        {/* little floating accent */}

        <div className="absolute -bottom-4 left-8 flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white shadow-lg">

          <ArrowRight size={15} />

        </div>

      </div>

    </div>


    {/* =================================================
        BOTTOM STATEMENT
    ================================================= */}

    <div className="mt-16 flex items-center gap-4 border-t border-slate-100 pt-6">

      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">

        <LockKeyhole
          size={14}
          className="text-blue"
        />

      </div>

      <p className="text-xs leading-5 text-slate">
        Your booking information is protected and will only be
        used to process your journey.
      </p>

    </div>

  </div>

</section>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <section className="bg-[#F7F9FC] py-14 sm:py-20">

        <div className="mx-auto max-w-7xl px-5 sm:px-8">


          {/* =================================================
              JOURNEY
          ================================================= */}

          <section className="mb-20">

            <div className="mb-8">

              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                Your trip
              </p>

              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
                Journey summary
              </h2>

            </div>


            {/* ITINERARY STYLE PANEL */}

            <div className="group relative overflow-hidden rounded-[2rem] bg-[#071C35] p-7 text-white shadow-[0_25px_70px_-35px_rgba(7,28,53,0.55)] sm:p-10 lg:p-12">

              {/* Decorative route lines */}

              <div className="pointer-events-none absolute inset-0 opacity-40">

                <svg
                  className="absolute right-0 top-0 h-full w-[55%]"
                  viewBox="0 0 600 400"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M620 40C500 90 470 20 380 90C290 160 330 220 210 230C110 240 120 330 -20 360"
                    stroke="white"
                    strokeOpacity="0.08"
                    strokeWidth="1"
                  />

                  <path
                    d="M650 100C520 145 500 80 410 150C320 220 350 270 250 280C150 290 140 350 20 390"
                    stroke="white"
                    strokeOpacity="0.05"
                    strokeWidth="1"
                  />
                </svg>

              </div>


              {/* decorative circles */}

              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/[0.07]" />

              <div className="pointer-events-none absolute -right-8 top-12 h-28 w-28 rounded-full border border-white/[0.05]" />

              <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-blue-500/[0.08] blur-3xl" />


              <div className="relative">

                {/* top */}

                <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

                  <div>

                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200">
                      Selected package
                    </p>

                    <h3 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
                      {intent.packageName}
                    </h3>

                  </div>


                  {pricePerPerson !== null && (
                    <div className="lg:text-right">

                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-200">
                        Starting from
                      </p>

                      <p className="mt-2 text-2xl font-extrabold">
                        ₹{pricePerPerson.toLocaleString("en-IN")}
                      </p>

                      <p className="mt-1 text-xs text-blue-200">
                        per person
                      </p>

                    </div>
                  )}

                </div>


                {/* route */}

                <div className="relative my-10">

                  <div className="h-px bg-white/10" />

                  <div className="absolute left-[16%] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_5px_rgba(255,255,255,0.06)]" />

                  <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_0_5px_rgba(255,255,255,0.06)]" />

                  <div className="absolute right-[16%] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_5px_rgba(255,255,255,0.06)]" />

                </div>


                {/* details */}

                <div className="grid gap-8 sm:grid-cols-3">

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-200">
                      Travel date
                    </p>

                    <p className="mt-2 text-sm font-semibold">
                      {formattedDate}
                    </p>
                  </div>


                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-200">
                      Travellers
                    </p>

                    <p className="mt-2 text-sm font-semibold">
                      {travellerCount}{" "}
                      {travellerCount === 1 ? "Adult" : "Adults"}
                    </p>
                  </div>


                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-200">
                      Accommodation
                    </p>

                    <p className="mt-2 text-sm font-semibold capitalize">
                      {intent.accommodation || "To be confirmed"}
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </section>


          {/* =================================================
              BOOKING INFORMATION
          ================================================= */}

          <section className="mb-20">

            <div className="mb-8">

              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                Traveller information
              </p>

              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
                Booking details
              </h2>

            </div>


            <div className="rounded-[2rem] bg-white px-6 py-8 shadow-[0_18px_60px_-45px_rgba(8,33,76,0.35)] sm:px-10 sm:py-10">


              {/* CONTACT */}

              <div>

                <div className="flex items-center gap-3">

                  <span className="h-1 w-8 rounded-full bg-accent" />

                  <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-accent">
                    Contact
                  </p>

                </div>

                <div className="mt-6 grid gap-8 border-b border-slate-100 pb-9 sm:grid-cols-2">

                  <div>

                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate">
                      Email
                    </p>

                    <p className="mt-2 break-all text-sm font-semibold text-navy">
                      {intent.leadEmail || "Not provided"}
                    </p>

                  </div>


                  <div>

                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate">
                      Mobile
                    </p>

                    <p className="mt-2 text-sm font-semibold text-navy">
                      {intent.leadPhone || "Not provided"}
                    </p>

                  </div>

                </div>

              </div>


              {/* TRAVELLERS */}

              <div className="pt-9">

                <div className="flex items-center gap-3">

                  <span className="h-1 w-8 rounded-full bg-blue" />

                  <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-blue">
                    Travellers
                  </p>

                </div>


                <div className="mt-6">

                  {intent.travellerDetails?.map(
                    (traveller, index) => (
                      <div
                        key={`${traveller.fullName}-${index}`}
                        className="group border-b border-slate-100 py-5 first:pt-0 last:border-b-0 last:pb-0"
                      >

                        <div className="grid gap-5 sm:grid-cols-[70px_1.5fr_0.5fr_0.7fr] sm:items-center">

                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
                              {String(index + 1).padStart(2, "0")}
                            </p>
                          </div>


                          <div>

                            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate">
                              Full name
                            </p>

                            <p className="mt-1.5 text-sm font-bold text-navy">
                              {traveller.fullName}
                            </p>

                          </div>


                          <div>

                            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate">
                              Age
                            </p>

                            <p className="mt-1.5 text-sm font-semibold text-navy">
                              {traveller.age}
                            </p>

                          </div>


                          <div>

                            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate">
                              Gender
                            </p>

                            <p className="mt-1.5 text-sm font-semibold capitalize text-navy">
                              {traveller.gender || "—"}
                            </p>

                          </div>

                        </div>

                      </div>
                    )
                  )}

                </div>

              </div>

            </div>

          </section>


          {/* =================================================
              PAYMENT
          ================================================= */}

          <section>

            <div className="mb-8">

              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                Final step
              </p>

              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
                Complete your payment
              </h2>

            </div>


            <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-stretch">


              {/* PAYMENT METHOD */}

              <div className="relative overflow-hidden rounded-[2rem] bg-white p-7 shadow-[0_18px_60px_-45px_rgba(8,33,76,0.35)] sm:p-10">

                <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-50 blur-3xl" />

                <div className="relative">

                  <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-accent">
                    Payment method
                  </p>

                  <h3 className="mt-3 text-2xl font-extrabold text-navy">
                    Online payment
                  </h3>

                  <p className="mt-3 max-w-xl text-sm leading-7 text-slate">
                    Pay securely using our online payment gateway.
                    Your payment details are handled securely by
                    the payment provider.
                  </p>


                  {/* selected method */}

                  <div className="mt-8 rounded-[1.5rem] border-2 border-navy bg-[#F7FAFE] p-5">

                    <div className="flex items-center gap-4">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy text-white">

                        <LockKeyhole size={18} />

                      </div>

                      <div>

                        <p className="text-sm font-bold text-navy">
                          Secure online payment
                        </p>

                        <p className="mt-1 text-xs text-slate">
                          Cards · UPI · Net Banking
                        </p>

                      </div>

                      <div className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-navy text-white">

                        <span className="h-2 w-2 rounded-full bg-white" />

                      </div>

                    </div>

                  </div>


                  {/* security */}

                  <div className="mt-8 flex gap-3 border-t border-slate-100 pt-6">

                    <ShieldCheck
                      size={18}
                      className="mt-0.5 shrink-0 text-blue"
                    />

                    <p className="text-xs leading-6 text-slate">
                      Your payment is processed through a secure
                      payment gateway. We do not store your card or
                      banking information.
                    </p>

                  </div>

                </div>

              </div>


              {/* PRICE */}

              <aside className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#071C35] via-[#0B294B] to-[#104A80] p-7 text-white shadow-[0_25px_70px_-35px_rgba(7,28,53,0.65)] sm:p-9">

                {/* decoration */}

                <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full border border-white/[0.07]" />

                <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-blue-400/10 blur-3xl" />


                <div className="relative">

                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200">
                    Your total
                  </p>

                  <p className="mt-4 text-sm text-blue-100">
                    {travellerCount}{" "}
                    {travellerCount === 1
                      ? "traveller"
                      : "travellers"}
                  </p>


                  <div className="mt-3">

                    <span className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                      {totalAmount !== null
                        ? `₹${totalAmount.toLocaleString("en-IN")}`
                        : "On request"}
                    </span>

                  </div>


                  {pricePerPerson !== null && (
                    <p className="mt-2 text-xs text-blue-200">
                      ₹{pricePerPerson.toLocaleString("en-IN")} per
                      person
                    </p>
                  )}


                  <div className="my-8 h-px bg-white/10" />


                  <div className="space-y-3 text-sm">

                    <div className="flex justify-between gap-4">

                      <span className="text-blue-100">
                        Package
                      </span>

                      <span className="max-w-48 text-right font-semibold">
                        {intent.packageName}
                      </span>

                    </div>


                    <div className="flex justify-between gap-4">

                      <span className="text-blue-100">
                        Travellers
                      </span>

                      <span className="font-semibold">
                        {travellerCount}
                      </span>

                    </div>

                  </div>


                  <button
                    type="button"
                    onClick={() =>
                      router.push("/booking/confirmation")
                    }
                    className="group mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-bold text-navy transition-all duration-300 hover:-translate-y-1 hover:bg-accent hover:text-white hover:shadow-xl"
                  >

                    Proceed to Payment

                    <ArrowRight
                      size={17}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />

                  </button>


                  <p className="mt-5 text-center text-[10px] leading-5 text-blue-200">
                    Secure checkout · Your payment details remain
                    protected
                  </p>

                </div>

              </aside>

            </div>

          </section>

        </div>

      </section>

    </main>
  );
}