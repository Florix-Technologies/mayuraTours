"use client";

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
    <section id="fleet" ref={sectionRef} className="relative flex h-[470px] items-center overflow-hidden sm:h-[540px]">
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
}
