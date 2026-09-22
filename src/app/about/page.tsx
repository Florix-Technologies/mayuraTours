import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import AnimatedStat from "@/components/ui/AnimatedStat";
import { business, telHref, yearsInBusiness } from "@/lib/data/business";
import { stats, trustCards, trustBadges } from "@/lib/data/stats";
import { galleryImages } from "@/lib/data/gallery";
import {
  ArrowRight,
  BadgeCheck,
  Bus,
  Star,
  Trophy,
  ShieldCheck,
  Headset,
  Route,
  BadgeIndianRupee,
  MapPin,
  Check,
  Phone,
} from "lucide-react";

const roundedYears = Math.floor(yearsInBusiness() / 5) * 5;

/** Existing project imagery, re-served at the higher widths these large
 * editorial placements need (the shared source lists were sized for small
 * thumbnails). */
const aboutImages = {
  hero: "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?q=80&w=1974&auto=format&fit=crop",
  whoWeAre:
    "https://images.unsplash.com/photo-1665376620694-fc0c4bab7294?q=80&w=1400&auto=format&fit=crop",
  story:
    "https://images.unsplash.com/photo-1683665446527-0bfa0d7a8822?q=80&w=1400&auto=format&fit=crop",
  featured:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1600&auto=format&fit=crop",
};

const CARD_ICON: Record<string, React.ElementType> = {
  trophy: Trophy,
  bus: Bus,
  badge: BadgeCheck,
  star: Star,
};

const BADGE_ICON: Record<string, React.ElementType> = {
  secure: ShieldCheck,
  support: Headset,
  itinerary: Route,
  cost: BadgeIndianRupee,
};

const HERO_FACTS = [
  `Since ${business.foundedYear}`,
  "Gandhi Nagar, Bengaluru",
  business.credentials[0],
  "Own AC Sleeper Fleet",
];

export const metadata: Metadata = {
  title: "About Us",
  description: `${business.legalName} — a Bengaluru-based travel company operating since ${business.foundedYear}. Own fleet, in-house itineraries and dependable tours across South & Central India.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const ownFleet = trustCards.find((c) => c.icon === "bus")!;
  const licensed = trustCards.find((c) => c.icon === "badge")!;

  return (
    <main>
      {/* SECTION 01 — ABOUT HERO / WHO WE ARE */}
      <section className="relative overflow-hidden bg-ink px-5 pt-34 pb-20 text-white sm:px-10 sm:pt-40 sm:pb-24">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `linear-gradient(120deg, rgba(4,16,42,.95) 0%, rgba(11,42,107,.72) 52%, rgba(4,16,42,.35) 100%), url('${aboutImages.hero}') center/cover`,
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-ink/10 via-ink/30 to-ink/75" aria-hidden="true" />

        <div className="relative mx-auto max-w-(--container-width)">
          <Reveal className="max-w-3xl">
            <span className="mb-4 block text-[11px] font-bold tracking-[0.24em] text-sky uppercase">
              About Mayura
            </span>
            <h1 className="font-display text-[clamp(38px,6vw,74px)] leading-[1.02] font-bold tracking-[-0.035em]">
              Dependable journeys, crafted in Bengaluru since {business.foundedYear}.
            </h1>
            <p className="mt-6 max-w-xl text-[15px] leading-[1.8] text-white/72 sm:text-lg">
              {business.legalName} is an established Karnataka tour operator — one of the
              state's longest-running. We plan, own and run our own holidays so every
              journey is comfortable, well-organised and free of surprises.
            </p>
          </Reveal>

          <Reveal delay={140} className="mt-10 flex flex-wrap gap-2.5">
            {HERO_FACTS.map((fact) => (
              <span
                key={fact}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[12.5px] font-semibold text-white/85 backdrop-blur-sm"
              >
                <Check size={13} className="text-sky" aria-hidden="true" />
                {fact}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      {/* SECTION 02 — WHO WE ARE */}
      <section className="px-5 py-16 sm:px-10 sm:py-26">
        <div className="mx-auto grid max-w-(--container-width) items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <Reveal>
            <span className="mb-3 block text-[11px] font-bold tracking-[0.22em] text-accent-ink uppercase">
              Who We Are
            </span>
            <h2 className="text-[clamp(30px,3.4vw,44px)] leading-[1.06] font-extrabold tracking-tight text-ink">
              A Bengaluru travel company built on doing the basics brilliantly.
            </h2>
            <p className="mt-5 max-w-[52ch] text-[15px] leading-[1.85] text-slate">
              {business.legalName} operates from {business.address.line1},{" "}
              {business.address.city}. For over {roundedYears} years we have planned and run
              holidays across South and Central India — Goa beaches, Nilgiri hill stations,
              Kerala backwaters and Karnataka's heritage circuits among them.
            </p>
            <p className="mt-4 max-w-[52ch] text-[15px] leading-[1.85] text-slate">
              We are not a listings page or a middleman. We own and operate our fleet, plan our
              itineraries in-house, and stay accountable from the first enquiry to the final
              drop-off. That is what makes a Mayura journey dependable.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <div className="flex items-center gap-2.5 text-sm font-semibold text-navy">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/8 text-accent">
                  <MapPin size={16} aria-hidden="true" />
                </span>
                {business.address.city}, Karnataka
              </div>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-navy">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/8 text-accent">
                  <BadgeCheck size={16} aria-hidden="true" />
                </span>
                {business.credentials[0]}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120} className="relative">
            <div className="relative aspect-4/3 overflow-hidden rounded-3xl shadow-[0_34px_70px_-40px_rgba(8,33,76,0.6)] sm:aspect-3/2">
              <Image
                src={aboutImages.whoWeAre}
                alt="Mysore Palace illuminated at night — a Karnataka heritage landmark"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-5 rounded-2xl border border-line bg-white px-5 py-4 shadow-[0_20px_50px_-30px_rgba(8,33,76,0.6)] sm:left-8">
              <span className="block font-display text-3xl font-extrabold tracking-tight text-navy">
                {roundedYears}+
              </span>
              <span className="text-[12px] font-medium text-slate">years of travel expertise</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SECTION 03 — OUR STORY */}
      <section className="bg-[#F7FAFE] px-5 py-16 sm:px-10 sm:py-26">
        <div className="mx-auto grid max-w-(--container-width) items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <Reveal className="relative order-2 lg:order-1">
            <div className="relative aspect-4/3 overflow-hidden rounded-3xl shadow-[0_34px_70px_-40px_rgba(8,33,76,0.6)] sm:aspect-3/2">
              <Image
                src={aboutImages.story}
                alt="Misty Coorg coffee plantations in the Western Ghats"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={120} className="order-1 lg:order-2">
            <span className="mb-3 block text-[11px] font-bold tracking-[0.22em] text-accent-ink uppercase">
              Our Story
            </span>
            <h2 className="text-[clamp(30px,3.4vw,44px)] leading-[1.06] font-extrabold tracking-tight text-ink">
              From Gandhi Nagar to every corner of the South.
            </h2>
            <p className="mt-5 max-w-[52ch] text-[15px] leading-[1.85] text-slate">
              Mayura began in {business.foundedYear} as a small Bengaluru tour operation with a
              simple belief — that a holiday should be comfortable, well-planned and free of
              hidden costs. That belief has not changed as we have grown.
            </p>
            <p className="mt-4 max-w-[52ch] text-[15px] leading-[1.85] text-slate">
              Today we are registered with Karnataka Tourism and listed on{" "}
              {business.bookingPlatforms.filter((p) => p !== "Direct Booking").join(", ")}. We
              remain family-run, locally rooted, and personally answerable for every trip we
              operate.
            </p>

            <div className="mt-8 flex flex-wrap gap-x-3 gap-y-3">
              {business.bookingPlatforms
                .filter((p) => p !== "Direct Booking")
                .map((platform) => (
                  <span
                    key={platform}
                    className="rounded-full border border-line bg-white px-4 py-2 text-[12.5px] font-semibold text-navy"
                  >
                    {platform}
                  </span>
                ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* SECTION 04 — WHY CHOOSE MAYURA */}
      <section className="px-5 py-16 sm:px-10 sm:py-26">
        <div className="mx-auto max-w-(--container-width)">
          <Reveal className="mb-11 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="mb-3 block text-[11px] font-bold tracking-[0.22em] text-accent-ink uppercase">
                Why Choose Mayura
              </span>
              <h2 className="max-w-[16ch] text-[clamp(30px,3.4vw,44px)] leading-[1.06] font-extrabold tracking-tight text-ink">
                You should be able to trust the trip before you board.
              </h2>
            </div>
            <p className="max-w-[42ch] text-[15px] leading-[1.8] text-slate">
              Every promise we make is backed by something concrete — vehicles we own, a licence
              we hold, and terms we put in writing.
            </p>
          </Reveal>

          {/* Asymmetric feature pair — one dark, one light */}
          <div className="grid gap-5 lg:grid-cols-3">
            <Reveal className="relative overflow-hidden rounded-3xl bg-linear-140 from-navy to-ink to-62% px-7 py-9 text-white sm:px-9 sm:py-10 lg:col-span-2">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 -right-20 h-64 w-64 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(229,0,126,.4), transparent 68%)" }}
              />
              <div className="relative flex h-full flex-col justify-between gap-8 sm:flex-row sm:items-end">
                <div className="max-w-[34ch]">
                  <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/12 bg-white/8">
                    {(() => {
                      const Icon = CARD_ICON[ownFleet.icon];
                      return <Icon size={26} strokeWidth={1.7} className="text-sky" />;
                    })()}
                  </span>
                  <span className="block text-[12px] font-bold tracking-[0.18em] text-sky uppercase">
                    {ownFleet.stat}
                  </span>
                  <h3 className="mt-1.5 text-2xl font-extrabold tracking-tight">
                    {ownFleet.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-[1.75] text-white/72">
                    {ownFleet.description}
                  </p>
                </div>
                <div className="flex shrink-0 gap-6 sm:flex-col sm:gap-4 sm:text-right">
                  <div>
                    <b className="block font-display text-3xl font-extrabold tracking-tight">24/7</b>
                    <span className="text-[11.5px] text-white/60">Travel support</span>
                  </div>
                  <div>
                    <b className="block font-display text-3xl font-extrabold tracking-tight">4.4★</b>
                    <span className="text-[11.5px] text-white/60">Avg. rating</span>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120} className="flex flex-col gap-4 rounded-3xl border border-accent/40 bg-white px-7 py-9 sm:px-8 sm:py-10">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/20 bg-accent/5 text-accent">
                {(() => {
                  const Icon = CARD_ICON[licensed.icon];
                  return <Icon size={26} strokeWidth={1.7} />;
                })()}
              </span>
              <span className="mt-2 block text-[12px] font-bold tracking-[0.18em] text-accent-ink uppercase">
                {licensed.stat}
              </span>
              <h3 className="text-2xl font-extrabold tracking-tight text-navy">
                {licensed.title}
              </h3>
              <p className="text-[14px] leading-[1.75] text-slate">{licensed.description}</p>
            </Reveal>
          </div>

          {/* Hairline reason row — deliberately not a card grid */}
          <Reveal
            delay={80}
            className="mt-5 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4"
          >
            {trustBadges.map((badge) => {
              const Icon = BADGE_ICON[badge.icon];
              return (
                <div
                  key={badge.title}
                  className="group flex flex-col gap-2.5 bg-white px-6 py-7 transition-colors duration-300 hover:bg-[#F9FBFE]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/8 text-accent">
                    <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <strong className="text-[15px] leading-5 font-bold text-ink">
                    {badge.title}
                  </strong>
                  <span className="text-[12.5px] leading-5 text-slate">{badge.description}</span>
                </div>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* SECTION 05 — ACHIEVEMENTS / STATS */}
      <section className="bg-ink px-5 py-16 text-white sm:px-10 sm:py-24">
        <div className="mx-auto max-w-(--container-width)">
          <Reveal className="max-w-2xl">
            <span className="mb-3 block text-[11px] font-bold tracking-[0.22em] text-sky uppercase">
              By the Numbers
            </span>
            <h2 className="text-[clamp(30px,3.4vw,44px)] leading-[1.06] font-extrabold tracking-tight">
              Achievements built on trust.
            </h2>
            <p className="mt-4 max-w-[48ch] text-[15px] leading-[1.8] text-white/65">
              Numbers we are proud of — earned one journey at a time, not advertised into
              existence.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 sm:gap-x-0 sm:gap-y-0">
            {stats.map((stat, i) => (
              <Reveal
                key={stat.label}
                delay={i * 90}
                className={`flex flex-col gap-2.5 sm:px-8 ${
                  i > 0 ? "sm:border-l sm:border-white/12" : "sm:pl-0"
                }`}
              >
                <span className="font-display text-[clamp(38px,5vw,60px)] leading-none font-extrabold tracking-tight text-white tabular-nums">
                  <AnimatedStat to={stat.to} suffix={stat.suffix} />
                </span>
                <span className="whitespace-pre-line text-[13.5px] leading-[1.5] text-white/60">
                  {stat.label}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 06 — VISUAL CONTENT */}
      <section className="px-5 py-16 sm:px-10 sm:py-26">
        <div className="mx-auto max-w-(--container-width)">
          <Reveal className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="mb-3 block text-[11px] font-bold tracking-[0.22em] text-accent-ink uppercase">
                Moments From The Road
              </span>
              <h2 className="max-w-[18ch] text-[clamp(30px,3.4vw,44px)] leading-[1.06] font-extrabold tracking-tight text-ink">
                The places our travellers remember.
              </h2>
            </div>
            <p className="max-w-[38ch] text-[15px] leading-[1.8] text-slate">
              A few frames from the journeys we run every week across the South.
            </p>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr]">
            <Reveal className="relative aspect-4/3 overflow-hidden rounded-3xl sm:aspect-16/9 lg:aspect-auto lg:min-h-130">
              <Image
                src={aboutImages.featured}
                alt="Scenic mountain landscape on a Mayura tour"
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/60 to-transparent" />
              <div className="absolute right-5 bottom-5 left-5">
                <span className="text-[11px] font-bold tracking-[0.2em] text-sky uppercase">
                  Featured Journey
                </span>
                <p className="mt-1.5 max-w-2xl text-[15px] leading-[1.6] text-white/90">
                  Every Mayura itinerary is planned in-house — comfortable stays, smooth
                  transport and the places that make a journey feel like yours.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
              {[galleryImages[0], galleryImages[7]].map((img, i) => (
                <Reveal
                  key={img.src}
                  delay={120 + i * 100}
                  className="group relative aspect-4/3 overflow-hidden rounded-3xl lg:aspect-auto lg:h-full"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 1024px) 40vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 07 — FINAL CTA */}
      <section className="px-5 pb-16 sm:px-10 sm:pb-26">
        <div className="mx-auto max-w-(--container-width)">
          <Reveal className="relative overflow-hidden rounded-3xl bg-linear-140 from-navy to-ink to-62% px-6 py-12 text-white sm:px-12 sm:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-40 -right-32 h-96 w-96 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(229,0,126,.42), transparent 68%)" }}
            />
            <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <span className="mb-3 block text-[11px] font-bold tracking-[0.22em] text-sky uppercase">
                  Start Planning
                </span>
                <h2 className="text-[clamp(30px,3.8vw,48px)] leading-[1.06] font-extrabold tracking-tight">
                  Ready to plan your next journey?
                </h2>
                <p className="mt-4 max-w-[46ch] leading-[1.75] font-light text-white/78">
                  Browse our current collection of tours, or speak to our team for a
                  personalised itinerary — with hotel names, coach details and all-inclusive
                  pricing.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
                <Link
                  href="/packages"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-white transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-accent-light"
                >
                  Explore Packages
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
                <a
                  href={telHref(business.phone)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm font-bold text-white transition-[background-color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/10"
                >
                  <Phone size={16} aria-hidden="true" />
                  Talk to Us
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
