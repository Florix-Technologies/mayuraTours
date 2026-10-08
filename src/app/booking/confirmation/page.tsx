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
  MapPin,
  Navigation,
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
  const [activeStep, setActiveStep] = useState(0);

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

  const journeySteps = [
    {
      number: "01",
      label: "Confirmed",
      title: "Your booking is recorded",
      description:
        "Your reservation request and travel details have been successfully received by Mayura Holidays.",
    },
    {
      number: "02",
      label: "Connect",
      title: "Our team will contact you",
      description:
        "A Mayura Holidays representative will get in touch with you to confirm your trip and discuss the next details.",
    },
    {
      number: "03",
      label: "Prepare",
      title: "Receive your travel details",
      description:
        "Final trip information, timings and other important details will be shared with you before departure.",
    },
    {
      number: "04",
      label: "Journey",
      title: "Travel with Mayura",
      description:
        "All that's left is to enjoy the journey and make memories along the way.",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* =========================================================
          HERO — UNCHANGED
      ========================================================== */}
      <section className="relative isolate min-h-[470px] overflow-hidden sm:min-h-[540px]">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/video/confirmationhero.mp4"
          autoPlay
          muted
          loop
          playsInline
        />

        <div className="absolute inset-0 bg-[#071C35]/55" />

        <div className="absolute inset-0 bg-gradient-to-b from-[#071C35]/25 via-transparent to-[#071C35]/65" />

        <div className="relative z-10 mx-auto flex min-h-[470px] max-w-6xl items-center justify-center px-5 py-24 text-center sm:min-h-[540px] sm:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 flex items-center justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />

                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/90">
                  Reservation Secured
                </span>
              </div>
            </div>

            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.38em] text-white/70">
              Mayura Holidays
            </p>

            <h1 className="text-4xl font-black tracking-[-0.03em] text-white sm:text-6xl">
              Booking Confirmed
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
              Your trip is all set. We're looking forward to
              making your journey with Mayura memorable.
            </p>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white via-white/45 to-transparent" />
      </section>

      {/* =========================================================
          BOOKING REFERENCE — UNCHANGED
      ========================================================== */}
      <section className="relative z-20 -mt-24 w-full px-5 sm:-mt-28 sm:px-8">
        <div className="relative mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-[#D9E2EA] bg-white shadow-[0_30px_80px_-35px_rgba(8,33,76,0.42)]">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#B8C9D8] to-transparent" />

            <div className="relative flex flex-col sm:flex-row">
              <div className="flex-1 px-6 py-7 sm:px-9 sm:py-8">
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-600">
                    Confirmed
                  </span>
                </div>

                <div className="mt-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8291A3]">
                    Booking Reference
                  </p>

                  <p className="mt-1 text-2xl font-black tracking-[0.12em] text-[#08214C] sm:text-3xl">
                    {bookingReference}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-2 text-sm text-[#607188]">
                  <span className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-blue" />
                    {formattedDate}
                  </span>

                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue" />
                    {travellerCount} Traveller
                    {travellerCount !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <div className="relative hidden w-px sm:block">
                <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-[#D2DDE7]" />

                <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-white" />

                <span className="absolute -bottom-3 -left-3 h-6 w-6 rounded-full bg-white" />
              </div>

              <div className="mx-6 border-t border-dashed border-[#D2DDE7] sm:hidden" />

              <div className="flex min-h-[120px] w-full items-center justify-center px-6 py-6 sm:w-[195px] sm:px-5">
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A98A8]">
                    Mayura Holidays
                  </p>

                  <p className="mt-2 text-xs font-medium leading-relaxed text-[#68798C]">
                    Your journey is
                    <br />
                    officially reserved
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          MAIN CONTENT
      ========================================================== */}
      <section className="relative overflow-hidden bg-[#F7F9FC]">

        {/* =====================================================
            CONTACT-PAGE STYLE GRID + WAVE
        ====================================================== */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "linear-gradient(to_right,#E9EEF4_1px,transparent_1px),linear-gradient(to_bottom,#E9EEF4_1px,transparent_1px)",
              backgroundSize: "72px 72px",
            }}
          />

          <svg
            className="absolute left-0 top-0 h-[420px] w-full opacity-50"
            viewBox="0 0 1200 420"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M-80 270C100 80 250 70 410 190C550 295 650 300 795 175C930 60 1070 65 1280 205"
              stroke="currentColor"
              className="text-blue"
              strokeWidth="1"
              strokeDasharray="6 10"
            />

            <circle
              cx="410"
              cy="190"
              r="4"
              className="fill-blue"
            />

            <circle
              cx="795"
              cy="175"
              r="4"
              className="fill-accent"
            />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-20 lg:px-12">

          {/* =====================================================
              INTRO
          ====================================================== */}
          <section className="mx-auto max-w-6xl">
            <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">

              <div>
                <div className="mb-6 flex items-center gap-3">
                  <span className="h-px w-8 bg-accent sm:w-10" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent sm:text-[11px] sm:tracking-[0.24em]">
                    Your Mayura Journey
                  </span>
                </div>

                <h2 className="max-w-4xl text-[clamp(42px,7vw,78px)] font-extrabold leading-[0.92] tracking-[-0.055em] text-navy">
                  One step closer
                  <br />
                  <span className="text-blue">
                    to somewhere new.
                  </span>
                </h2>
              </div>

              <div className="max-w-md lg:pb-2">
                <div className="mb-5 flex items-center gap-4">
                  <span className="h-px flex-1 bg-[#C9D3E0]" />

                  <span className="text-2xl text-accent">
                    ↗
                  </span>
                </div>

                <p className="text-base leading-7 text-slate sm:text-lg sm:leading-8">
                  Your reservation has been recorded. Here&apos;s
                  everything you need to keep your journey moving.
                </p>

                <p className="mt-4 text-sm leading-6 text-slate/75">
                  Keep your booking reference handy. Our team will
                  be in touch with you regarding the next steps.
                </p>
              </div>
            </div>
          </section>

          {/* =====================================================
              JOURNEY DETAILS
          ====================================================== */}
          <section className="mx-auto mt-16 max-w-6xl">

            <div className="mb-7 flex items-end justify-between gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                  Your Trip
                </p>

                <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
                  Journey details
                </h3>
              </div>

              <div className="hidden items-center gap-2 sm:flex">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate">
                  Confirmed
                </span>
              </div>
            </div>

            <div className="overflow-hidden rounded-[24px] border border-[#DDE5EF] bg-white shadow-[0_25px_80px_rgba(20,40,70,0.08)] sm:rounded-[28px]">

              <div className="grid sm:grid-cols-2 lg:grid-cols-4">

                {/* Destination */}
                <div className="border-b border-[#E5EAF0] p-6 sm:border-r lg:border-b-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue/10">
                    <MapPin className="h-4 w-4 text-blue" />
                  </div>

                  <p className="mt-6 text-[9px] font-bold uppercase tracking-[0.18em] text-slate">
                    Destination
                  </p>

                  <p className="mt-2 text-lg font-extrabold leading-snug text-navy">
                    {intent.packageName}
                  </p>
                </div>

                {/* Date */}
                <div className="border-b border-[#E5EAF0] p-6 lg:border-r lg:border-b-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue/10">
                    <CalendarDays className="h-4 w-4 text-blue" />
                  </div>

                  <p className="mt-6 text-[9px] font-bold uppercase tracking-[0.18em] text-slate">
                    Travel Date
                  </p>

                  <p className="mt-2 text-lg font-extrabold text-navy">
                    {formattedDate}
                  </p>
                </div>

                {/* Travellers */}
                <div className="border-b border-[#E5EAF0] p-6 sm:border-r sm:border-b-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue/10">
                    <Users className="h-4 w-4 text-blue" />
                  </div>

                  <p className="mt-6 text-[9px] font-bold uppercase tracking-[0.18em] text-slate">
                    Travellers
                  </p>

                  <p className="mt-2 text-lg font-extrabold text-navy">
                    {travellerCount} Traveller
                    {travellerCount !== 1 ? "s" : ""}
                  </p>
                </div>

                {/* Accommodation */}
                <div className="p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                    <ShieldCheck className="h-4 w-4 text-accent" />
                  </div>

                  <p className="mt-6 text-[9px] font-bold uppercase tracking-[0.18em] text-slate">
                    Accommodation
                  </p>

                  <p className="mt-2 text-lg font-extrabold capitalize text-navy">
                    {intent.accommodation || "Standard"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
              CONTACT DETAILS
          ====================================================== */}
          <section className="mx-auto mt-20 max-w-6xl">

            <div className="grid items-start gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">

              <div>
                <div className="mb-6 flex items-center gap-3">
                  <span className="h-px w-8 bg-blue" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue">
                    Reservation Contact
                  </span>
                </div>

                <h2 className="text-3xl font-extrabold leading-tight tracking-[-0.03em] text-navy sm:text-4xl">
                  We know where
                  <br />
                  to reach you.
                </h2>

                <p className="mt-5 max-w-sm text-sm leading-7 text-slate">
                  Your contact information is attached to this
                  reservation and will be used for important
                  journey updates.
                </p>
              </div>

              <div className="overflow-hidden rounded-[24px] border border-[#DDE5EF] bg-white shadow-[0_25px_80px_rgba(20,40,70,0.08)] sm:rounded-[28px]">

                <div className="grid sm:grid-cols-2">

                  {/* Email */}
                  <div className="border-b border-[#E5EAF0] p-7 sm:border-r sm:p-9">
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue/10">
                        <Mail className="h-5 w-5 text-blue" />
                      </div>

                      <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate">
                        Email
                      </span>
                    </div>

                    <p className="mt-7 text-[9px] font-bold uppercase tracking-[0.18em] text-slate">
                      Email address
                    </p>

                    <p className="mt-2 break-all text-sm font-bold text-navy sm:text-base">
                      {intent.leadEmail || "Not provided"}
                    </p>

                    <p className="mt-2 text-xs text-slate/75">
                      Primary booking contact
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="p-7 sm:p-9">
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/10">
                        <Phone className="h-5 w-5 text-accent" />
                      </div>

                      <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate">
                        Phone
                      </span>
                    </div>

                    <p className="mt-7 text-[9px] font-bold uppercase tracking-[0.18em] text-slate">
                      Phone number
                    </p>

                    <p className="mt-2 text-sm font-bold text-navy sm:text-base">
                      {intent.leadPhone || "Not provided"}
                    </p>

                    <p className="mt-2 text-xs text-slate/75">
                      For journey updates
                    </p>
                  </div>
                </div>

                {/* Confirmation */}
                <div className="border-t border-[#E5EAF0] bg-[#FAFBFD] px-7 py-5 sm:px-9">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF7F0]">
                      <Check className="h-4 w-4 text-emerald-600" />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-navy">
                        Reservation details recorded
                      </p>

                      <p className="mt-0.5 text-[11px] text-slate">
                        Your information is safely saved.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
              WHAT HAPPENS NEXT
          ====================================================== */}
          <section className="mx-auto mt-24 max-w-6xl">

            <div className="grid items-start gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">

              <div>
                <div className="mb-6 flex items-center gap-3">
                  <span className="h-px w-8 bg-accent" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                    The Road Ahead
                  </span>
                </div>

                <h2 className="text-3xl font-extrabold leading-tight tracking-[-0.03em] text-navy sm:text-4xl">
                  What happens
                  <br />
                  next?
                </h2>

                <p className="mt-5 max-w-sm text-sm leading-7 text-slate">
                  From confirmation to departure, here&apos;s how
                  your Mayura journey moves forward.
                </p>

                <div className="mt-8 hidden items-center gap-3 lg:flex">
                  <Navigation className="h-5 w-5 rotate-45 text-blue" />

                  <span className="h-px w-16 border-t border-dashed border-[#BFCFDD]" />

                  <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate">
                    Your journey
                  </span>
                </div>
              </div>

              <div className="relative">

                <div className="absolute left-5 top-5 bottom-5 hidden border-l border-dashed border-[#C7D8E6] sm:block" />

                <div className="space-y-2">

                  {journeySteps.map((step, index) => {
                    const active = activeStep === index;

                    return (
                      <button
                        key={step.number}
                        type="button"
                        onClick={() => setActiveStep(index)}
                        className={`group relative flex w-full items-start gap-5 rounded-[20px] p-5 text-left transition-all duration-300 sm:gap-7 sm:p-6 ${
                          active
                            ? "border border-[#DDE5EF] bg-white shadow-[0_20px_60px_rgba(20,40,70,0.08)]"
                            : "border border-transparent hover:bg-white/70"
                        }`}
                      >
                        <div
                          className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-4 border-[#F7F9FC] text-[9px] font-black transition-all duration-300 sm:h-12 sm:w-12 ${
                            active
                              ? "bg-blue text-white shadow-[0_8px_20px_rgba(20,40,70,0.15)]"
                              : "bg-white text-slate ring-1 ring-[#D7E2EB] group-hover:bg-blue/10 group-hover:text-blue"
                          }`}
                        >
                          {index === journeySteps.length - 1
                            ? "✦"
                            : step.number}
                        </div>

                        <div className="min-w-0 flex-1 pt-0.5">

                          <div className="flex flex-wrap items-center gap-3">
                            <span
                              className={`text-[9px] font-bold uppercase tracking-[0.18em] ${
                                active
                                  ? "text-accent"
                                  : "text-slate"
                              }`}
                            >
                              {step.label}
                            </span>

                            {active && (
                              <span className="h-1 w-1 rounded-full bg-accent" />
                            )}
                          </div>

                          <h3 className="mt-2 text-base font-extrabold text-navy sm:text-lg">
                            {step.title}
                          </h3>

                          <p
                            className={`mt-2 text-sm leading-6 transition-colors ${
                              active
                                ? "text-slate"
                                : "text-slate/70"
                            }`}
                          >
                            {step.description}
                          </p>
                        </div>

                        <ArrowRight
                          className={`mt-1 hidden h-4 w-4 shrink-0 transition-all sm:block ${
                            active
                              ? "text-blue"
                              : "text-slate/40 opacity-0 group-hover:translate-x-1 group-hover:opacity-100"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
    PAYMENT SUMMARY
====================================================== */}
<section className="mx-auto mt-24 max-w-6xl">

  <div className="mb-8">
    <div className="mb-5 flex items-center gap-3">
      <span className="h-px w-8 bg-blue" />

      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue">
        Reservation Value
      </span>
    </div>

    <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-navy sm:text-4xl">
      Booking summary.
    </h2>
  </div>

  {/* =====================================================
      PAYMENT SUMMARY — ITINERARY MAP STYLE
  ====================================================== */}
  <div className="relative overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_12%_20%,rgba(235,76,126,0.22),transparent_30%),radial-gradient(circle_at_88%_80%,rgba(75,126,220,0.24),transparent_35%),linear-gradient(135deg,#071D3B_0%,#102F5C_55%,#172C55_100%)] shadow-[0_25px_70px_-35px_rgba(8,33,76,0.55)]">

    {/* =================================================
        ROUTE LINES
    ================================================= */}
    <div className="pointer-events-none absolute inset-0 opacity-[0.12]">
      <svg
        className="h-full w-full"
        viewBox="0 0 1200 650"
        preserveAspectRatio="none"
      >
        <path
          d="M-80 500 C120 160 300 610 500 310 S850 100 1280 410"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeDasharray="8 13"
        />

        <path
          d="M-50 160 C180 420 350 60 590 250 S950 560 1270 170"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeDasharray="5 15"
        />

        <path
          d="M180 650 C310 430 450 450 610 530 S950 690 1120 460"
          fill="none"
          stroke="white"
          strokeWidth="1"
          strokeDasharray="4 14"
        />
      </svg>
    </div>

    {/* =================================================
        SOFT GLOWS
    ================================================= */}
    <div className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />

    <div className="pointer-events-none absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-blue/20 blur-3xl" />

    {/* =================================================
        DECORATIVE CIRCLES
    ================================================= */}
    <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/[0.07]" />

    <div className="pointer-events-none absolute right-16 top-16 h-32 w-32 rounded-full border border-white/[0.05]" />

    <div className="pointer-events-none absolute bottom-16 left-[18%] h-2 w-2 rounded-full bg-accent shadow-[0_0_0_7px_rgba(235,76,126,0.10)]" />

    <div className="pointer-events-none absolute left-[38%] top-[30%] h-1.5 w-1.5 rounded-full bg-white/40" />

    {/* =================================================
        CONTENT
    ================================================= */}
    <div className="relative z-10 grid lg:grid-cols-[1fr_0.85fr]">

      {/* =================================================
          LEFT — RESERVATION MESSAGE
      ================================================= */}
      <div className="relative p-7 sm:p-10 lg:p-14">

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10">
          <ShieldCheck className="h-5 w-5 text-accent" />
        </div>

        <p className="mt-7 text-[9px] font-bold uppercase tracking-[0.2em] text-accent">
          Reservation Recorded
        </p>

        <h3 className="mt-3 max-w-lg text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl">
          Your journey is reserved.
        </h3>

        <p className="mt-5 max-w-lg text-sm leading-8 text-white/65">
          The selected package and traveller count have been
          successfully recorded as part of this reservation.
        </p>

        {/* Booking reference */}
        <div className="mt-10 border-t border-white/10 pt-7">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/35">
            Booking Reference
          </p>

          <p className="mt-2 text-xl font-black tracking-[0.12em] text-white sm:text-2xl">
            {bookingReference}
          </p>
        </div>
      </div>

      {/* =================================================
          RIGHT — PAYMENT DETAILS
      ================================================= */}
      <div className="relative border-t border-white/10 bg-black/10 p-7 sm:p-10 lg:border-l lg:border-t-0 lg:p-14">

        <div className="space-y-6">

          {/* Price */}
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/35">
                Price
              </p>

              <p className="mt-1 text-sm text-white/65">
                Per traveller
              </p>
            </div>

            <p className="text-base font-bold text-white">
              {pricePerPerson !== null
                ? `₹${pricePerPerson.toLocaleString("en-IN")}`
                : "—"}
            </p>
          </div>

          {/* Travellers */}
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/35">
                Travellers
              </p>

              <p className="mt-1 text-sm text-white/65">
                Number of guests
              </p>
            </div>

            <p className="text-base font-bold text-white">
              × {travellerCount}
            </p>
          </div>

          {/* Accommodation */}
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/35">
                Accommodation
              </p>

              <p className="mt-1 text-sm capitalize text-white/65">
                {intent.accommodation || "Standard"}
              </p>
            </div>

            <ShieldCheck className="h-4 w-4 text-accent" />
          </div>

          {/* Total */}
          <div className="border-t border-dashed border-white/15 pt-7">

            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/40">
              Total Reservation Value
            </p>

            <div className="mt-3 flex flex-wrap items-end justify-between gap-4">

              <p className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                {totalAmount !== null
                  ? `₹${totalAmount.toLocaleString("en-IN")}`
                  : "—"}
              </p>

              <span className="rounded-full bg-accent px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_8px_25px_-10px_rgba(235,76,126,0.9)]">
                Reserved
              </span>
            </div>
          </div>
        </div>

        {/* Small bottom note */}
        <div className="mt-10 flex items-center gap-3 border-t border-white/10 pt-6">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />

          <span className="text-[10px] text-white/40">
            Your reservation details are safely recorded.
          </span>
        </div>
      </div>
    </div>
  </div>
</section>

          {/* =====================================================
              FINAL CTA
          ====================================================== */}
          <section className="mx-auto mt-24 max-w-6xl pb-4">

            <div className="relative overflow-hidden rounded-[24px] border border-[#DDE5EF] bg-white px-7 py-12 text-center shadow-[0_25px_80px_rgba(20,40,70,0.08)] sm:rounded-[28px] sm:px-12 sm:py-14">

              <div className="pointer-events-none absolute inset-0 opacity-60">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(to_right,#E9EEF4_1px,transparent_1px),linear-gradient(to_bottom,#E9EEF4_1px,transparent_1px)",
                    backgroundSize: "72px 72px",
                    maskImage:
                      "linear-gradient(to_bottom, transparent, black 30%, black 70%, transparent)",
                  }}
                />
              </div>

              <div className="relative">

                <div className="mb-7 flex items-center justify-center gap-3">

                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />

                  <div className="w-12 border-t border-dashed border-[#CBD8E3]" />

                  <Navigation className="h-5 w-5 rotate-45 text-blue" />

                  <div className="w-12 border-t border-dashed border-[#CBD8E3]" />

                  <span className="h-1.5 w-1.5 rounded-full bg-blue" />
                </div>

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                  Until the journey begins
                </p>

                <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.025em] text-navy sm:text-3xl">
                  Keep this confirmation handy.
                </h2>

                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate">
                  Your booking reference is your key to this
                  reservation. Save this page or keep the reference
                  somewhere safe.
                </p>

                <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="group flex items-center justify-center gap-2 rounded-xl border border-[#D7E1EA] bg-white px-6 py-3.5 text-sm font-bold text-navy transition-all duration-200 hover:-translate-y-0.5 hover:border-blue hover:text-blue"
                  >
                    <Download className="h-4 w-4" />

                    Save Confirmation
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/packages")}
                    className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue to-navy px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_-15px_rgba(20,40,70,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Explore More Trips

                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="group flex items-center justify-center gap-2 rounded-xl border border-[#D7E1EA] bg-white px-6 py-3.5 text-sm font-bold text-navy transition-all duration-200 hover:-translate-y-0.5 hover:border-blue hover:text-blue"
                  >
                    <Home className="h-4 w-4" />

                    Home
                  </button>
                </div>

                <div className="mt-10 flex items-center justify-center gap-3 text-xs text-slate">

                  <span className="h-px w-8 bg-[#D8E2EA]" />

                  <span>
                    Thank you for choosing Mayura Holidays
                  </span>

                  <span className="h-px w-8 bg-[#D8E2EA]" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}