import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarClock,
  MapPin,
  Sparkles,
} from "lucide-react";

import { destinations } from "@/lib/data/destinations";

export default function DestinationsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* =========================================================
          HERO — UNTOUCHED
      ========================================================= */}
      <section className="relative flex min-h-[62vh] items-center justify-center overflow-hidden bg-ink">
        <div className="absolute inset-0">
          <Image
            src={destinations[0].image}
            alt="Mayura Holidays travel destination"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>

        <div className="absolute inset-0 bg-ink/65" />

        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-transparent to-ink/80" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
          <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-accent" />

            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
              Mayura Holidays
            </span>
          </div>

          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Explore Our Destinations
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
            Discover beautiful destinations, unforgettable experiences, and
            carefully curated journeys across South India and beyond.
          </p>
        </div>
      </section>

      {/* =========================================================
          INTRO
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-5 pb-10 pt-20 sm:px-8 lg:pb-14 lg:pt-24">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              Discover South India
            </p>

            <h2 className="mt-4 font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
              Places worth
              <br />
              travelling for.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-ink/55 md:text-right">
            From sun-soaked beaches and misty hills to heritage cities and
            peaceful escapes, discover destinations made for unforgettable
            journeys.
          </p>
        </div>
      </section>

      {/* =========================================================
          DESTINATION GRID
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:pb-28">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-12">
          {destinations.map((destination, index) => {
            const packageSlug = destination.packageSlugs[0];
            const hasPackage = Boolean(packageSlug);

            /*
             * Different card sizes create an editorial / premium layout.
             */
            let cardClass = "";

            if (index === 0) {
              cardClass = "md:col-span-2 lg:col-span-7 lg:row-span-2";
            } else if (index === 1) {
              cardClass = "lg:col-span-5";
            } else if (index === 2) {
              cardClass = "lg:col-span-5";
            } else if (index === 3) {
              cardClass = "lg:col-span-5 lg:row-span-2";
            } else if (index === 4) {
              cardClass = "lg:col-span-7";
            } else if (index === 5) {
              cardClass = "lg:col-span-7";
            } else {
              cardClass = "lg:col-span-4";
            }

            const imageClass =
              index === 0 || index === 3
                ? "min-h-[500px] lg:h-full"
                : "min-h-[320px] lg:min-h-[290px]";

            const cardContent = (
              <div
                className={`group relative h-full overflow-hidden rounded-[2rem] border border-black/[0.06] bg-ink ${hasPackage ? "cursor-pointer" : "cursor-default"}`}
              >
                <div className={`relative h-full ${imageClass}`}>
                  <Image
                    src={destination.image}
                    alt={destination.imageAlt}
                    fill
                    className={`object-cover transition-transform duration-1000 ease-out ${
                      hasPackage ? "group-hover:scale-105" : ""
                    }`}
                    sizes={
                      index === 0
                        ? "(max-width: 1024px) 100vw, 58vw"
                        : "(max-width: 1024px) 100vw, 42vw"
                    }
                  />

                  {/* Image overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/5" />

                  {/* Coming soon soft overlay */}
                  {!hasPackage && (
                    <div className="absolute inset-0 bg-black/20" />
                  )}

                  {/* Hover border */}
                  <div
                    className={`absolute inset-0 rounded-[2rem] border transition-all duration-500 ${
                      hasPackage
                        ? "border-white/10 group-hover:border-accent/70"
                        : "border-white/10"
                    }`}
                  />

                  {/* Top location */}
                  <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3.5 py-2 backdrop-blur-md">
                    <MapPin className="h-3.5 w-3.5 text-accent" />

                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
                      {destination.region}
                    </span>
                  </div>

                  {/* Top action / status */}
                  {hasPackage ? (
                    <div className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-md transition-all duration-300 group-hover:border-accent group-hover:bg-accent">
                      <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>
                  ) : (
                    <div className="absolute right-6 top-6 flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-3.5 py-2.5 backdrop-blur-md">
                      <CalendarClock className="h-3.5 w-3.5 text-accent" />

                      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80">
                        Coming Soon
                      </span>
                    </div>
                  )}

                  {/* Bottom content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7 lg:p-8">
                    <h3
                      className={`font-display font-bold text-white ${
                        index === 0 || index === 3
                          ? "text-4xl sm:text-5xl"
                          : "text-3xl"
                      }`}
                    >
                      {destination.name}
                    </h3>

                    <p className="mt-3 max-w-xl text-xs leading-5 text-white/65 sm:text-sm">
                      {destination.description}
                    </p>

                    {/* Highlights */}
                    <div className="mt-5 flex flex-wrap gap-2">
                      {destination.highlights
                        .slice(0, index === 0 ? 3 : 2)
                        .map((highlight) => (
                          <span
                            key={highlight}
                            className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-white/75 backdrop-blur-sm"
                          >
                            {highlight}
                          </span>
                        ))}
                    </div>

                    {/* Bottom action */}
                    <div
                      className={`mt-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] ${
                        hasPackage
                          ? "text-white/70 transition-colors duration-300 group-hover:text-accent"
                          : "text-accent"
                      }`}
                    >
                      {hasPackage ? (
                        <>
                          Explore Package
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </>
                      ) : (
                        <>
                          Coming Soon
                          <CalendarClock className="h-3.5 w-3.5" />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );

            return hasPackage ? (
              <Link
                key={destination.name}
                href={`/packages/${packageSlug}`}
                className={`block ${cardClass}`}
              >
                {cardContent}
              </Link>
            ) : (
              <div key={destination.name} className={`block ${cardClass}`}>
                {cardContent}
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          STATEMENT
      ========================================================= */}
      <section className="border-y border-ink/10 bg-[#fafafa]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                Travel with Mayura
              </p>

              <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
                Every destination
                <br />
                tells a story.
              </h2>
            </div>

            <p className="max-w-2xl text-sm leading-8 text-ink/60 sm:text-base">
              Whether you are looking for a relaxing beach escape, a refreshing
              mountain retreat, or a journey through history and culture,
              Mayura Holidays brings together destinations and experiences
              worth remembering.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}
      <section className="bg-ink px-5 py-20 text-white sm:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Start exploring
          </p>

          <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl lg:text-5xl">
            Find your next getaway.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
            Browse our curated holiday packages and start planning your next
            journey with Mayura Holidays.
          </p>

          <Link
            href="/packages"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/20"
          >
            Explore Packages
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}