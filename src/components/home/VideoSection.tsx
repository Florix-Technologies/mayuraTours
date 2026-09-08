"use client";

import { useRef, useState } from "react";

export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function handlePlay() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.controls = true;
    video.play();
    setPlaying(true);
  }

  return (
    <section id="video-section" aria-label="Experience our tours" className="relative overflow-hidden bg-ink py-16 text-white sm:py-20">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 70% 50%, rgba(229,0,126,.15) 0%, transparent 70%)" }}
      />
      <div className="relative z-10 mx-auto max-w-(--container-width) px-5 sm:px-10">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div className="max-w-125">
            <span className="mb-3 block text-[11px] font-bold tracking-[0.22em] text-sky uppercase">
              Feel the Journey
            </span>
            <h2 className="mb-5 text-[clamp(28px,3.6vw,46px)] leading-[1.1] font-extrabold tracking-tight">
              Real trips. Real memories.
            </h2>
            <p className="mb-8 text-[15.5px] leading-[1.72] font-light text-white/75">
              From the crashing waves of Goa&apos;s Calangute beach to the silent mist of Ooty&apos;s Doddabetta ridge —
              every Mayura journey is crafted for those who seek authentic India.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#packages"
                className="inline-flex items-center rounded-full bg-accent py-1.5 pr-1.5 pl-6 font-bold text-white shadow-[0_22px_46px_-18px_rgba(229,0,126,0.95)] transition-transform hover:-translate-y-0.5"
              >
                <span className="pr-4 text-[15px]">Browse packages</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-navy)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </a>
              <a href="#contact" className="border-b border-white/40 pb-0.5 text-sm font-semibold text-white/80 transition-colors hover:text-white">
                Get a custom quote →
              </a>
            </div>
          </div>

          <div>
            <div className="relative aspect-16/10 overflow-hidden rounded-2xl shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]">
              <video
                ref={videoRef}
                muted
                loop
                playsInline
                preload="metadata"
                poster="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1000&q=80&auto=format&fit=crop"
                className="absolute inset-0 h-full w-full object-cover"
              >
                <source src="/video/western-ghats-aerial.mp4" type="video/mp4" />
              </video>
              {!playing && (
                <button
                  onClick={handlePlay}
                  aria-label="Play video with sound"
                  className="absolute inset-0 flex items-center justify-center bg-black/35 transition-colors hover:bg-black/20"
                >
                  <span className="flex h-18 w-18 items-center justify-center rounded-full bg-accent shadow-[0_0_0_16px_rgba(229,0,126,0.22)] transition-transform hover:scale-110">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </span>
                </button>
              )}
            </div>
            <p className="mt-3 text-center text-xs text-white/45">
              ▶ Real footage: the Western Ghats routes our coaches run every week
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
