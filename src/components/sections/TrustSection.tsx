import Reveal from "@/components/ui/Reveal";
import Image from "next/image";
import { business } from "@/lib/data/business";
import { trustBadges, trustCards } from "@/lib/data/stats";

//const CARD_EMOJI: Record<string, string> = { trophy: "🏆", bus: "🚌", badge: "📋", star: "⭐" };

import { Trophy,
  Bus,
  BadgeCheck,
  Star,
  ShieldCheck,
  Headset,
  Route,
  BadgeIndianRupee,
} from "lucide-react";

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

{/* const BADGE_EMOJI: Record<string, string> = {
  secure: "🏦",
  support: "📞",
  itinerary: "🗺️",
  cost: "💰",
  fleet: "🚌",
  license: "📋",
}; */}

const TINT: Record<string, string> = { green: "bg-[#E8FAF0]", blue: "bg-[#E8F0FA]", gold: "bg-[#FEF7E0]" };

const PLATFORM_LOGO: Record<string, string> = {
  RedBus: "/logo/redbus.svg",
  AbhiBus: "/logo/abhibus.svg",
  MakeMyTrip: "/logo/makemytrip.svg",
  EaseMyTrip: "/logo/easemytrip.svg",
  "Direct Booking": "/logo/mayura1.svg",
};

export default function TrustSection() {
  return (
    <section id="trust" className="scroll-mt-24 bg-[#F7FAFE] py-16 sm:py-26">
      <div className="mx-auto max-w-(--container-width) px-5 sm:px-10">
        <div className="mb-11 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="mb-3 block text-[11px] font-bold tracking-[0.22em] text-accent uppercase">
              Why Choose Us
            </span>
            <h2 className="text-[clamp(30px,3.4vw,44px)] leading-[1.06] font-extrabold tracking-tight text-ink">
              Trust built over 25+ years
            </h2>
            <p className="mt-4 max-w-[50ch] text-[15px] text-slate">
            {business.legalName} — Gandhi Nagar, Bengaluru&apos;s most recognised travel operator since 2000. Listed
            on {business.bookingPlatforms.filter((p) => p !== "Direct Booking").join(", ")}.
          </p>
          </div>
          
        </div>

        <div className="grid grid-cols-1 gap-5.5 sm:grid-cols-2 lg:grid-cols-4">
          {trustCards.map((card, i) => (
            <Reveal key={card.title} delay={i * 80} className="flex flex-col gap-2.5 rounded-2xl border-t-3 border-accent bg-white px-6.5 pt-7 pb-6.5 shadow-[0_16px_42px_-30px_rgba(8,33,76,0.5)]">

{/* New card icons from "lucide-react" */}
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/20 bg-accent/5">
  {(() => {
    const Icon = CARD_ICON[card.icon];

    return (
      <Icon
        size={27}
        strokeWidth={1.7}
        className="text-accent"
      />
    );
  })()}
</div>

              <b className="text-[38px] leading-none font-extrabold tracking-tight text-navy tabular-nums">
                {card.stat}
              </b>
              <h3 className="text-base font-bold">{card.title}</h3>
              <p className="text-[13.5px] leading-[1.6] text-slate">{card.description}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8.5 flex flex-col items-center justify-center gap-6 rounded-2xl bg-ink px-6 py-8 sm:gap-8 sm:px-10 sm:py-10 lg:flex-row lg:gap-14 lg:px-15 lg:py-12">
          <span className="shrink-0 text-center text-[13px] font-bold tracking-[0.15em] text-sky uppercase sm:text-[14px]">
            Book on these platforms
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5 sm:gap-x-12">
            {business.bookingPlatforms.map((platform) => (
              <span
                key={platform}
                className="flex flex-col items-center gap-1.5 whitespace-nowrap"
              >
                {PLATFORM_LOGO[platform] && (
                <Image
                  src={PLATFORM_LOGO[platform]}
                  alt={platform}
                  width={80}
                  height={32}
                   className={`w-auto object-contain ${
                   platform === "Direct Booking" ? "h-8 scale-160"  : "h-7"
                 }`}
                />

                )}
                  <span className="text-[14px] font-light text-white/75">
                    {platform}</span>
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-8 rounded-3xl border border-accent/50 bg-white px-7.5 py-9 sm:px-10 sm:py-10 lg:px-12 lg:py-11">
          
  {/* Section heading */}
  <div className="mb-8 text-center">
    <span className="text-[11px] font-bold tracking-[0.22em] text-accent uppercase">
      Travel With Confidence
    </span>

    <h3 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
      Everything You Need, Covered
    </h3>

    <p className="mx-auto mt-2 max-w-[55ch] text-sm leading-6 text-slate">
      From secure payments to reliable support, every detail of your journey is handled with care.
    </p>
  </div>

  {/* Trust badges */}
  <div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2">

    {trustBadges.map((badge) => (
      <div
        key={badge.title}
        className="group flex min-h-28 items-center gap-4 rounded-2xl border border-line bg-[#F9FBFE] px-5 py-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/25 hover:shadow-lg"
      >

        {/* Icon */}
        {/* Icon */}
<div
  className={`relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${TINT[badge.tint]} transition-transform duration-300 group-hover:scale-105`}
>
  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white bg-white shadow-sm">
    {(() => {
      const Icon = BADGE_ICON[badge.icon];

      return (
        <Icon
          size={24}
          strokeWidth={1.7}
          className="text-accent"
        />
      );
    })()}
  </div>
</div>
        {/* Text */}
        <div className="min-w-0">
          <strong className="block text-[15px] font-bold leading-5 text-ink">
            {badge.title}
          </strong>

          <span className="mt-1 block text-[12.5px] leading-5 text-slate">
            {badge.description}
          </span>
        </div>

      </div>
    ))}

  </div>
</Reveal>
      </div>
    </section>
  );
}
