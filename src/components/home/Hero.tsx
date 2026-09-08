"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { heroExperiences } from "@/lib/data/hero-experiences";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

/** ~4.8s on screen per category, ~900ms cinematic crossfade — shared by background and cards; title runs a touch faster. */
const DISPLAY_MS = 4800;
const TRANSITION_MS = 900;


/** Never block a transition on a slow video forever — fall back and proceed anyway. */
const VIDEO_READY_TIMEOUT_MS = 1200;
/** All source clips are 24-30fps (checked on disk, none are 50/60fps) — 0.75x is close to
 * the lowest that footage in this range can go before judder becomes visible. */
const VIDEO_PLAYBACK_RATE = 0.75;

type Layer = { id: number; expIndex: number };
type Slot = 0 | 1;

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [layers, setLayers] = useState<Layer[]>([{ id: 0, expIndex: 0 }]);
  const [enteringId, setEnteringId] = useState<number | null>(null);
  const [videoFront, setVideoFront] = useState<Slot>(0);
  const canPlayVideo = useMediaQuery("(min-width: 768px)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const nextLayerId = useRef(1);
  const cleanupTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sceneStackRef = useRef<HTMLDivElement>(null);
  

  // Two permanently-mounted <video> elements. Never recreated per transition —
  // only their `src` is reassigned, so the browser can keep buffering the
  // "next" one throughout the current category's whole display window.
  const videoRefs = useRef<[HTMLVideoElement | null, HTMLVideoElement | null]>([null, null]);
  const slotContent = useRef<[number, number]>([0, 1]);
  const pendingSwitch = useRef<{ cancel: () => void } | null>(null);

  const setVideoRef = (slot: Slot) => (el: HTMLVideoElement | null) => {
    videoRefs.current[slot] = el;
  };

  const ensureSlotLoaded = useCallback((slot: Slot, expIndex: number) => {
    const el = videoRefs.current[slot];
    if (!el || slotContent.current[slot] === expIndex) return;
    slotContent.current[slot] = expIndex;
    const exp = heroExperiences[expIndex];
    el.src = exp.video;
    el.poster = exp.backgroundImage;
    // `load()` resets playbackRate, so it must be (re)applied after, not before.
    el.load();
    el.playbackRate = VIDEO_PLAYBACK_RATE;
  }, []);

  /**
   * Cards, title and background all advance together as one coordinated
   * transition. The background video crossfade is gated on readiness — the
   * incoming video must already be playing before anything starts moving, so
   * there is never a blank/frozen frame mid-transition.
   */
  const switchTo = useCallback(
    (i: number) => {
      const next = (i + heroExperiences.length) % heroExperiences.length;
      if (next === current) return;

      pendingSwitch.current?.cancel();
      pendingSwitch.current = null;

      function commit(backSlot: Slot) {
        setCurrent(next);

        // Cards / title track — unchanged.
        const id = nextLayerId.current++;
        setLayers((prev) => [...prev, { id, expIndex: next }]);
        setEnteringId(null);
        if (reduceMotion) {
          setEnteringId(id);
        } else {
          requestAnimationFrame(() => requestAnimationFrame(() => setEnteringId(id)));
        }
        if (cleanupTimer.current) clearTimeout(cleanupTimer.current);
        cleanupTimer.current = setTimeout(
          () => setLayers((prev) => prev.filter((l) => l.id === id)),
          TRANSITION_MS + 150
        );

        // Background video — start it moving, then reveal it in the same tick.
        if (canPlayVideo) {
          const enteringVideo = videoRefs.current[backSlot];
          if (enteringVideo) {
            enteringVideo.playbackRate = VIDEO_PLAYBACK_RATE;
            enteringVideo.play().catch(() => {});
          }
          setVideoFront(backSlot);
          const hiddenSlot: Slot = backSlot === 0 ? 1 : 0;
          setTimeout(() => videoRefs.current[hiddenSlot]?.pause(), TRANSITION_MS + 200);
        }
      }

      if (!canPlayVideo) {
        commit(0);
        return;
      }

      const backSlot: Slot = videoFront === 0 ? 1 : 0;
      ensureSlotLoaded(backSlot, next);
      const el = videoRefs.current[backSlot];

      if (!el || el.readyState >= 3) {
        commit(backSlot);
        return;
      }

      let settled = false;
      const timeoutId = setTimeout(onReady, VIDEO_READY_TIMEOUT_MS);
      function onReady() {
        if (settled) return;
        settled = true;
        el?.removeEventListener("canplay", onReady);
        clearTimeout(timeoutId);
        commit(backSlot);
      }
      el.addEventListener("canplay", onReady, { once: true });
      pendingSwitch.current = {
        cancel: () => {
          settled = true;
          el.removeEventListener("canplay", onReady);
          clearTimeout(timeoutId);
        },
      };
    },
    [current, canPlayVideo, videoFront, reduceMotion, ensureSlotLoaded]
  );

  // Start the first video playing as soon as it's able to; apply the cinematic
  // playback rate to both permanently-mounted elements from the start.
  useEffect(() => {
    if (!canPlayVideo) return;
    videoRefs.current.forEach((el) => {
      if (el) el.playbackRate = VIDEO_PLAYBACK_RATE;
    });
    videoRefs.current[0]?.play().catch(() => {});
  }, [canPlayVideo]);

  // As soon as a category settles, start preloading the *next* one into the
  // back slot immediately — it gets the whole ~5s display window to buffer.
  useEffect(() => {
    if (!canPlayVideo) return;
    const backSlot: Slot = videoFront === 0 ? 1 : 0;
    ensureSlotLoaded(backSlot, (current + 1) % heroExperiences.length);
  }, [current, videoFront, canPlayVideo, ensureSlotLoaded]);

  useEffect(() => {
    const id = setInterval(() => switchTo(current + 1), DISPLAY_MS);
    return () => clearInterval(id);
  }, [current, switchTo]);

  useEffect(() => {
    if (reduceMotion) return;
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const vh = window.innerHeight;
        if (y < vh && sceneStackRef.current) {
          sceneStackRef.current.style.opacity = String(Math.max(0, 1 - y / (vh * 0.75)));
        }
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduceMotion]);

  return (
    <section id="hero" className="relative h-screen min-h-[640px] w-full overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <div ref={sceneStackRef} className="absolute inset-0">
          {/* Background — two permanently-mounted videos on desktop/tablet (data-friendly on
              mobile, which gets a plain image crossfade instead), independent of the card/title track. */}
          {canPlayVideo ? (
            <div className="absolute inset-0">
              {([0, 1] as const).map((slot) => (
                <div
                  key={slot}
                  className={`hero-layer absolute inset-0 overflow-hidden ${slot === videoFront ? "hero-layer-visible" : ""}`}
                  style={{ zIndex: slot === videoFront ? 1 : 0 }}
                >
                  <div className={slot === videoFront && !reduceMotion ? "absolute inset-0 hero-bg-settle" : "absolute inset-0"}>
                    <div className={`absolute inset-0 overflow-hidden ${reduceMotion ? "" : "animate-slow-zoom"}`}>
                      <video
                        ref={setVideoRef(slot)}
                        src={heroExperiences[slot].video}
                        poster={heroExperiences[slot].backgroundImage}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        onPause={(e) => {
                          // Safety net: if the visible video ever stalls/pauses on its own
                          // (buffering, a browser quirk), resume it rather than leave a frozen frame.
                          if (slot === videoFront) e.currentTarget.play().catch(() => {});
                        }}
                        className="absolute inset-0 h-full w-full object-cover object-center"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (

            <div className="absolute inset-0">
              {layers.map((layer, idx) => {
                const exp = heroExperiences[layer.expIndex];
                const isNewest = idx === layers.length - 1;
                const visible = layers.length === 1 || !isNewest || layer.id === enteringId;
                return (
                  <div
                    key={layer.id}
                    className={`hero-layer absolute inset-0 overflow-hidden ${visible ? "hero-layer-visible" : ""}`}
                    style={{ zIndex: idx }}
                  >
                    <div className={`absolute inset-0 overflow-hidden ${reduceMotion ? "" : "animate-slow-zoom"}`}>
                      <Image
                        src={exp.backgroundImage}
                        alt={exp.backgroundImageAlt}
                        fill
                        priority={layer.id === 0}
                        sizes="96vw"
                        quality={90}
                        className="object-cover object-center"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Localized text-readability tint — only the left side where copy sits darkens;
              the right side (cards, video) stays bright, not a flat dark scrim over everything. */}
          <div
            className="pointer-events-none absolute inset-0 z-5"
            style={{
             background:
              "linear-gradient(90deg, rgba(3,20,35,0.68) 0%, rgba(3,20,35,0.45) 35%, rgba(3,20,35,0.16) 60%, rgba(3,20,35,0) 78%)",
            }}
          />
          {/* Faint bottom vignette — keeps mobile-stacked content and the panel's lower edge readable */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "linear-gradient(180deg, rgba(3,20,35,0) 70%, rgba(3,20,35,.4) 100%)",
            }}
          />

          {/* Content — cards/title track, unchanged: still crossfades per category via `layers`. */}
          {layers.map((layer, idx) => {
            const exp = heroExperiences[layer.expIndex];
            const isNewest = idx === layers.length - 1;
            const isExiting = !isNewest && layers.length > 1;
            const titleClass = isExiting ? "hero-title-exit" : "hero-title-enter";
            const cardClass = isExiting
                 ? direction === "prev"
                 ? "hero-card-exit-prev"
                 : "hero-card-exit"
                 : direction === "prev"
                 ? "hero-card-enter-prev"
                 : "hero-card-enter";

            return (
              <div key={layer.id} className="absolute inset-0" style={{ zIndex: idx + 10 }}>
                <div className="relative flex h-full flex-col justify-end px-5 pb-8 sm:justify-center sm:px-8 sm:pb-0 lg:px-14">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-4">
                    {/* Copy — left ~46% */}
                    
                    <div className="min-w-0 lg:w-[46%]">

  {/* Small text */}
  <div className="mb-3 overflow-hidden">
    <div
      className={`${titleClass} flex items-center gap-2.5`}
      style={{ animationDelay: "0ms" }}
    >
      <span className="text-[11px] font-bold tracking-[0.1em] text-accent tabular-nums">
        {String(layer.expIndex + 1).padStart(2, "0")}
      </span>

      <span className="h-px w-4 bg-white/40" />

      <span className="text-[11px] font-semibold tracking-[0.16em] text-white/70 uppercase">
        {exp.tag.replace("✦ ", "")}
      </span>
    </div>
  </div>


  {/* Main heading */}
  <div className=" overflow-hidden">
    {/*<h1
      className={`${titleClass} font-display mb-2.5 text-[clamp(42px,6.4vw,96px)] leading-[0.96] font-extrabold tracking-tight text-white uppercase [text-shadow:0_3px_16px_rgba(0,0,0,0.55)]`}
      style={{ animationDelay: "0ms" }}
    >
      {exp.category}
    </h1>*/}
      <h1
    className={`${titleClass} font-display mb-2.5 text-[clamp(42px,6.4vw,96px)] leading-[0.88] font-extrabold tracking-tight text-white uppercase [text-shadow:0_3px_16px_rgba(0,0,0,0.55)]`}
    style={{ animationDelay: "0ms" }}
  >
    <span>
      {exp.category.split(" ").slice(0, -1).join(" ")}
    </span>{" "}
    <span
      className="font-display font-extrabold text-transparent"
      style={{
        WebkitTextStroke: "1.5px rgba(255,255,255,0.9)",
        textShadow: "none",
      }}
    >
      {exp.category.split(" ").slice(-1)}
    </span>
  </h1>
  </div>


  {/* Short description */}
  <div className="mb-2 overflow-hidden">
    <p
      className={`${titleClass} max-w-[420px] text-[15px] leading-[1.4] font-medium text-sky`}
      style={{ animationDelay: "0ms" }}
    >
      {exp.headline}
    </p>
  </div>


  {/* Longer description — unchanged */}
  <p
    className={`${titleClass} hero-description mb-5 max-w-[400px] text-[13.5px] leading-[1.6] font-normal text-white/75`}
    style={{ animationDelay: isExiting ? "40ms" : "180ms" }}
  >
    {exp.description}
  </p>


  {/* CTA — does NOT animate */}
  
<div
  className="flex flex-wrap items-center gap-4"
  style={{
    animation: "none",
    transform: "none",
  }}
>
    <a
      href="#packages"
      className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-ink transition-all duration-300 hover:scale-[1.03] hover:bg-white"
    >
      Explore Packages

      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    </a>
  </div>

</div>

                    {/* Destination card track — cards physically travel in/out, not a fixed-position crossfade.
                        [container-type:inline-size] lives HERE (not on the whole panel) so the cqw units
                        below size cards relative to their own ~46%-wide zone, not the full hero width. */}
                    <div className="mt-2 flex items-end gap-3 [container-type:inline-size] lg:mt-0 lg:w-[46%] lg:justify-end lg:gap-3.5">
                      {exp.destinations.map((d, i) => (
                        <div
                          key={d.name}
                          className={`${cardClass} group relative min-w-0 overflow-hidden rounded-xl shadow-[0_18px_40px_-16px_rgba(0,0,0,0.65)]`}
                          style={{
                            animationDelay: isExiting ? `${i * 40}ms` : `${180 + i * 70}ms`,
                            // Portrait cards — height noticeably greater than width, matching the reference.
                            width:
                              i === 0
                                ? "clamp(210px, 40cqw, 400px)"
                                : i === 1
                                  ? "clamp(182px, 34cqw, 345px)"
                                  : "clamp(156px, 29cqw, 295px)",
                            height:
                              i === 0
                                ? "clamp(340px, 67cqw, 650px)"
                                : i === 1
                                  ? "clamp(292px, 57cqw, 560px)"
                                  : "clamp(248px, 49cqw, 480px)",
                            flexShrink: 1,
                            marginBottom: i === 0 ? 0 : i === 1 ? 30 : 56,
                          }}
                        >
                          <Image
                            src={d.image}
                            alt={d.imageAlt}
                            fill
                            sizes="400px"
                            quality={90}
                            className="object-cover object-[50%_50%] transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/0 to-transparent" />
                          <div className="absolute inset-x-0 bottom-0 px-3.5 py-4">
                            <span className="block text-[11px] font-semibold tracking-[0.1em] text-sky uppercase">
                              {d.categoryLabel}
                            </span>
                            <span className="block text-[16px] leading-tight font-bold break-words text-white">{d.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
<div className="absolute bottom-20 left-1/2 z-[100] flex -translate-x-1/2 gap-2">
  <button
    type="button"
    onClick={() => {
  setDirection("prev");
  switchTo(current - 1);
}}
    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/20 text-white opacity-60 backdrop-blur-md transition-all duration-300  hover:border-white/80 hover:bg-white/15"
    aria-label="Previous category"
  >
  <svg
  width="22"
  height="22"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="1.7"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <path d="M16 5l-7 7 7 7" />
  <path d="M11 5l-7 7 7 7" />
</svg>
  </button>

  <button
    type="button"
    onClick={() => {
  setDirection("next");
  switchTo(current + 1);
}}
    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/20 text-white opacity-60 backdrop-blur-md transition-all duration-300 hover:border-white/80 hover:bg-white/15"
    aria-label="Next category"
  >
  <svg
  width="22"
  height="22"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="1.7"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <path d="M8 5l7 7-7 7" />
  <path d="M13 5l7 7-7 7" />
</svg>
  </button>
</div>
                  {/* Compact category pills — mobile and tablet (desktop switches to the dot rail); part of
                      normal content flow, never fights the fixed WhatsApp button */}
                  <div className="mt-4 flex gap-1.5 overflow-x-auto lg:hidden">
                    {heroExperiences.map((navExp, i) => (
                      <button
                        key={navExp.slug}
                        onClick={() => switchTo(i)}
                        aria-current={i === current}
                        className={`flex-shrink-0 rounded-full border px-3 py-1.5 text-[10.5px] font-semibold whitespace-nowrap transition-colors ${
                          i === current
                            ? "border-accent bg-accent text-white"
                            : "border-white/25 bg-white/10 text-white/75 backdrop-blur-sm"
                        }`}
                      >
                        {navExp.category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Global chrome — sits above the crossfading scenes, updates instantly with `current` ── */}

        {/* Compact numbered dot rail (replaces a text category list) — desktop only, once cards sit side-by-side */}
        <div className="absolute inset-y-0 left-3 z-20 hidden flex-col items-center justify-center gap-3 lg:flex lg:left-5">
          {heroExperiences.map((exp, i) => (
            <button
              key={exp.slug}
              onClick={() => switchTo(i)}
              aria-label={exp.category}
              aria-current={i === current}
              className="flex items-center justify-center p-1"
            >
              <span
                className={`rounded-full transition-all duration-500 ${
                  i === current ? "h-5 w-1.5 bg-accent" : "h-1.5 w-1.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Prev / next — compact, bottom-right */}
        <div className="absolute right-4 bottom-4 z-20 hidden items-center gap-2 sm:flex lg:right-6">
          <button
            onClick={() => switchTo(current - 1)}
            aria-label="Previous experience"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <span className="px-1 text-[11px] font-semibold text-white/70 tabular-nums">
            {String(current + 1).padStart(2, "0")} / {String(heroExperiences.length).padStart(2, "0")}
          </span>
          <button
            onClick={() => switchTo(current + 1)}
            aria-label="Next experience"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
