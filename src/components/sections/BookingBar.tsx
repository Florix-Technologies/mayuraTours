"use client";

import { useEffect, useRef, useState } from "react";
import { packages } from "@/lib/data/packages";

const TRAVELLER_OPTIONS = ["1 Person", "2 People", "3–5 People", "6–10 People", "Group (10+)"];

export default function BookingBar() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  const [away, setAway] = useState(false);
  const bookTop = useRef(0);
  const lastY = useRef(0);

  useEffect(() => {
    function measure() {
      if (!wrapRef.current) return;
      bookTop.current = wrapRef.current.getBoundingClientRect().top + window.scrollY;
    }
    measure();

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y > bookTop.current - 74) {
          setStuck(true);
          const goingDown = y > lastY.current + 4;
          const goingUp = y < lastY.current - 4;
          if (goingDown && y > bookTop.current + 220) setAway(true);
          else if (goingUp) setAway(false);
        } else {
          setStuck(false);
          setAway(false);
        }
        lastY.current = y;
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, []);

  function goToContact() {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div ref={wrapRef} className="relative z-50 -mt-9 sm:-mt-12">
      <div
        className={
          stuck
            ? `fixed inset-x-0 top-[74px] z-50 px-3 transition-transform duration-300 sm:px-10 ${
                away ? "pointer-events-none -translate-y-[160%] opacity-0" : "translate-y-0 opacity-100"
              }`
            : ""
        }
      >
        <div
          className={`mx-auto grid max-w-(--container-width) grid-cols-2 rounded-2xl bg-white shadow-[0_30px_70px_-32px_rgba(8,33,76,0.55)] sm:grid-cols-[repeat(3,minmax(0,1fr))_auto] ${
            stuck ? "rounded-[10px] shadow-[0_18px_44px_-22px_rgba(8,33,76,0.6)]" : ""
          }`}
        >
          <label className={`flex flex-col gap-1.5 border-r border-line ${stuck ? "px-4 py-3" : "px-5 py-5"}`}>
            <span className="text-[10px] font-bold tracking-[0.18em] text-accent uppercase">Destination</span>
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="10" r="3" />
                <path d="M12 2a8 8 0 0 1 8 8c0 5.25-8 13-8 13S4 15.25 4 10a8 8 0 0 1 8-8z" />
              </svg>
              <select
                aria-label="Choose destination"
                className="w-full cursor-pointer border-none bg-transparent text-base font-medium text-ink outline-none"
              >
                {packages.map((pkg) => (
                  <option key={pkg.slug}>{pkg.name}</option>
                ))}
              </select>
            </span>
          </label>

          <label className={`flex flex-col gap-1.5 border-r border-line ${stuck ? "px-4 py-3" : "px-5 py-5"}`}>
            <span className="text-[10px] font-bold tracking-[0.18em] text-accent uppercase">Travel Date</span>
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <input
                type="date"
                aria-label="Select travel date"
                className="w-full cursor-pointer border-none bg-transparent text-base text-slate outline-none"
              />
            </span>
          </label>

          <label className={`hidden flex-col gap-1.5 border-r border-line sm:flex ${stuck ? "px-4 py-3" : "px-5 py-5"}`}>
            <span className="text-[10px] font-bold tracking-[0.18em] text-accent uppercase">Travellers</span>
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <select
                aria-label="Select number of travellers"
                className="w-full cursor-pointer border-none bg-transparent text-base font-medium text-ink outline-none"
              >
                {TRAVELLER_OPTIONS.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </span>
          </label>

          <div className="col-span-2 flex items-center p-3 sm:col-span-1">
            <button
              onClick={goToContact}
              className={`inline-flex w-full items-center justify-center gap-2.5 rounded-[10px] bg-linear-to-r from-blue to-navy px-8 py-4 text-[14.5px] font-bold whitespace-nowrap text-white transition-all hover:-translate-y-0.5 hover:bg-none hover:bg-accent sm:w-auto ${
                stuck ? "py-3.5" : ""
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              Search Packages
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
