"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { howItWorksSteps } from "@/lib/data/stats";

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    //<section className="py-16 sm:py-26">
    <section className="pt-16 pb-12 sm:pt-26 sm:pb-16">
      <div className="mx-auto max-w-(--container-width) px-5 sm:px-10">
        <div className="mb-11 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="mb-3 block text-[11px] font-bold tracking-[0.22em] text-accent uppercase">
              How It Works
            </span>
            <h2 className="text-[clamp(30px,3.4vw,44px)] leading-[1.06] font-extrabold tracking-tight text-ink">
              Book your dream trip in 3 easy steps
            </h2>
              <p className="mt-4 max-w-[40ch] text-[15px] text-slate">
            From inquiry to departure — we handle everything so you just show up and enjoy.
          </p>

          </div>
       
        </div>

        <div ref={ref} className="relative mt-5 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-8.5">
          <div className="absolute top-[70px] right-[8%] left-[8%] hidden h-0.5 bg-line sm:block" />
          <div
            className="absolute top-[70px] left-[8%] hidden h-0.5 bg-accent transition-[width] duration-[1400ms] ease-out sm:block"
            style={{ width: revealed ? "84%" : "0%", transitionDelay: "200ms" }}
          />
          {howItWorksSteps.map((step) => (
            <div key={step.number} className="relative flex flex-col items-center gap-3 text-center">
              <div className="mb-1 h-26 w-full overflow-hidden rounded-[10px]">
                <Image src={step.image} alt={step.imageAlt} width={400} height={104} className="h-full w-full object-cover" />
              </div>
              <div
                className={`relative z-[2] flex h-16.5 w-16.5 items-center justify-center rounded-full border-2 bg-white text-xl font-extrabold transition-all duration-500 ${
                  revealed ? "border-accent text-accent shadow-[0_0_0_8px_rgba(229,0,126,0.1)]" : "border-line text-navy"
                }`}
              >
                {step.number}
              </div>
              <h3 className="text-[19px] font-bold">{step.title}</h3>
              <p className="max-w-[30ch] text-sm text-slate">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
