"use client";

import { useState } from "react";
import Image from "next/image";
import { fleetAmenities } from "@/lib/data/fleet";
import Reveal from "@/components/ui/Reveal";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const fleetImages = [
  {
    src: "/fleet/Mayura1.jpeg",
    alt: "Mayura Holidays coach exterior",
    label: "Our Coaches",
  },
  {
    src: "/fleet/Mayura2.jpeg",
    alt: "Mayura Holidays coach",
    label: "Mayura Fleet",
  },
  {
    src: "/fleet/Mayura3.jpeg",
    alt: "Mayura Holidays bus interior",
    label: "Comfortable Interiors",
  },
  {
    src: "/fleet/Mayura4.jpeg",
    alt: "Mayura Holidays coach",
    label: "Travel in Comfort",
  },
  {
    src: "/fleet/Mayura5.jpeg",
    alt: "Mayura Holidays coach",
    label: "Our Fleet",
  },
  {
    src: "/fleet/Mayura6.jpeg",
    alt: "Mayura Holidays coach",
    label: "On the Road",
  },
  {
    src: "/fleet/Mayura7.jpeg",
    alt: "Mayura Holidays coach",
    label: "Built for the Journey",
  },
  {
    src: "/fleet/Mayura8.jpeg",
    alt: "Mayura Holidays coach",
    label: "A Closer Look",
  },
  {
    src: "/fleet/Mayura9.jpeg",
    alt: "Mayura Holidays coach",
    label: "Mayura Holidays",
  },
];

export default function FleetSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextImage = () => {
    setActiveIndex((current) =>
      current === fleetImages.length - 1 ? 0 : current + 1,
    );
  };

  const previousImage = () => {
    setActiveIndex((current) =>
      current === 0 ? fleetImages.length - 1 : current - 1,
    );
  };

  return (
    <section
      id="fleet"
      className="scroll-mt-24 overflow-hidden bg-[#F7FAFE] px-5 py-16 sm:px-10 sm:py-24"
    >
      <div className="mx-auto max-w-(--container-width)">
        {/* Section Heading */}
        <Reveal className="mb-10 max-w-2xl">
          <span className="block text-[11px] font-bold tracking-[0.22em] text-accent-ink uppercase">
            Our Fleet
          </span>

          <h2 className="mt-3 text-[clamp(32px,4vw,50px)] leading-[1.05] font-extrabold tracking-tight text-ink">
            Travel comfortably with Mayura.
          </h2>

          <p className="mt-5 max-w-[58ch] text-[15px] leading-[1.8] text-slate">
            Our fleet is an important part of the Mayura experience. Every
            journey is supported by comfortable coaches and a travel
            experience designed around reliability, safety and comfort.
          </p>
        </Reveal>

        {/* Main Fleet Feature */}
        <Reveal
          delay={80}
          className="grid overflow-hidden rounded-[28px] bg-white shadow-[0_24px_70px_-35px_rgba(4,16,42,0.28)] lg:grid-cols-[1.25fr_0.75fr]"
        >
          {/* Main Image */}
          <div className="group relative min-h-[360px] sm:min-h-[480px]">
            <Image
              src="/fleet/Mayura0.jpg"
              alt="Mayura Holidays coach"
              fill
              priority={false}
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

            <div className="absolute right-6 bottom-6 left-6 sm:right-8 sm:bottom-8 sm:left-8">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold tracking-[0.18em] text-white uppercase backdrop-blur-md">
                Mayura Holidays
              </span>

              <h3 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
                Our own fleet
              </h3>
            </div>
          </div>

          {/* Fleet Information */}
          <div className="flex flex-col justify-center px-6 py-9 sm:px-9 sm:py-10 lg:px-10">
            <span className="text-[11px] font-bold tracking-[0.2em] text-accent-ink uppercase">
              Built for the journey
            </span>

            <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              Comfort from start to finish.
            </h3>

            <p className="mt-4 text-[14px] leading-[1.8] text-slate">
              Our coaches are maintained with the comfort and convenience of
              our travellers in mind, helping make every journey a smoother
              experience.
            </p>

            {/* Amenities */}
            <div className="mt-7 space-y-3">
              {fleetAmenities.slice(0, 4).map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-3 text-[13px] font-medium text-ink"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EEF5FF]">
                    <CheckCircle2
                      size={15}
                      className="text-accent-ink"
                      strokeWidth={2.2}
                    />
                  </span>

                  {amenity}
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="#contact"
              className="mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-accent py-1.5 pr-1.5 pl-6 text-sm font-bold text-white shadow-[0_22px_46px_-18px_rgba(229,0,126,0.95)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              <span>Enquire about travel</span>

              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-navy">
                <ArrowRight
                  size={18}
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              </span>
            </a>
          </div>
        </Reveal>

        {/* Fleet Photo Carousel */}
        <Reveal delay={120} className="mt-14">
          <div className="mb-5 flex items-end justify-between gap-5">
            <div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-accent-ink uppercase">
                A closer look
              </span>

              <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                Inside the Mayura fleet.
              </h3>
            </div>

            {/* Carousel Controls */}
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={previousImage}
                aria-label="Previous fleet image"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-navy transition-all hover:border-navy hover:bg-navy hover:text-white"
              >
                <ArrowLeft size={17} strokeWidth={2} />
              </button>

              <button
                type="button"
                onClick={nextImage}
                aria-label="Next fleet image"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-navy transition-all hover:border-navy hover:bg-navy hover:text-white"
              >
                <ArrowRight size={17} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Carousel */}
          <div className="relative overflow-hidden rounded-[24px]">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${activeIndex * 100}%)`,
              }}
            >
              {fleetImages.slice(1).map((image) => (
                <div
                  key={image.src}
                  className="relative min-w-full"
                >
                  <div className="relative h-[300px] sm:h-[430px]">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="100vw"
                      className="object-cover"
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                    <div className="absolute right-5 bottom-5 left-5 flex items-end justify-between gap-4 sm:right-7 sm:bottom-7 sm:left-7">
                      <div>
                        <span className="text-[10px] font-bold tracking-[0.18em] text-sky uppercase">
                          Mayura Fleet
                        </span>

                        <p className="mt-1 text-lg font-bold text-white sm:text-xl">
                          {image.label}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Footer */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-1.5">
              {fleetImages.slice(1).map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  aria-label={`Go to fleet image ${index + 2}`}
                  onClick={() => setActiveIndex(index + 1)}
                  className={`h-1.5 rounded-full transition-all ${
                    activeIndex === index + 1
                      ? "w-8 bg-accent"
                      : "w-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>

            <span className="text-[11px] font-bold tracking-[0.14em] text-slate">
              {String(activeIndex).padStart(2, "0")} /{" "}
              {String(fleetImages.length - 1).padStart(2, "0")}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}


{ /*"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { fleetAmenities, fleetBackgroundImage } from "@/lib/data/fleet";
import Reveal from "@/components/ui/Reveal";

export default function FleetSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const section = sectionRef.current;
        const bg = bgRef.current;
        if (section && bg) {
          const rect = section.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            bg.style.transform = `translate3d(0, ${(window.innerHeight - rect.top) * 0.055 - 30}px, 0)`;
          }
        }
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="fleet" ref={sectionRef} className="scroll-mt-24 relative flex h-[470px] items-center overflow-hidden sm:h-[540px]">
      <div ref={bgRef} className="absolute -inset-x-0 -inset-y-[14%] h-[128%] w-full">
        <Image
          src={fleetBackgroundImage.src}
          alt={fleetBackgroundImage.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(96deg, rgba(4,16,42,.95) 0%, rgba(4,16,42,.76) 34%, rgba(4,16,42,.16) 68%, rgba(4,16,42,.4) 100%)",
        }}
      />
      <Reveal className="relative z-[2] mx-auto w-full max-w-(--container-width) px-5 text-white sm:px-10">
        <span className="block text-[11px] font-bold tracking-[0.22em] text-sky uppercase">Our Fleet</span>
        <h2 className="my-3.5 max-w-[14ch] text-[clamp(30px,3.6vw,46px)] leading-[1.06] font-extrabold tracking-tight">
          Volvo &amp; Multi-Axle AC Sleeper Coaches
        </h2>
        <p className="max-w-[46ch] text-[15.5px] leading-[1.72] font-light text-white/85">
          Every journey on our own GPS-tracked fleet — Volvo, AC Sleeper, AC Semi-Sleeper and Seater coaches — all
          maintained to the highest safety standards. No contract buses. No surprises.
        </p>
        <div className="mt-6 flex flex-wrap gap-2.5">
          {fleetAmenities.map((amenity) => (
            <span
              key={amenity}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/28 bg-white/10 px-3.5 py-2 text-[12.5px] font-medium text-white/90 backdrop-blur-sm"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-sky)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              {amenity}
            </span>
          ))}
        </div>
        <a
          href="#contact"
          className="mt-7 inline-flex items-center rounded-full bg-accent py-1.5 pr-1.5 pl-7 shadow-[0_22px_46px_-18px_rgba(229,0,126,0.95)] transition-transform hover:-translate-y-0.5"
        >
          <span className="pr-5 text-base font-bold">Request a fleet quote</span>
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-navy)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </a>
      </Reveal>
    </section>
  );
}     */}
