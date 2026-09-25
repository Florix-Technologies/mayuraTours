"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { loginHref } from "@/lib/auth/paths";
import { saveBookingIntent } from "@/lib/booking/intent";
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  MapPin,
  Users,
  Check,
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
    day: "Day 01",
    title: "Arrival & Check-in",
    description:
      "Your itinerary details will be updated with the final information provided by Mayura Holidays.",
  },
  {
    day: "Day 02",
    title: "Explore the Destination",
    description:
      "Your itinerary details will be updated with the final information provided by Mayura Holidays.",
  },
  {
    day: "Day 03",
    title: "Departure",
    description:
      "Your itinerary details will be updated with the final information provided by Mayura Holidays.",
  },
];

const includedItems = [
  "Accommodation details",
  "Transportation details",
  "Meals and services",
  "Sightseeing and activities",
];

const excludedItems = [
  "Personal expenses",
  "Additional activities",
  "Expenses not mentioned in the package",
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

  // Resolve the async route params on the client.
  useState(() => {
    params.then(({ slug }) => setSlug(slug));
  });

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
      {/* Package Header */}
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

      {/* Gallery */}
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
                className="object-cover transition-transform duration-700 hover:scale-[1.02]"
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
                  className="object-cover object-[35%_50%]"
                />
              </div>

              <div className="relative overflow-hidden">
                <Image
                  src={pkg.image}
                  alt=""
                  fill
                  sizes="25vw"
                  className="object-cover object-[70%_50%] brightness-[0.82]"
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

      {/* Main Content */}
      <section className="bg-[#F7F9FC] py-14 sm:py-18">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16">
            {/* LEFT CONTENT */}
            <div className="min-w-0">
              {/* Overview */}
              <section>
                <p className="text-[11px] font-bold tracking-[0.18em] text-accent uppercase">
                  Overview
                </p>

                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
                  Experience {pkg.name}
                </h2>

                <p className="mt-5 text-base leading-8 text-slate">
                  {pkg.description}
                </p>
              </section>

              {/* Highlights */}
              <section className="mt-14">
                <p className="text-[11px] font-bold tracking-[0.18em] text-accent uppercase">
                  Trip Highlights
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {pkg.tags.map((tag) => (
                    <div
                      key={tag}
                      className="rounded-2xl border border-[#E4EAF2] bg-white px-5 py-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E9F1FC] text-navy">
                          <Check size={15} />
                        </span>

                        <span className="text-sm font-semibold text-navy">
                          {tag}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Itinerary */}
              <section className="mt-16">
                <p className="text-[11px] font-bold tracking-[0.18em] text-accent uppercase">
                  Your Journey
                </p>

                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-navy">
                  Itinerary
                </h2>

                <div className="mt-7 overflow-hidden rounded-3xl border border-[#E4EAF2] bg-white">
                  {itinerary.map((item, index) => {
                    const isOpen = openDay === index;

                    return (
                      <div
                        key={item.day}
                        className="border-b border-[#E8EDF4] last:border-b-0"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setOpenDay(isOpen ? -1 : index)
                          }
                          className="flex w-full items-center gap-4 px-5 py-5 text-left sm:px-7"
                        >
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy text-[10px] font-bold tracking-wider text-white">
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <span className="flex-1">
                            <span className="block text-[10px] font-bold tracking-[0.14em] text-accent uppercase">
                              {item.day}
                            </span>

                            <span className="mt-1 block text-base font-bold text-navy">
                              {item.title}
                            </span>
                          </span>

                          <ChevronDown
                            size={19}
                            className={`shrink-0 text-slate transition-transform duration-300 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-6 pl-20 sm:px-7 sm:pb-7 sm:pl-24">
                            <p className="max-w-2xl text-sm leading-7 text-slate">
                              {item.description}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Included / Excluded */}
              <section className="mt-16 grid gap-6 md:grid-cols-2">
                <div className="rounded-3xl bg-white p-6 sm:p-7">
                  <p className="text-[11px] font-bold tracking-[0.16em] text-accent uppercase">
                    Included
                  </p>

                  <h3 className="mt-2 text-2xl font-extrabold text-navy">
                    What's Included
                  </h3>

                  <ul className="mt-6 space-y-4">
                    {includedItems.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-sm leading-6 text-slate"
                      >
                        <Check
                          size={17}
                          className="mt-1 shrink-0 text-accent"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-3xl bg-white p-6 sm:p-7">
                  <p className="text-[11px] font-bold tracking-[0.16em] text-accent uppercase">
                    Excluded
                  </p>

                  <h3 className="mt-2 text-2xl font-extrabold text-navy">
                    What's Not Included
                  </h3>

                  <ul className="mt-6 space-y-4">
                    {excludedItems.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-sm leading-6 text-slate"
                      >
                        <X
                          size={17}
                          className="mt-1 shrink-0 text-slate"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Policies */}
              <section className="mt-16 grid gap-6 md:grid-cols-2">
                <div className="rounded-3xl border border-[#E4EAF2] bg-white p-6 sm:p-7">
                  <h3 className="text-xl font-extrabold text-navy">
                    Cancellation Policy
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate">
                    Cancellation and refund terms will be updated based on
                    the final package policy provided by Mayura Holidays.
                  </p>
                </div>

                <div className="rounded-3xl border border-[#E4EAF2] bg-white p-6 sm:p-7">
                  <h3 className="text-xl font-extrabold text-navy">
                    Important Information
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate">
                    Important travel instructions, reporting details,
                    documents and other package-specific information will be
                    updated here.
                  </p>
                </div>
              </section>
            </div>

            {/* BOOKING CARD */}
            {/* BOOKING CARD */}
<aside className="lg:sticky lg:top-28 lg:self-start">
  <div
    id="booking"
    className="rounded-3xl bg-white p-6 shadow-[0_24px_70px_-35px_rgba(8,33,76,0.55)] sm:p-7"
  >
    <p className="text-[10px] font-bold tracking-[0.16em] text-accent uppercase">
      Book this trip
    </p>

    <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-navy">
      Plan your journey
    </h3>

    <div className="mt-6 space-y-3">
      {/* Travel Date */}
      <label className="block rounded-2xl border border-[#E4EAF2] px-4 py-3.5">
        <span className="block text-[10px] font-semibold tracking-[0.12em] text-[#93A4BE] uppercase">
          Travel Date
        </span>

        <input
          type="date"
          value={travelDate}
          onChange={(event) => setTravelDate(event.target.value)}
          className="mt-1.5 w-full bg-transparent text-sm font-semibold text-navy outline-none"
        />
      </label>

      {/* Travellers */}
      <label className="block rounded-2xl border border-[#E4EAF2] px-4 py-3.5">
        <span className="block text-[10px] font-semibold tracking-[0.12em] text-[#93A4BE] uppercase">
          Travellers
        </span>

        <select
          value={travellers}
          onChange={(event) => setTravellers(event.target.value)}
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

      {/* Accommodation */}
      <label className="block rounded-2xl border border-[#E4EAF2] px-4 py-3.5">
        <span className="block text-[10px] font-semibold tracking-[0.12em] text-[#93A4BE] uppercase">
          Accommodation
        </span>

        <select
          value={accommodation}
          onChange={(event) => setAccommodation(event.target.value)}
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

    {/* Price */}
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
      className="mt-6 w-full rounded-full bg-accent px-5 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy"
    >
      Continue to Booking
    </button>

    <p className="mt-4 text-center text-[11px] leading-5 text-slate">
      Final availability and pricing will be confirmed before booking.
    </p>
  </div>
</aside>
          </div>
        </div>
      </section>
    </main>
  );
}
