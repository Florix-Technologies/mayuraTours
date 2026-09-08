"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { heroExperiences } from "@/lib/data/hero-experiences";
import { packages } from "@/lib/data/packages";
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
  const canPlayVideo = useMediaQuery("(min-width: 1px)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const nextLayerId = useRef(1);
  const cleanupTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sceneStackRef = useRef<HTMLDivElement>(null);
  // Ignores new switchTo calls until the current one has visually settled. Without
  // this, spamming the nav arrows faster than a transition's ~1s fade could start a
  // second transition on top of the first before it finished clearing the screen.
  const transitionLock = useRef(false);
  const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  

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
      if (next === current || transitionLock.current) return;

      pendingSwitch.current?.cancel();
      pendingSwitch.current = null;
      transitionLock.current = true;
      if (lockTimer.current) clearTimeout(lockTimer.current);
      lockTimer.current = setTimeout(() => {
        transitionLock.current = false;
      }, TRANSITION_MS + 150);

      function commit(backSlot: Slot) {
        setCurrent(next);

        // Cards / title track — bounded to the outgoing layer plus the incoming one.
        // Without this cap, clicking the nav arrows faster than a transition's cleanup
        // timer (~1s) stacks a 3rd/4th full-screen layer on top of the still-animating
        // ones, which is what "overlapping during transition" looks like.
        const id = nextLayerId.current++;
        setLayers((prev) => [...prev.slice(-1), { id, expIndex: next }]);
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
    <section id="hero" className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-ink sm:h-screen sm:min-h-[640px]">
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
                        muted
                        loop
                        playsInline
                        // No native `autoPlay`: with both slots mounted, it made the browser
                        // decode both videos independently on load, on top of this component's
                        // own play() calls. Playback is driven entirely by those calls instead.
                        // `preload="auto"` on both slots (clips are 0.7–4MB now) keeps the
                        // "next" one fully buffered before its turn, so commit() below never
                        // has to wait on the readiness gate.
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

          {/* Cinematic colour-grade tint — a faint brand navy/accent duotone wash.
              Plain alpha, not mix-blend-mode: blend modes force the browser off the
              fast compositor path, which stacked with an animating video and its own
              zoom/crossfade transforms was the main source of scroll/transition jank. */}
          <div
            className="pointer-events-none absolute inset-0 z-5"
            style={{
              background:
                "linear-gradient(150deg, rgba(11,42,107,0.22) 0%, rgba(229,0,126,0.05) 50%, rgba(4,16,42,0.25) 100%)",
            }}
          />
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
            const pkg = packages.find((p) => p.slug === exp.packageSlug);
            const metaSub = pkg?.tags?.[0] ? pkg.tags[0].toUpperCase() : "";
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
              <div
                key={layer.id}
                className={`absolute inset-0 transition-opacity duration-[820ms] ${
                  isExiting ? "pointer-events-none opacity-0" : "opacity-100"
                }`}
                style={{ zIndex: idx + 10 }}
              >
                <div className="relative flex h-full flex-col justify-end px-5 pt-28 pb-36 max-[350px]:pb-24 sm:justify-center sm:px-8 sm:pt-0 sm:pb-0 lg:px-14">
                  <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:gap-4">
                    {/* Copy — left ~46% */}
                    
                    <div className="hidden min-w-0 sm:block lg:w-[46%]">

  {/* Small text (tablet/desktop) */}
  <div className="mb-3 hidden overflow-hidden sm:block">
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

  {/* Mobile badge + trip meta */}
  <div
    className={`${titleClass} mb-4 flex items-center gap-3 sm:hidden`}
    style={{ animationDelay: "0ms" }}
  >
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-ink/50 py-1.5 pr-3.5 pl-3 backdrop-blur-md">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white" aria-hidden="true">
        <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
      </svg>
      <span className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-white/90">
        {exp.tag.replace("✦ ", "")}
      </span>
    </span>
    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky">
      {metaSub}
    </span>
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
    className={`${titleClass} font-display mb-2.5 text-[clamp(36px,10vw,58px)] leading-[0.9] font-extrabold tracking-tight text-white uppercase [text-shadow:0_3px_16px_rgba(0,0,0,0.55)] sm:text-[clamp(42px,6.4vw,96px)] sm:leading-[0.88]`}
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


  {/* Short description (tablet/desktop) */}
  <div className="mb-2 hidden overflow-hidden sm:block">
    <p
      className={`${titleClass} max-w-[420px] text-[15px] leading-[1.4] font-medium text-sky`}
      style={{ animationDelay: "0ms" }}
    >
      {exp.headline}
    </p>
  </div>


  {/* Longer description — overflow-hidden wrapper clips the slide so it can't bleed
      across the screen into the next layer's space while animating. */}
  <div className="hero-description mb-4 overflow-hidden sm:mb-5">
    <p
      className={`${titleClass} w-full max-w-[400px] text-[14px] leading-[1.55] font-normal text-white/85 sm:text-[13.5px] sm:leading-[1.6] sm:text-white/75`}
      style={{ animationDelay: isExiting ? "40ms" : "180ms" }}
    >
      {exp.description}
    </p>
  </div>


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
      className="inline-flex items-center rounded-full bg-accent px-6 py-3 text-sm font-bold text-white shadow-[0_16px_30px_-12px_rgba(229,0,126,0.9)] transition-all duration-300 hover:scale-[1.03] hover:bg-white sm:gap-3 sm:px-5 sm:py-2.5 sm:text-ink sm:shadow-none sm:hover:bg-white"
    >
      <span className="sm:hidden">Book now</span>
      <span className="hidden sm:inline">Explore Packages</span>
      <span className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink sm:hidden">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      </span>
      <svg className="hidden sm:block" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    </a>
  </div>

  {/* Mobile price */}
  <div className="mt-1 sm:hidden">
    <span className="block text-[9px] font-semibold uppercase tracking-[0.24em] text-white/55">
      Starting from
    </span>
    <div className="flex items-baseline gap-1.5">
      <span className="font-display text-[26px] leading-none font-extrabold text-white">
        {pkg?.price}
      </span>
      {pkg?.priceUnit ? (
        <span className="text-[11px] font-medium text-white/70">{pkg.priceUnit}</span>
      ) : null}
    </div>
  </div>

</div>

                    {/* Destination card track — cards physically travel in/out, not a fixed-position crossfade.
                        [container-type:inline-size] lives HERE (not on the whole panel) so the cqw units
                        below size cards relative to their own ~46%-wide zone, not the full hero width. */}
                    <div className="mt-1 hidden items-end gap-3 [container-type:inline-size] sm:flex lg:mt-0 lg:w-[46%] lg:justify-end lg:gap-3.5">
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
                  <div className="flex min-h-0 flex-1 flex-col justify-end pb-5 max-[350px]:pb-2 sm:hidden">
                    <div className="mb-4 flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-[10px] font-bold tracking-[0.18em] text-white uppercase backdrop-blur-md">
                        <span className="text-sm leading-none text-white">✦</span>
                        {exp.tag.replace("✦ ", "")}
                      </span>
                      <span className="text-[11px] font-bold tracking-[0.18em] text-sky uppercase">
                        {pkg?.tags[0] ?? "Curated journey"}
                      </span>
                    </div>

                    <h1 className="font-display max-w-[11ch] break-words text-[clamp(38px,11vw,58px)] leading-[0.86] font-extrabold tracking-tight text-white uppercase [text-shadow:0_3px_18px_rgba(0,0,0,0.6)]">
                      {pkg?.name.split(" + ")[0] ?? exp.category.split(" ")[0]}
                    </h1>
                    <p className="mt-4 max-w-[34ch] text-[15px] leading-[1.48] text-white/85 max-[350px]:hidden">
                      {pkg?.description ?? exp.description}
                    </p>

                    <a
                      href="#packages"
                      className="mt-5 inline-flex w-fit items-center gap-4 rounded-full bg-accent py-2 pl-6 pr-2 text-base font-bold text-white shadow-[0_18px_34px_-14px_rgba(229,0,126,0.95)] max-[350px]:mt-3"
                    >
                      Book now
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-navy">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M5 12h14" />
                          <path d="m13 6 6 6-6 6" />
                        </svg>
                      </span>
                    </a>

                    <div className="mt-6 max-[350px]:mt-3">
                      <span className="block text-[10px] font-bold tracking-[0.24em] text-white/60 uppercase">Starting from</span>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="font-display text-[34px] leading-none font-extrabold text-white">{pkg?.price ?? "On request"}</span>
                        {pkg?.priceUnit && <span className="text-sm font-semibold text-sky">{pkg.priceUnit}</span>}
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2 max-[350px]:mt-3">
                      {(pkg?.tags ?? exp.destinations.map((destination) => destination.name)).map((tag) => (
                        <span key={tag} className="rounded-full border border-white/25 bg-ink/35 px-3.5 py-2 text-[11px] font-medium text-white/90 backdrop-blur-md max-[350px]:px-2.5 max-[350px]:py-1.5">
                          {tag}
                        </span>
                      ))}
                    </div>
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

        {/* Tablet nav — category pills + prev/next, grouped into one column so they
            stack with a fixed gap instead of two independently-positioned overlays
            that could drift apart or collide with the copy column above them.
            Desktop (lg+) relies on the dot rail instead; mobile gets its own pair below.
            Rendered once here as global chrome — previously duplicated inside the
            per-layer loop, so every transition briefly showed overlapping copies. */}
        <div className="absolute inset-x-5 bottom-20 z-20 hidden flex-col items-center gap-3 sm:flex lg:hidden">
          <div className="flex w-full gap-1.5 overflow-x-auto">
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
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setDirection("prev");
                switchTo(current - 1);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/20 text-white opacity-60 backdrop-blur-md transition-all duration-300 hover:border-white/80 hover:bg-white/15"
              aria-label="Previous category"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M8 5l7 7-7 7" />
                <path d="M13 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile prev / next navigation */}
        <div className="absolute bottom-20 left-5 z-20 flex items-center gap-2 sm:hidden">
          <button
            type="button"
            onClick={() => {
              setDirection("prev");
              switchTo(current - 1);
            }}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/15"
            aria-label="Previous category"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => {
              setDirection("next");
              switchTo(current + 1);
            }}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/15"
            aria-label="Next category"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
