"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { loginHref } from "@/lib/auth/paths";
import { saveBookingIntent } from "@/lib/booking/intent";
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  BusFront,
  CalendarDays,
  Camera,
  Check,
  FileText,
  MapPin,
  Mountain,
  ShieldCheck,
  Ticket,
  Utensils,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { packages } from "@/lib/data/packages";

type PackageDetailsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const itinerary = [
  {
    day: "01",
    label: "DAY 01",
    title: "Arrival & Check-in",
    location: "Destination arrival",
    description:
      "Your journey begins as you arrive at the destination. Complete your check-in and settle into your accommodation before getting ready to explore.",
  },
  {
    day: "02",
    label: "DAY 02",
    title: "Explore the Destination",
    location: "Local experiences",
    description:
      "Spend the day discovering the destination, enjoying sightseeing, local experiences and the highlights included in your Mayura journey.",
  },
  {
    day: "03",
    label: "DAY 03",
    title: "Departure",
    location: "Journey back home",
    description:
      "Enjoy your final moments at the destination before checking out and beginning your return journey.",
  },
];

const includedItems = [
  {
    title: "Accommodation",
    description: "Comfortable stay throughout your journey.",
    icon: BedDouble,
  },
  {
    title: "Transportation",
    description: "Planned travel arrangements.",
    icon: BusFront,
  },
  {
    title: "Meals & Services",
    description: "Selected meals and package services.",
    icon: Utensils,
  },
  {
    title: "Sightseeing",
    description: "Destination experiences included.",
    icon: Camera,
  },
  {
    title: "Activities",
    description: "Selected activities from your itinerary.",
    icon: Mountain,
  },
  {
    title: "Travel Services",
    description: "Package-related assistance and services.",
    icon: ShieldCheck,
  },
];

const excludedItems = [
  {
    title: "Personal expenses",
    icon: WalletCards,
  },
  {
    title: "Additional activities",
    icon: Ticket,
  },
  {
    title: "Expenses not mentioned in the package",
    icon: FileText,
  },
];

export default function PackageDetailsPage({
  params,
}: PackageDetailsPageProps) {
  const router = useRouter();
  const { isAuthenticated, isReady } = useAuth();

  const [openDay, setOpenDay] = useState(0);
  const [travelDate, setTravelDate] = useState("");
  const [travellers, setTravellers] = useState("2");
  const [accommodation, setAccommodation] = useState("");
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    params.then(({ slug }) => {
      if (active) {
        setSlug(slug);
      }
    });

    return () => {
      active = false;
    };
  }, [params]);

  if (!slug) {
    return null;
  }

const pkg = packages.find((item) => item.slug === slug);

if (!pkg) {
  return null;
}

function continueBooking() {
  if (!pkg) return;

  saveBookingIntent({
    slug: pkg.slug,
    packageName: pkg.name,
    travelDate,
    travellers,
    accommodation,
  });

  const next = "/booking/traveler-details";

  if (isReady && isAuthenticated) {
    router.push(next);
    return;
  }

  router.push(loginHref(next));
}

  return (
    <main className="min-h-screen bg-[#F7F9FC]">
      {/* =========================================================
          HERO / PACKAGE HEADER
          ========================================================= */}
      <section className="bg-white pt-28 pb-8 sm:pt-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Link
            href="/packages"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate transition-colors hover:text-navy"
          >
            <ArrowLeft size={16} />
            Back to Packages
          </Link>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-accent px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] text-white uppercase">
                  {pkg.badge}
                </span>

                {pkg.secondaryBadge && (
                  <span className="rounded-full bg-[#E9F1FC] px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] text-navy uppercase">
                    {pkg.secondaryBadge}
                  </span>
                )}
              </div>

              <h1 className="max-w-3xl text-4xl leading-[1.08] font-extrabold tracking-[-0.035em] text-navy sm:text-5xl lg:text-6xl">
                {pkg.name}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate">
                <span className="inline-flex items-center gap-2">
                  <MapPin size={16} />
                  Mayura Holidays
                </span>

                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={16} />
                  {pkg.tags[0]}
                </span>

                <span className="inline-flex items-center gap-2">
                  <Users size={16} />
                  Flexible Travellers
                </span>
              </div>
            </div>

            <div className="shrink-0 lg:text-right">
              <p className="text-[10px] font-semibold tracking-[0.14em] text-[#93A4BE] uppercase">
                Starting from
              </p>

              <p className="mt-1 text-3xl font-extrabold tracking-tight text-navy">
                {pkg.price}
                <span className="ml-1 text-sm font-medium text-slate">
                  {pkg.priceUnit}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          GALLERY
          ========================================================= */}
      <section className="bg-white pb-12">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid h-105 grid-cols-1 gap-2 overflow-hidden rounded-3xl sm:h-125 lg:grid-cols-[1.7fr_1fr]">
            <div className="relative min-h-70 overflow-hidden">
              <Image
                src={pkg.image}
                alt={pkg.imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover transition-transform duration-1000 hover:scale-[1.025]"
              />

              <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/55 to-transparent" />

              <div className="absolute right-5 bottom-5 left-5">
                <p className="max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
                  {pkg.description}
                </p>
              </div>
            </div>

            <div className="hidden grid-cols-2 gap-2 lg:grid">
              <div className="relative overflow-hidden">
                <Image
                  src={pkg.image}
                  alt=""
                  fill
                  sizes="25vw"
                  className="object-cover object-[35%_50%] transition-transform duration-1000 hover:scale-105"
                />
              </div>

              <div className="relative overflow-hidden">
                <Image
                  src={pkg.image}
                  alt=""
                  fill
                  sizes="25vw"
                  className="object-cover object-[70%_50%] brightness-[0.82] transition-transform duration-1000 hover:scale-105"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black/15">
                  <span className="rounded-full bg-white/95 px-5 py-2.5 text-xs font-bold text-navy shadow-lg">
                    More Photos
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          MAIN CONTENT
          ========================================================= */}
      <section className="overflow-hidden bg-[#F7F9FC] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {/* =====================================================
              TOP CONTENT + BOOKING SIDEBAR
              ===================================================== */}
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16">
            {/* LEFT CONTENT */}
            <div className="min-w-0">
              {/* OVERVIEW */}
              <section>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[11px] font-bold tracking-[0.18em] text-accent uppercase">
                      The Experience
                    </p>

                    <h2 className="mt-2 max-w-2xl text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
                      A journey designed to be remembered.
                    </h2>
                  </div>

                  <div className="hidden h-px flex-1 bg-[#DCE4EF] sm:mb-2 sm:ml-8 sm:block" />
                </div>

                <p className="mt-6 max-w-3xl text-base leading-8 text-slate">
                  {pkg.description}
                </p>
              </section>

              {/* MOVING HIGHLIGHTS */}
              <section className="relative mt-14 overflow-hidden border-y border-[#DCE4EF] py-5">
                <div className="flex w-max animate-[marquee_24s_linear_infinite] items-center">
                  {[...pkg.tags, ...pkg.tags, ...pkg.tags].map(
                    (tag, index) => (
                      <div
                        key={`${tag}-${index}`}
                        className="flex items-center"
                      >
                        <span className="px-5 text-sm font-semibold text-navy sm:px-7">
                          {tag}
                        </span>

                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      </div>
                    ),
                  )}
                </div>

                <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-[#F7F9FC] to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-[#F7F9FC] to-transparent" />
              </section>

              {/* INTERACTIVE JOURNEY */}
              <section className="mt-20">
                <div>
                  <p className="text-[11px] font-bold tracking-[0.18em] text-accent uppercase">
                    Follow the Journey
                  </p>

                  <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
                    Your trip, day by day.
                  </h2>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate">
                    Move through the journey to see how your experience
                    unfolds.
                  </p>
                </div>

                <div className="relative mt-10">
                  <div className="absolute top-6 right-6 left-6 hidden h-px bg-[#D5DFEB] sm:block" />

                  <div className="relative grid grid-cols-3">
                    {itinerary.map((item, index) => {
                      const active = openDay === index;

                      return (
                        <button
                          key={item.day}
                          type="button"
                          onClick={() => setOpenDay(index)}
                          className="group flex flex-col items-center"
                        >
                          <span
                            className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-[#F7F9FC] text-xs font-extrabold transition-all duration-500 ${
                              active
                                ? "bg-accent text-white shadow-[0_8px_25px_-8px_rgba(235,76,126,0.8)]"
                                : "bg-white text-navy shadow-sm group-hover:bg-navy group-hover:text-white"
                            }`}
                          >
                            {item.day}
                          </span>

                          <span
                            className={`mt-3 text-[10px] font-bold tracking-[0.12em] uppercase transition-colors ${
                              active ? "text-accent" : "text-slate"
                            }`}
                          >
                            {item.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="relative mt-8 overflow-hidden rounded-[2rem] bg-navy text-white">
                  <div className="absolute top-0 right-0 h-56 w-56 translate-x-1/3 -translate-y-1/3 rounded-full border border-white/10" />
                  <div className="absolute right-20 bottom-0 h-40 w-40 translate-y-1/2 rounded-full border border-white/10" />

                  <div
                    key={openDay}
                    className="relative grid gap-8 p-7 animate-[fadeIn_400ms_ease-out] sm:p-10 md:grid-cols-[140px_minmax(0,1fr)] md:items-center"
                  >
                    <div>
                      <p className="text-[11px] font-bold tracking-[0.2em] text-white/50 uppercase">
                        {itinerary[openDay].label}
                      </p>

                      <p className="mt-2 text-6xl font-extrabold tracking-[-0.05em] text-white/15 sm:text-7xl">
                        {itinerary[openDay].day}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <MapPin size={15} />
                        {itinerary[openDay].location}
                      </div>

                      <h3 className="mt-3 text-2xl font-extrabold sm:text-3xl">
                        {itinerary[openDay].title}
                      </h3>

                      <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
                        {itinerary[openDay].description}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          setOpenDay(
                            openDay === itinerary.length - 1
                              ? 0
                              : openDay + 1,
                          )
                        }
                        className="mt-7 inline-flex items-center gap-2 text-xs font-bold tracking-[0.12em] text-white uppercase transition-all hover:gap-3"
                      >
                        Next day
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* BOOKING PANEL */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div
                id="booking"
                className="relative overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_70px_-35px_rgba(8,33,76,0.55)]"
              >
                <div className="h-1.5 w-full bg-linear-to-r from-accent via-[#F58AAE] to-navy" />

                <div className="p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.16em] text-accent uppercase">
                        Start your journey
                      </p>

                      <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-navy">
                        Book this trip
                      </h3>
                    </div>

                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7E8EF] text-accent">
                      <ArrowRight size={17} />
                    </span>
                  </div>

                  <div className="mt-7 space-y-3">
                    <label
                      className={`block rounded-2xl border px-4 py-3.5 transition-all duration-300 ${
                        travelDate
                          ? "border-accent/40 bg-[#FFF8FA]"
                          : "border-[#E4EAF2] bg-white"
                      }`}
                    >
                      <span className="block text-[10px] font-semibold tracking-[0.12em] text-[#93A4BE] uppercase">
                        Travel Date
                      </span>

                      <input
                        type="date"
                        value={travelDate}
                        onChange={(event) =>
                          setTravelDate(event.target.value)
                        }
                        className="mt-1.5 w-full bg-transparent text-sm font-semibold text-navy outline-none"
                      />
                    </label>

                    <label className="block rounded-2xl border border-[#E4EAF2] bg-white px-4 py-3.5">
                      <span className="block text-[10px] font-semibold tracking-[0.12em] text-[#93A4BE] uppercase">
                        Travellers
                      </span>

                      <select
                        value={travellers}
                        onChange={(event) =>
                          setTravellers(event.target.value)
                        }
                        className="mt-1.5 w-full cursor-pointer bg-transparent text-sm font-semibold text-navy outline-none"
                      >
                        <option value="1">1 Adult</option>
                        <option value="2">2 Adults</option>
                        <option value="3">3 Adults</option>
                        <option value="4">4 Adults</option>
                        <option value="5">5 Adults</option>
                        <option value="6">6 Adults</option>
                        <option value="7">7 Adults</option>
                        <option value="8">8 Adults</option>
                        <option value="9">9 Adults</option>
                        <option value="10">10 Adults</option>
                      </select>
                    </label>

                    <label
                      className={`block rounded-2xl border px-4 py-3.5 transition-all duration-300 ${
                        accommodation
                          ? "border-accent/40 bg-[#FFF8FA]"
                          : "border-[#E4EAF2] bg-white"
                      }`}
                    >
                      <span className="block text-[10px] font-semibold tracking-[0.12em] text-[#93A4BE] uppercase">
                        Accommodation
                      </span>

                      <select
                        value={accommodation}
                        onChange={(event) =>
                          setAccommodation(event.target.value)
                        }
                        className="mt-1.5 w-full cursor-pointer bg-transparent text-sm font-semibold text-navy outline-none"
                      >
                        <option value="" disabled>
                          Select accommodation
                        </option>
                        <option value="standard">Standard</option>
                        <option value="deluxe">Deluxe</option>
                        <option value="premium">Premium</option>
                      </select>
                    </label>
                  </div>

                  <div className="my-6 border-t border-[#E8EDF4]" />

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-semibold tracking-[0.12em] text-[#93A4BE] uppercase">
                        Starting from
                      </p>

                      <p className="mt-1 text-2xl font-extrabold text-navy">
                        {pkg.price}
                      </p>
                    </div>

                    <span className="text-xs text-slate">
                      {pkg.priceUnit}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={continueBooking}
                    className="group mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-accent px-5 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy hover:shadow-lg"
                  >
                    Continue to Booking

                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </button>

                  <p className="mt-4 text-center text-[11px] leading-5 text-slate">
                    Final availability and pricing will be confirmed before
                    booking.
                  </p>
                </div>
              </div>
            </aside>
          </div>

          {/* =====================================================
              FULL-WIDTH ITINERARY
              ===================================================== */}
          <section className="mt-24">
            <div className="flex items-end justify-between gap-5">
              <div>
                <p className="text-[11px] font-bold tracking-[0.18em] text-accent uppercase">
                  Itinerary
                </p>

                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
                  See how the days connect.
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate">
                  Follow the journey from arrival to departure.
                </p>
              </div>

              <span className="hidden text-xs text-slate sm:block">
                {itinerary.length} days
              </span>
            </div>

            {/* =====================================================
                ITINERARY TRAVEL MAP
                ===================================================== */}
            <div className="relative mt-10 overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_12%_20%,rgba(235,76,126,0.22),transparent_30%),radial-gradient(circle_at_88%_80%,rgba(75,126,220,0.24),transparent_35%),linear-gradient(135deg,#071D3B_0%,#102F5C_55%,#172C55_100%)] shadow-[0_25px_70px_-35px_rgba(8,33,76,0.55)]">
              {/* ROUTE LINES */}
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

              {/* SOFT GLOW */}
              <div className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />

              <div className="pointer-events-none absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-[#4B7EDC]/20 blur-3xl" />

              {/* CONTENT */}
              <div className="relative z-10 grid lg:grid-cols-[260px_minmax(0,1fr)]">
                {/* =================================================
                    ITINERARY NAVIGATION
                    ================================================= */}
                <div className="border-b border-white/10 bg-black/10 p-5 lg:border-r lg:border-b-0 lg:p-7">
                  <div className="space-y-2">
                    {itinerary.map((item, index) => {
                      const active = openDay === index;

                      return (
                        <button
                          key={item.day}
                          type="button"
                          onClick={() => setOpenDay(index)}
                          className={`group flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-left transition-all duration-300 ${
                            active
                              ? "bg-white text-navy shadow-[0_15px_40px_-20px_rgba(0,0,0,0.5)]"
                              : "text-white/65 hover:bg-white/[0.08] hover:text-white"
                          }`}
                        >
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-all ${
                              active
                                ? "bg-accent text-white"
                                : "bg-white/10 text-white/70 ring-1 ring-white/10"
                            }`}
                          >
                            {item.day}
                          </span>

                          <span className="min-w-0">
                            <span
                              className={`block text-[9px] font-bold tracking-[0.14em] uppercase ${
                                active ? "text-[#93A4BE]" : "text-white/40"
                              }`}
                            >
                              {item.label}
                            </span>

                            <span className="mt-1 block truncate text-sm font-bold">
                              {item.title}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* SMALL JOURNEY INDICATOR */}
                  <div className="mt-7 hidden border-t border-white/10 pt-6 lg:block">
                    <p className="text-[9px] font-bold tracking-[0.16em] text-white/35 uppercase">
                      Your journey
                    </p>

                    <div className="mt-4 flex items-center gap-2">
                      {itinerary.map((item, index) => (
                        <div
                          key={item.day}
                          className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                            index <= openDay ? "bg-accent" : "bg-white/10"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="mt-3 text-[10px] text-white/35">
                      Day {openDay + 1} of {itinerary.length}
                    </p>
                  </div>
                </div>

                {/* =================================================
                    ACTIVE ITINERARY
                    ================================================= */}
                <div className="relative min-h-90 overflow-hidden p-7 sm:p-10 lg:p-14">
                  {/* Decorative circles */}
                  <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full border border-white/[0.08]" />

                  <div className="pointer-events-none absolute top-10 right-10 h-28 w-28 rounded-full border border-white/[0.05]" />

                  {/* Decorative destination dots */}
                  <div className="pointer-events-none absolute right-[18%] bottom-[22%] h-2 w-2 rounded-full bg-accent shadow-[0_0_0_7px_rgba(235,76,126,0.10)]" />

                  <div className="pointer-events-none absolute top-[28%] right-[35%] h-1.5 w-1.5 rounded-full bg-white/40" />

                  <div
                    key={openDay}
                    className="relative animate-[fadeIn_400ms_ease-out]"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-accent px-3 py-1.5 text-[10px] font-bold tracking-[0.14em] text-white uppercase shadow-[0_8px_25px_-10px_rgba(235,76,126,0.9)]">
                        {itinerary[openDay].label}
                      </span>

                      <span className="flex items-center gap-1.5 text-xs text-white/50">
                        <MapPin size={14} />
                        {itinerary[openDay].location}
                      </span>
                    </div>

                    <h3 className="mt-5 max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                      {itinerary[openDay].title}
                    </h3>

                    <p className="mt-5 max-w-2xl text-sm leading-8 text-white/65">
                      {itinerary[openDay].description}
                    </p>

                    {/* DAY NAVIGATION */}
                    <div className="mt-10 flex flex-wrap items-center justify-between gap-5 border-t border-white/10 pt-6">
                      <div>
                        <span className="text-[9px] font-bold tracking-[0.15em] text-white/30 uppercase">
                          Journey Progress
                        </span>

                        <div className="mt-3 flex gap-1.5">
                          {itinerary.map((item, index) => (
                            <button
                              key={item.day}
                              type="button"
                              onClick={() => setOpenDay(index)}
                              aria-label={`Go to ${item.label}`}
                              className={`h-1.5 rounded-full transition-all duration-500 ${
                                index === openDay
                                  ? "w-10 bg-accent"
                                  : "w-5 bg-white/15 hover:bg-white/30"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setOpenDay(
                            openDay === itinerary.length - 1
                              ? 0
                              : openDay + 1,
                          )
                        }
                        className="group inline-flex items-center gap-2 text-xs font-bold tracking-[0.12em] text-white uppercase"
                      >
                        <span className="transition-colors group-hover:text-accent">
                          {openDay === itinerary.length - 1
                            ? "Start Again"
                            : "Next Day"}
                        </span>

                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] transition-all duration-300 group-hover:border-accent group-hover:bg-accent">
                          <ArrowRight
                            size={14}
                            className="transition-transform duration-300 group-hover:translate-x-0.5"
                          />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
              FULL-WIDTH INCLUDED / NOT INCLUDED
              ===================================================== */}
          <section className="mt-24">
            <div className="mb-10">
              <p className="text-[11px] font-bold tracking-[0.18em] text-accent uppercase">
                Know Before You Go
              </p>

              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
                What&apos;s part of your journey?
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate">
                We&apos;ve got you covered with the essentials. Here&apos;s
                what&apos;s included — and what you may want to plan for.
              </p>
            </div>

            <div className="grid min-h-130 overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_60px_-35px_rgba(8,33,76,0.35)] lg:grid-cols-[0.9fr_1.1fr]">
              {/* SCENIC IMAGE */}
              <div className="relative min-h-105 overflow-hidden lg:min-h-full">
                <Image
                  src={pkg.image}
                  alt={pkg.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover transition-transform duration-1000 hover:scale-[1.03]"
                />

                <div className="absolute inset-0 bg-linear-to-t from-[#061D3D]/90 via-[#061D3D]/25 to-transparent" />

                <div className="absolute right-7 bottom-7 left-7 sm:right-10 sm:bottom-10 sm:left-10">
                  <p className="text-[10px] font-bold tracking-[0.2em] text-white/70 uppercase">
                    Your Mayura Journey
                  </p>

                  <h3 className="mt-3 max-w-lg text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                    More than just the destination.
                  </h3>

                  <p className="mt-4 max-w-md text-sm leading-7 text-white/75">
                    From comfortable stays to unforgettable experiences,
                    these are the essentials that make your journey easier.
                  </p>
                </div>
              </div>

              {/* INFORMATION */}
              <div className="p-7 sm:p-10 lg:p-12">
                {/* INCLUDED */}
                <div>
                  <div className="flex items-center gap-4">
                    <span className="h-1 w-10 rounded-full bg-accent" />

                    <h3 className="text-2xl font-extrabold text-navy">
                      Included
                    </h3>
                  </div>

                  <div className="mt-8 grid gap-x-10 gap-y-7 sm:grid-cols-2">
                    {includedItems.map((item) => {
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.title}
                          className="group flex items-start gap-4 transition-transform duration-300 hover:translate-x-1"
                        >
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EEF7F2] text-navy transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                            <Icon size={19} strokeWidth={1.8} />
                          </div>

                          <div>
                            <p className="text-sm font-bold text-navy">
                              {item.title}
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="my-10 border-t border-[#E4EAF2]" />

                {/* NOT INCLUDED */}
                <div>
                  <div className="flex items-center gap-4">
                    <span className="h-1 w-10 rounded-full bg-[#7C88A0]" />

                    <h3 className="text-2xl font-extrabold text-navy">
                      Not Included
                    </h3>
                  </div>

                  <div className="mt-7 space-y-3">
                    {excludedItems.map((item) => {
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.title}
                          className="group flex items-center gap-4 rounded-2xl bg-[#F7F9FC] px-4 py-4 transition-all duration-300 hover:bg-[#F1F4F8]"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-slate ring-1 ring-[#E2E7EE] transition-colors duration-300 group-hover:text-navy">
                            <Icon size={16} strokeWidth={1.8} />
                          </div>

                          <span className="text-sm font-medium text-slate">
                            {item.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
              FULL-WIDTH POLICIES
              ===================================================== */}
          <section className="mt-20 border-t border-[#DCE4EF] pt-10">
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <p className="text-[10px] font-bold tracking-[0.16em] text-accent uppercase">
                  Before You Go
                </p>

                <h3 className="mt-2 text-xl font-extrabold text-navy">
                  Cancellation Policy
                </h3>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate">
                  Cancellation and refund terms will be updated based on the
                  final package policy provided by Mayura Holidays.
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold tracking-[0.16em] text-accent uppercase">
                  Good To Know
                </p>

                <h3 className="mt-2 text-xl font-extrabold text-navy">
                  Important Information
                </h3>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate">
                  Important travel instructions, reporting details, documents
                  and other package-specific information will be updated here.
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* =========================================================
          ANIMATION STYLES
          ========================================================= */}
      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-33.333%);
          }
        }

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