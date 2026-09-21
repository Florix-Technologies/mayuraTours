"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp, ArrowRight, Clock3, MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import PackageCard from "./PackageCard";
import { packages, type TourPackage } from "@/lib/data/packages";

type SortOption = "featured" | "price-low" | "price-high" | "duration";

function getDurationDays(pkg: TourPackage) {
  const durationTag = pkg.tags.find((tag) => /day|return/i.test(tag));
  const match = durationTag?.match(/(\d+)\s*Days?/i);
  return match ? Number(match[1]) : 1;
}

function getPrice(pkg: TourPackage) {
  const numericPrice = pkg.price.replace(/[^\d]/g, "");
  return numericPrice ? Number(numericPrice) : null;
}

function matchesDestination(pkg: TourPackage, destination: string) {
  if (destination === "all") return true;
  return pkg.name === destination;
}

export default function PackageListing() {
  const [query, setQuery] = useState("");
  const [destination, setDestination] = useState("all");
  const [duration, setDuration] = useState("all");
  const [price, setPrice] = useState("all");
  const [sort, setSort] = useState<SortOption>("featured");

  const filteredPackages = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = packages.filter((pkg) => {
      const searchableText = [pkg.name, pkg.badge, pkg.description, ...pkg.tags].join(" ").toLowerCase();
      const packagePrice = getPrice(pkg);
      const matchesSearch = !normalizedQuery || searchableText.includes(normalizedQuery);
      const matchesDuration = duration === "all" || getDurationDays(pkg) <= Number(duration);
      const matchesPrice =
        price === "all" ||
        (packagePrice !== null &&
          (price === "under-10000" ? packagePrice < 10000 : price === "10000-20000" ? packagePrice <= 20000 : packagePrice > 20000));
      return matchesSearch && matchesDestination(pkg, destination) && matchesDuration && matchesPrice;
    });

    return [...filtered].sort((first, second) => {
      if (sort === "price-low") return (getPrice(first) ?? Number.POSITIVE_INFINITY) - (getPrice(second) ?? Number.POSITIVE_INFINITY);
      if (sort === "price-high") return (getPrice(second) ?? -1) - (getPrice(first) ?? -1);
      if (sort === "duration") return getDurationDays(first) - getDurationDays(second);
      return packages.indexOf(first) - packages.indexOf(second);
    });
  }, [destination, duration, price, query, sort]);

  const hasFilters = query || destination !== "all" || duration !== "all" || price !== "all";

  function clearFilters() {
    setQuery("");
    setDestination("all");
    setDuration("all");
    setPrice("all");
    setSort("featured");
  }

  return (
    <main>
      <section className="relative overflow-hidden bg-ink px-5 pt-34 pb-24 text-white sm:px-10 sm:pt-40 sm:pb-30">
        <div className="absolute inset-0 opacity-100" style={{ background: "linear-gradient(120deg, rgba(11,42,107,.95), transparent 55%), url('https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=2200&auto=format&fit=crop') center/cover" }} />
        <div className="absolute inset-0 bg-linear-to-b from-ink/20 via-ink/35 to-ink" />
        <div className="relative mx-auto max-w-(--container-width)">
          <div className="max-w-2xl">
            <span className="mb-4 block text-[11px] font-bold tracking-[0.24em] text-sky uppercase">Curated journeys from Bengaluru</span>
            <h1 className="font-display text-[clamp(42px,7vw,84px)] leading-[0.98] font-bold tracking-[-0.04em]">Go somewhere worth remembering.</h1>
            <p className="mt-6 max-w-xl text-[15px] leading-[1.8] text-white/72 sm:text-lg">
              Thoughtfully planned holidays with comfortable stays, smooth transport and the places that make a journey feel like yours.
            </p>
          </div>
          <a href="#package-results" className="mt-9 inline-flex items-center gap-3 text-sm font-bold text-white transition-colors hover:text-sky">
            Explore the collection <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section id="package-results" className="scroll-mt-8 px-5 py-16 sm:px-10 sm:py-24">
        <div className="mx-auto max-w-(--container-width)">
          <div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <span className="mb-3 block text-[11px] font-bold tracking-[0.22em] text-accent-ink uppercase">Find your next escape</span>
              <h2 className="font-display text-[clamp(32px,4vw,52px)] leading-none font-bold tracking-[-0.03em]">The Mayura collection</h2>
              <p className="mt-4 max-w-xl text-[15px] leading-[1.7] text-slate">Browse our current journeys and narrow the list by the details that matter to you.</p>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-accent shadow-sm"><MapPin size={16} aria-hidden="true" /></span>
              {filteredPackages.length} {filteredPackages.length === 1 ? "journey" : "journeys"}
            </div>
          </div>

          <div className="mb-12 rounded-2xl border border-line bg-white p-4 shadow-[0_18px_50px_-35px_rgba(4,16,42,.5)] sm:p-5">
            <div className="grid gap-3 lg:grid-cols-[minmax(240px,1.5fr)_repeat(3,minmax(150px,1fr))_minmax(170px,auto)]">
              <label className="relative block">
                <span className="sr-only">Search packages</span>
                <Search size={17} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate" aria-hidden="true" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search destinations or experiences" className="h-12 w-full rounded-xl border border-line bg-paper pr-4 pl-11 text-sm text-ink outline-none transition-colors placeholder:text-slate/70 focus:border-accent" />
              </label>
              <label className="relative">
                <span className="sr-only">Filter by destination</span>
                <select value={destination} onChange={(event) => setDestination(event.target.value)} className="h-12 w-full appearance-none rounded-xl border border-line bg-paper px-4 text-sm text-ink outline-none focus:border-accent">
                  <option value="all">All destinations</option>
                  {packages.map((pkg) => <option key={pkg.slug} value={pkg.name}>{pkg.name}</option>)}
                </select>
                <MapPin size={15} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-slate" aria-hidden="true" />
              </label>
              <label className="relative">
                <span className="sr-only">Filter by duration</span>
                <select value={duration} onChange={(event) => setDuration(event.target.value)} className="h-12 w-full appearance-none rounded-xl border border-line bg-paper px-4 text-sm text-ink outline-none focus:border-accent">
                  <option value="all">Any duration</option><option value="3">Up to 3 days</option><option value="4">Up to 4 days</option><option value="7">Up to 7 days</option>
                </select>
                <Clock3 size={15} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-slate" aria-hidden="true" />
              </label>
              <label className="relative">
                <span className="sr-only">Filter by price</span>
                <select value={price} onChange={(event) => setPrice(event.target.value)} className="h-12 w-full appearance-none rounded-xl border border-line bg-paper px-4 text-sm text-ink outline-none focus:border-accent">
                  <option value="all">Any price</option><option value="under-10000">Under ₹10,000</option><option value="10000-20000">₹10,000 – ₹20,000</option><option value="over-20000">Over ₹20,000</option>
                </select>
                <SlidersHorizontal size={15} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-slate" aria-hidden="true" />
              </label>
              <label className="relative">
                <span className="sr-only">Sort packages</span>
                <select value={sort} onChange={(event) => setSort(event.target.value as SortOption)} className="h-12 w-full appearance-none rounded-xl border border-line bg-paper px-4 text-sm text-ink outline-none focus:border-accent">
                  <option value="featured">Featured first</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="duration">Shortest first</option>
                </select>
                <ArrowDownUp size={15} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-slate" aria-hidden="true" />
              </label>
            </div>
            {hasFilters && (
              <button type="button" onClick={clearFilters} className="mt-4 inline-flex items-center gap-2 text-xs font-bold tracking-[0.08em] text-accent-ink uppercase hover:text-navy">
                <X size={14} aria-hidden="true" /> Clear filters
              </button>
            )}
          </div>

          {filteredPackages.length > 0 ? (
            <div className="flex flex-col gap-8">
              {filteredPackages.map((pkg, index) => (
                <PackageCard
                  key={pkg.slug}
                  pkg={pkg}
                  delay={(index % 2) * 100}
                  showDetails
                  editorial
                  compact
                  reverse={index % 2 === 1}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-16 text-center">
              <h3 className="font-display text-2xl font-bold">No journeys match those filters.</h3>
              <p className="mt-2 text-sm text-slate">Try widening your search or clearing the filters.</p>
              <button type="button" onClick={clearFilters} className="mt-6 rounded-full bg-navy px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-accent">Show all packages</button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}