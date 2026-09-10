"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import Image from "next/image";
import { heroExperiences } from "@/lib/data/hero-experiences";
import { packages } from "@/lib/data/packages";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { optimizedPoster } from "@/lib/optimized-poster";

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

/** Grow/lift duration for a hovered card coming forward in its own slot —
 * within the 400-600ms "premium, cinematic" range, matching the easing
 * already used for this Hero's own category-transition animations for a
 * consistent feel. */
const CARD_ACTIVE_MS = 520;
const CARD_ACTIVE_EASE = "cubic-bezier(0.22, 0.8, 0.28, 1)";
/** How much larger the hovered card grows. Anchored to its own bottom edge
 * (`transform-origin: 50% 100%` on the card itself) so its foot stays
 * planted in the row while it grows upward/outward — a deliberately modest,
 * in-place grow, not a takeover of the Hero. */
const CARD_ACTIVE_SCALE = 1.18;
/** Subtle upward lift layered on the scale, reinforcing "coming forward"
 * without the card ever leaving its slot in the row. */
const CARD_ACTIVE_LIFT = 12;

/** How far a receding card scales down and dims — deliberately more
 * pronounced than a subtle hover nudge, since it needs to read clearly as
 * "gone backward in depth", not just "slightly smaller". */
const CARD_RECEDE_SCALE = 0.8;
const CARD_RECEDE_OPACITY = 0.55;
const CARD_RECEDE_TY = 22;
const CARD_RECEDE_ROT = 3;
/** Minimum gap, in px, kept between a receded card's edge and the active
 * card's grown rect, and between two receded cards' edges — guarantees no
 * overlap regardless of viewport size. */
const CARD_RECEDE_MARGIN = 28;
/** Even a card that wouldn't otherwise overlap the active card still moves
 * at least this much, so all three cards visibly move together as one
 * system rather than only the ones that "need" to. */
const CARD_RECEDE_MIN_SHIFT = 36;

type ExpandTarget = { left: number; top: number; width: number; height: number; right: number; bottom: number };
type ReceideValues = { tx: number; ty: number; scale: number; rot: number };

/** The hovered card's own grown footprint, anchored to its bottom-center —
 * matches the `transform-origin: 50% 100%` used on the card itself, so it
 * grows upward and sideways from its resting spot rather than moving out of
 * the row. Shared with the sibling-recede math below so both always agree
 * on exactly how big, and where, the active card will land. */
function computeActiveTarget(neutralRect: DOMRect): ExpandTarget {
  const width = neutralRect.width * CARD_ACTIVE_SCALE;
  const height = neutralRect.height * CARD_ACTIVE_SCALE;
  const centerX = neutralRect.left + neutralRect.width / 2;
  const bottom = neutralRect.bottom;
  const left = centerX - width / 2;
  const top = bottom - height;
  return { left, top, width, height, right: left + width, bottom };
}

/**
 * Lays out every non-active card's recede transform as one system rather
 * than computing each in isolation — two cards each independently clearing
 * *only* the active card's grown footprint can still land on top of *each
 * other*. Direction-aware: a card that naturally sits to the left of the
 * active one recedes further left, one to the right recedes further right
 * — each pushed away from the active card's own center, never cascaded past
 * it to the opposite side (which is what let a middle card's active state
 * previously shove a *left* sibling out to the right, in turn shoving the
 * genuinely-right sibling far enough to clear the Hero's own edge).
 * Same-side cards are packed in their natural relative order, each
 * guaranteed clear of both the active card and its previously-placed
 * neighbor by `CARD_RECEDE_MARGIN`.
 *
 * `neutrals` must hold each card's *untransformed* layout rect (see
 * `slotNeutralRectRef`) — CSS transform offsets are always relative to an
 * element's untransformed box, so computing from anything else (e.g. a rect
 * already mid-recede from a previously active card) would compound drift
 * across rapid re-hovers.
 *
 * Left-recede is safe now that the active card grows in place rather than
 * to a much larger, Hero-centered target: the track lives entirely within
 * its own right-hand column, tens of pixels clear of the copy text even
 * after a modest left shift (verified against the actual Hero layout).
 */
function computeRecedeLayout(
  neutrals: Array<{ index: number; rect: DOMRect }>,
  activeTarget: ExpandTarget
): Record<number, ReceideValues> {
  const result: Record<number, ReceideValues> = {};
  const activeCenterX = (activeTarget.left + activeTarget.right) / 2;
  const rightSide = neutrals
    .filter((n) => n.rect.left + n.rect.width / 2 >= activeCenterX)
    .sort((a, b) => a.rect.left - b.rect.left);
  const leftSide = neutrals
    .filter((n) => n.rect.left + n.rect.width / 2 < activeCenterX)
    .sort((a, b) => b.rect.left - a.rect.left);

  let rightCursor = activeTarget.right + CARD_RECEDE_MARGIN;
  for (const { index, rect } of rightSide) {
    const scaledWidth = rect.width * CARD_RECEDE_SCALE;
    const naturalCenter = rect.left + rect.width / 2;
    const desiredCenter = Math.max(naturalCenter + CARD_RECEDE_MIN_SHIFT, rightCursor + scaledWidth / 2);
    result[index] = { tx: desiredCenter - naturalCenter, ty: CARD_RECEDE_TY, scale: CARD_RECEDE_SCALE, rot: CARD_RECEDE_ROT };
    rightCursor = desiredCenter + scaledWidth / 2 + CARD_RECEDE_MARGIN;
  }

  let leftCursor = activeTarget.left - CARD_RECEDE_MARGIN;
  for (const { index, rect } of leftSide) {
    const scaledWidth = rect.width * CARD_RECEDE_SCALE;
    const naturalCenter = rect.left + rect.width / 2;
    const desiredCenter = Math.min(naturalCenter - CARD_RECEDE_MIN_SHIFT, leftCursor - scaledWidth / 2);
    result[index] = { tx: desiredCenter - naturalCenter, ty: CARD_RECEDE_TY, scale: CARD_RECEDE_SCALE, rot: -CARD_RECEDE_ROT };
    leftCursor = desiredCenter - scaledWidth / 2 - CARD_RECEDE_MARGIN;
  }

  return result;
}

function pointInRect(el: HTMLElement | null, x: number, y: number) {
  if (!el) return false;
  const r = el.getBoundingClientRect();
  return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
}

/**
 * The card track's enter/exit animation is role-aware, not one shared move
 * for all three slots: slot 0 (the dominant, front-most card) gets the
 * `-front-` keyframes, which emphasize scale/depth (arrives from smaller,
 * pushes toward the viewer on the way out) so it visibly "comes forward" /
 * "gets pushed out" the way the back slots' lighter lateral slide alone
 * can't convey. Purely index-driven (slot 0 is always the dominant card,
 * whichever destination currently occupies it), so this needs no per-
 * destination logic and keeps working for any dynamic data.
 */
function getCardClass(slotIndex: number, isExiting: boolean, direction: "next" | "prev"): string {
  const role = slotIndex === 0 ? "front" : "";
  const base = role ? `hero-card-${role}-` : "hero-card-";
  const phase = isExiting ? "exit" : "enter";
  const suffix = direction === "prev" ? "-prev" : "";
  return `${base}${phase}${suffix}`;
}

export default function Hero() {
  // The very first category's poster is the Hero's LCP candidate — hint the
  // browser to fetch it at the highest priority immediately, before it would
  // otherwise be discovered. Only this one image, not every slide's poster.
  preload(optimizedPoster(heroExperiences[0].backgroundImage, 1920, 75), {
    as: "image",
    fetchPriority: "high",
  });

  const [current, setCurrent] = useState(0);
  const [layers, setLayers] = useState<Layer[]>([{ id: 0, expIndex: 0 }]);
  const [enteringId, setEnteringId] = useState<number | null>(null);
  const [videoFront, setVideoFront] = useState<Slot>(0);
  // Background video now plays at every breakpoint, using the same
  // object-cover/object-center treatment as desktop/tablet — that alone
  // keeps it correctly filled and centered at any screen size. The static-
  // image crossfade below the video branch is kept but currently unreachable
  // (canPlayVideo is now always true); it's the fastest path back to a
  // lighter mobile fallback if that's ever needed again.
  const canPlayVideo = true;
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [direction, setDirection] = useState<"next" | "prev">("next");
  // Top-center transport controls — real playback controls for the existing
  // background video, not decoration. Muted by default (autoplay requirement);
  // paused state is user-only, so the `onPause` safety-net below (which
  // resumes a video that stalled on its own) has to know to leave a
  // deliberate pause alone.
  const [videoMuted, setVideoMuted] = useState(true);
  const [videoPaused, setVideoPaused] = useState(false);

  const nextLayerId = useRef(1);
  const cleanupTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sceneStackRef = useRef<HTMLDivElement>(null);
  // Ignores new switchTo calls until the current one has visually settled. Without
  // this, spamming the nav arrows faster than a transition's ~1s fade could start a
  // second transition on top of the first before it finished clearing the screen.
  const transitionLock = useRef(false);
  const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hover-to-grow destination cards. The active card grows in place — via
  // transform, on the real card element itself — rather than a separate
  // overlay standing in for it, so there is always exactly one visual
  // representation of each card (no portal, no duplicate/ghost node). Which
  // card is active, plus a precomputed recede transform for every *other*
  // card in that same row, computed together so all three cards move as one
  // coordinated system.
  const [activeCard, setActiveCard] = useState<{
    index: number;
    expIndex: number;
    recede: Record<number, ReceideValues>;
  } | null>(null);
  // Mirrors `activeCard` synchronously for the refs-only code below
  // (`commit()` inside `switchTo`), which needs the current value without
  // depending on render timing or being added to that callback's own
  // dependency array.
  const activeCardRef = useRef<typeof activeCard>(null);
  const setActiveCardBoth = useCallback((value: typeof activeCard) => {
    activeCardRef.current = value;
    setActiveCard(value);
  }, []);
  // The active card's own outer slot element — its neutral (untransformed)
  // rect never moves, so it's a reliable "still hovering this card" check
  // throughout the grow animation. `activeInnerElRef` is that same card's
  // inner, transformed content element; its live rect (which DOES grow) is
  // checked too, so the pointer can drift into the visually-grown card
  // without triggering a premature close.
  const activeSlotOuterElRef = useRef<HTMLDivElement | null>(null);
  const activeInnerElRef = useRef<HTMLDivElement | null>(null);

  // Every card slot's *untransformed* layout rect, keyed by `${expIndex}-${index}`
  // — captured once, at mount, before any hover-driven transform is ever
  // applied. The recede math below needs this rather than a live
  // `getBoundingClientRect()`: if a card is currently receded (because a
  // different card is active) and the pointer jumps straight to it next,
  // its live rect would already reflect that recede transform — computing a
  // *new* recede from an already-transformed rect would compound drift over
  // repeated re-hovers. Transform offsets are always relative to an
  // element's neutral box regardless, so this is also simply the correct
  // basis, not just a convenient one.
  const slotNeutralRectRef = useRef<Map<string, DOMRect>>(new Map());
  // A single stable callback (identity never changes, so React attaches it
  // once per real mount rather than detaching/reattaching on every
  // re-render) shared across every card slot — which slot it's firing for
  // comes from the element's own `data-slot-key`, not a closure, precisely
  // so this can stay a single `useCallback(..., [])` instead of needing a
  // ref lookup keyed per slot during render (which is itself invalid: reading
  // a ref's `.current` must happen in an effect/handler, never in the render
  // body). Entries are intentionally never deleted on unmount — a slot's
  // neutral layout position for a given (category, index) is stable for as
  // long as the viewport doesn't resize, so a stale cached rect from an
  // earlier time that category was shown is still correct to reuse.
  const handleSlotRef = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;
    const key = el.dataset.slotKey;
    if (!key || slotNeutralRectRef.current.has(key)) return;
    slotNeutralRectRef.current.set(key, el.getBoundingClientRect());
  }, []);

  // Computes a fresh recede map for every other card in `expIndex`'s row,
  // relative to `index` becoming active — shared by both a fresh open and a
  // same-card re-entry.
  const computeReceedeMap = useCallback((index: number, expIndex: number) => {
    const activeNeutral = slotNeutralRectRef.current.get(`${expIndex}-${index}`);
    if (!activeNeutral) return {};
    const activeTarget = computeActiveTarget(activeNeutral);
    const neutrals: Array<{ index: number; rect: DOMRect }> = [];
    heroExperiences[expIndex].destinations.forEach((_, j) => {
      if (j === index) return;
      const neutral = slotNeutralRectRef.current.get(`${expIndex}-${j}`);
      if (neutral) neutrals.push({ index: j, rect: neutral });
    });
    return computeRecedeLayout(neutrals, activeTarget);
  }, []);

  // Plain CSS transitions (declared inline on the card itself, see the card
  // track JSX below) handle the shrink-back automatically once `activeCard`
  // clears — a transition mid-flight smoothly continues toward its new
  // target rather than jumping, so no imperative reverse/animation-state
  // bookkeeping is needed here.
  const closeExpanded = useCallback(() => {
    setActiveCardBoth(null);
  }, [setActiveCardBoth]);

  function handleSlotEnter(index: number, expIndex: number, el: HTMLDivElement) {
    if (reduceMotion) return;
    const prev = activeCardRef.current;
    if (prev && prev.index === index && prev.expIndex === expIndex) return;
    activeSlotOuterElRef.current = el;
    setActiveCardBoth({ index, expIndex, recede: computeReceedeMap(index, expIndex) });
  }

  // While a card is active, track the pointer directly against the live
  // rects of its outer slot and its (possibly still-growing) inner content
  // element on every move — not mouseenter/mouseleave pairing, which under
  // real, jittery mouse movement proved unreliable: rapid enter/leave pairs
  // could leave a card stuck mid-recede with no active card to show for it.
  // A geometric fact re-checked on every move can't desync the way a chain
  // of events can.
  useEffect(() => {
    if (!activeCard) return;
    function onPointerMove(e: PointerEvent) {
      const stillIn =
        pointInRect(activeSlotOuterElRef.current, e.clientX, e.clientY) ||
        pointInRect(activeInnerElRef.current, e.clientX, e.clientY);
      if (!stillIn) closeExpanded();
    }
    function onWindowLeave() {
      closeExpanded();
    }
    document.addEventListener("pointermove", onPointerMove);
    document.documentElement.addEventListener("mouseleave", onWindowLeave);
    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("mouseleave", onWindowLeave);
    };
  }, [activeCard, closeExpanded]);

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
    // Raw poster files are un-resized/un-recompressed 100-350KB JPEGs — a
    // `<video poster>` attribute only accepts a plain URL, so it can't use
    // `next/image` directly; route it through the same optimizer manually.
    el.poster = optimizedPoster(exp.backgroundImage, 1920, 75);
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
        // A category change is about to swap out the destination data
        // entirely — force-close any active card immediately rather than
        // waiting for the pointermove check to notice, so a transition can
        // never leave a card stuck mid-grow or mid-recede behind.
        if (activeCardRef.current) {
          setActiveCardBoth(null);
        }

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
    [current, canPlayVideo, videoFront, reduceMotion, ensureSlotLoaded, setActiveCardBoth]
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

  // `muted` on a <video> element doesn't reliably stay in sync via the JSX
  // attribute alone once the element has already mounted — set the property
  // imperatively on both permanently-mounted videos whenever the user
  // toggles sound.
  useEffect(() => {
    videoRefs.current.forEach((el) => {
      if (el) el.muted = videoMuted;
    });
  }, [videoMuted]);

  const toggleVideoPlayback = useCallback(() => {
    const el = videoRefs.current[videoFront];
    if (!el) return;
    if (videoPaused) {
      el.play().catch(() => {});
      setVideoPaused(false);
    } else {
      el.pause();
      setVideoPaused(true);
    }
  }, [videoFront, videoPaused]);

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
    <section
      id="hero"
      className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-ink sm:h-screen sm:min-h-[640px]"
    >
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
                        poster={optimizedPoster(heroExperiences[slot].backgroundImage, 1920, 75)}
                        muted={videoMuted}
                        loop
                        playsInline
                        // `fetchPriority` isn't a valid attribute on <video> per spec (only
                        // img/link/script) — the LCP hint for slot 0's poster instead comes
                        // from the `preload()` call above, which resolves to the same URL.
                        // No native `autoPlay`: with both slots mounted, it made the browser
                        // decode both videos independently on load, on top of this component's
                        // own play() calls. Playback is driven entirely by those calls instead.
                        // `preload="auto"` on both slots (clips are 0.7–4MB now) keeps the
                        // "next" one fully buffered before its turn, so commit() below never
                        // has to wait on the readiness gate.
                        preload="auto"
                        onPause={(e) => {
                          // Safety net: if the visible video ever stalls/pauses on its own
                          // (buffering, a browser quirk), resume it rather than leave a frozen
                          // frame — but never override a pause the user asked for via the
                          // top-center transport control.
                          if (slot === videoFront && !videoPaused) e.currentTarget.play().catch(() => {});
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
                        quality={75}
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
                "linear-gradient(150deg, rgba(11,42,107,0.3) 0%, rgba(229,0,126,0.07) 50%, rgba(4,16,42,0.32) 100%)",
            }}
          />
          {/* Localized text-readability tint — the left side (copy) darkens most, but this
              no longer bottoms out at fully transparent on the right: a bright, light-toned
              video frame (sand, sky, stone) could still wash out the card titles and the
              top-center transport controls over there, so a low flat floor (0.14) now
              carries all the way across instead of fading to 0 by 78%. */}
          <div
            className="pointer-events-none absolute inset-0 z-5"
            style={{
             background:
              "linear-gradient(90deg, rgba(3,20,35,0.78) 0%, rgba(3,20,35,0.55) 35%, rgba(3,20,35,0.3) 60%, rgba(3,20,35,0.14) 100%)",
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
      // text-white on the solid accent pink is what clears WCAG AA (4.5:1) —
      // the previous sm:text-ink combination measured 4.16:1. Kept white on
      // hover too (sm:hover:bg-white would otherwise leave white-on-white).
      className="inline-flex items-center rounded-full bg-accent px-6 py-3 text-sm font-bold text-white shadow-[0_16px_30px_-12px_rgba(229,0,126,0.9)] transition-all duration-300 hover:scale-[1.03] hover:bg-white hover:text-ink sm:gap-3 sm:px-5 sm:py-2.5 sm:shadow-none"
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

</div>

                    {/* Destination card DECK — three cards genuinely overlap/layer rather
                        than sitting side-by-side in a plain row: card 0 (front, highest
                        prominence) sits at the top; card 1 overlaps its trailing edge,
                        offset down; card 2 overlaps card 1 the same way, offset further
                        down and dimmed — a receded, "inactive" member of the stack until
                        it's hovered/becomes active. [container-type:inline-size] lives
                        HERE (not on the whole panel) so the cqw units below size cards
                        relative to their own ~46%-wide zone, not the full hero width. */}
                    <div className="mt-1 hidden items-start [container-type:inline-size] sm:flex lg:mt-0 lg:w-[46%] lg:justify-end">
                      {exp.destinations.map((d, i) => {
                        const isThisExpanded =
                          !!activeCard && activeCard.expIndex === layer.expIndex && activeCard.index === i;
                        // A different card in this same row being active pushes
                        // this one backward — driven by `activeCard`, cleared
                        // the instant the pointer leaves so the recede reverses
                        // in step with the active card's own shrink, not lagging
                        // behind it. The actual tx/ty/scale/rot are computed
                        // per-hover from real measured geometry (see
                        // `computeReceedeMap`), guaranteeing clearance from the
                        // active card's grown rect rather than guessing at fixed
                        // values.
                        const isReceding = !!activeCard && activeCard.expIndex === layer.expIndex && activeCard.index !== i;
                        const recede = isReceding ? activeCard.recede[i] : undefined;
                        // Image-box height only — this is the card's actual "normal
                        // size", unchanged from before. The title block above it adds
                        // to the slot's total rendered height on top of this, it does
                        // not shrink the image to make room.
                        const imageHeight =
                          i === 0
                            ? "clamp(340px, 67cqw, 650px)"
                            : i === 1
                              ? "clamp(292px, 57cqw, 560px)"
                              : "clamp(248px, 49cqw, 480px)";
                        // Deck stacking: card 0 sits highest and frontmost; each
                        // subsequent card is pulled left to overlap the previous
                        // one's trailing edge and pushed down, reading as a
                        // receding stack rather than a flat row. restZIndex keeps
                        // that front-to-back order at rest; hover/recede still
                        // override it (see zIndex below).
                        const restZIndex = i === 0 ? 3 : i === 1 ? 2 : 1;
                        // The back-most card reads as a lighter, inactive deck
                        // member until it becomes the hovered/active one.
                        const restOpacity = i === 2 ? 0.82 : 1;
                        return (
                          <div
                            key={d.name}
                            ref={handleSlotRef}
                            data-slot-key={`${layer.expIndex}-${i}`}
                            className="relative flex min-w-0 flex-col"
                            style={{
                              // Portrait cards — width noticeably narrower than height, matching the reference.
                              width:
                                i === 0
                                  ? "clamp(210px, 40cqw, 400px)"
                                  : i === 1
                                    ? "clamp(182px, 34cqw, 345px)"
                                    : "clamp(156px, 29cqw, 295px)",
                              flexShrink: 1,
                              // Deliberately a small sliver, not a deep overlap: the front
                              // card's higher z-index paints over *whatever* of a back
                              // card's box falls within this horizontal band, at *any* Y —
                              // including that back card's title row. A large negative
                              // margin here doesn't just overlap imagery, it visibly erases
                              // that many pixels of the neighboring title text (confirmed
                              // by screenshot: a -38px overlap ate roughly the first half of
                              // "Hampi"). Kept small enough to read as "layered deck edges
                              // touching" without swallowing legibility.
                              marginLeft: i === 0 ? 0 : i === 1 ? -14 : -12,
                              marginTop: i === 0 ? 0 : i === 1 ? 28 : 54,
                              // z-index has to live on this flex item, not the inner
                              // transform layer below — that's what actually governs
                              // stacking between the overlapping siblings at rest and
                              // during hover/recede.
                              zIndex: isThisExpanded ? 5 : isReceding ? 0 : restZIndex,
                            }}
                            onMouseEnter={
                              reduceMotion ? undefined : (e) => handleSlotEnter(i, layer.expIndex, e.currentTarget)
                            }
                          >
                            {/* This layer carries the slot-role-aware enter/exit keyframe
                                alone — its opacity/transform (fill-mode: both) would
                                otherwise permanently outrank a plain utility on the same
                                element, so the hover-driven grow/recede below needs its
                                own, uncontested element. Delay is intentionally tiny and
                                starts at (near) 0ms, in step with the title (see
                                `titleClass` below) — a previous 180-320ms base delay left
                                the whole card area empty for a visible stretch after the
                                title/background had already changed, reading as two
                                disconnected transitions instead of one coordinated scene
                                (confirmed via frame-by-frame capture). */}
                            <div
                              className={`${getCardClass(i, isExiting, direction)} flex flex-col`}
                              style={{ animationDelay: isExiting ? `${i * 15}ms` : `${i * 25}ms` }}
                            >
                              {/* Hover grow/recede transform — wraps BOTH the title and the
                                  image so they travel together as one card, never
                                  separately. This is also the one and only visual
                                  representation of this card: it grows in place (anchored
                                  to its own bottom edge) when hovered, rather than a
                                  duplicate/portal standing in for it. Siblings recede via
                                  the same transform property, computed by
                                  `computeReceedeMap` so the whole row moves as one system. */}
                              <div
                                ref={
                                  isThisExpanded
                                    ? (el) => {
                                        activeInnerElRef.current = el;
                                      }
                                    : undefined
                                }
                                className="flex flex-col"
                                style={{
                                  transition: `transform ${CARD_ACTIVE_MS}ms ${CARD_ACTIVE_EASE}, opacity ${CARD_ACTIVE_MS}ms ${CARD_ACTIVE_EASE}, filter ${CARD_ACTIVE_MS}ms ${CARD_ACTIVE_EASE}`,
                                  transformOrigin: "50% 100%",
                                  transform: isThisExpanded
                                    ? `translateY(-${CARD_ACTIVE_LIFT}px) scale(${CARD_ACTIVE_SCALE})`
                                    : recede
                                      ? `translate(${recede.tx}px, ${recede.ty}px) scale(${recede.scale}) rotate(${recede.rot}deg)`
                                      : "none",
                                  opacity: recede ? CARD_RECEDE_OPACITY : isThisExpanded ? 1 : restOpacity,
                                  filter: !isThisExpanded && i === 2 && !recede ? "brightness(0.88)" : "none",
                                }}
                              >
                                {/* Card title — above the image, matching the reference
                                    composition. Same content, font, size and weight as
                                    before; only its position (now above rather than
                                    overlaid on the image) has changed. A DOM descendant of
                                    the same transformed element as the image, so it never
                                    lags behind the card as it moves. */}
                                <div
                                  className="mb-2 flex flex-col gap-0.5"
                                  style={{
                                    // Nudged clear of the image deck's own left overlap
                                    // (see `marginLeft` above): that overlap is deliberately
                                    // sized for the image only — without this, the front
                                    // card's higher z-index paints over these first pixels
                                    // of a back card's title text too, since title and image
                                    // share this same card's box.
                                    paddingLeft: i === 0 ? 0 : i === 1 ? 18 : 16,
                                  }}
                                >
                                  <span className="block text-[11px] font-semibold tracking-[0.1em] text-sky uppercase [text-shadow:0_2px_8px_rgba(0,0,0,0.7)]">
                                    {d.categoryLabel}
                                  </span>
                                  <span className="block text-[15px] leading-tight font-bold break-words text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.75)]">
                                    {d.name}
                                  </span>
                                </div>
                                <div
                                  className="relative w-full overflow-hidden rounded-xl shadow-[0_18px_40px_-16px_rgba(0,0,0,0.65)]"
                                  style={{ height: imageHeight }}
                                >
                                  <Image
                                    src={d.image}
                                    alt={d.imageAlt}
                                    fill
                                    sizes="400px"
                                    quality={75}
                                    className="object-cover object-[50%_50%]"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
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

                    <h1 className="font-display break-words text-[clamp(34px,10.5vw,58px)] leading-[0.86] font-extrabold tracking-tight text-white uppercase [text-shadow:0_3px_18px_rgba(0,0,0,0.6)]">
                      {exp.category}
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

                    <div className="mt-6 flex flex-wrap gap-2 max-[350px]:mt-4">
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

        {/* Top-center transport controls — desktop only. Real controls for the
            existing background video (play/pause, sound), not decoration; both
            act on whichever video is currently front-facing. */}
        {canPlayVideo && (
          // top-40 (160px), not a smaller offset that merely *looks* clear of the
          // header: the header's own row is 140px tall even though its visible
          // content (logo/nav/CTA) doesn't fill that whole box — the empty flex
          // space above/below still captures pointer events, and the header's
          // z-[150] beats this block's z-20, so anything placed inside that box
          // is visually clear but never actually clickable (confirmed: a control
          // at top-24/96px silently ate every click, "header subtree intercepts
          // pointer events").
          //
          // Left-14, not centered: the destination cards are sized off the
          // viewport's own width/height (cqw units, deliberately NOT shrunk to
          // make room for chrome), so a horizontally-centered control here would
          // land in the cards' own airspace on plenty of real laptop windows —
          // confirmed via Playwright across widths at 700-900px heights, with
          // the front card's title text sitting right where a centered control
          // would. left-14 matches the copy column's own left padding
          // (`lg:px-14` on the content row below), tucking the controls above
          // the headline instead — clear of the card deck at any card size,
          // by construction rather than by fitting a budget.
          <div className="absolute top-40 left-14 z-20 hidden items-center gap-2 lg:flex">
            <button
              type="button"
              onClick={toggleVideoPlayback}
              aria-label={videoPaused ? "Play background video" : "Pause background video"}
              aria-pressed={videoPaused}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-md transition-all duration-300 hover:border-white/70 hover:bg-black/40"
            >
              {videoPaused ? (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={() => setVideoMuted((m) => !m)}
              aria-label={videoMuted ? "Unmute background video" : "Mute background video"}
              aria-pressed={!videoMuted}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-md transition-all duration-300 hover:border-white/70 hover:bg-black/40"
            >
              {videoMuted ? (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M11 5 6 9H2v6h4l5 4V5z" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M11 5 6 9H2v6h4l5 4V5z" />
                  <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                  <path d="M18.5 5.5a9 9 0 0 1 0 13" />
                </svg>
              )}
            </button>
          </div>
        )}

        {/* Left vertical Hero progress track — desktop only, once cards sit side-by-side.
            A connecting spine behind numbered markers, with the active one filled/ringed —
            functions as a genuine progress indicator (not just re-styled dots), anchored to
            the Hero's left edge and never itself moving; only the active marker's own state
            transitions as `current` changes. */}
        <div className="absolute inset-y-0 left-3 z-20 hidden flex-col items-center justify-center lg:flex lg:left-6">
          <div className="relative flex flex-col items-center gap-5">
            <div
              className="pointer-events-none absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-white/20"
              aria-hidden="true"
            />
            {heroExperiences.map((exp, i) => (
              <button
                key={exp.slug}
                onClick={() => switchTo(i)}
                aria-label={exp.category}
                aria-current={i === current}
                className="relative flex items-center justify-center p-1.5"
              >
                <span
                  className={`relative rounded-full border transition-all duration-500 ${
                    i === current
                      ? "h-2.5 w-2.5 border-accent bg-accent shadow-[0_0_0_5px_rgba(229,0,126,0.28)]"
                      : "h-1.5 w-1.5 border-white/50 bg-white/25 hover:border-white/80 hover:bg-white/60"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Bottom-right Hero pagination — desktop only, paired with the left progress
            track above. Sourced entirely from the real Hero index/total (`current`,
            `heroExperiences.length`); never hard-coded, and updates the instant `current`
            changes rather than waiting on the category crossfade. Sits well above the
            fixed WhatsApp float button (bottom-6, h-15 — its top edge lands around 84px
            up), which otherwise sits directly on top of the Hero's own bottom-right corner. */}
        <div className="absolute right-8 bottom-28 z-20 hidden items-center gap-2.5 lg:right-10 lg:flex">
          <span className="text-[12px] font-bold tracking-[0.1em] text-white tabular-nums">
            {String(current + 1).padStart(2, "0")}
          </span>
          <span className="h-px w-8 bg-white/25" aria-hidden="true">
            <span
              className="block h-full bg-accent transition-[width] duration-500"
              style={{ width: `${((current + 1) / heroExperiences.length) * 100}%` }}
            />
          </span>
          <span className="text-[12px] font-semibold tracking-[0.1em] text-white/50 tabular-nums">
            {String(heroExperiences.length).padStart(2, "0")}
          </span>
        </div>

        {/* Lower-center prev/next — desktop only. Separate from the top-center
            transport controls and the left progress track: these actually drive
            the Hero slider, reusing the exact same `switchTo` transition every
            other trigger (dot rail, tablet/mobile arrows) already uses, so
            background + title + cards + progress track + pagination all advance
            together identically no matter which control fired it. Sized and
            lit (glowing accent ring, bottom-heavy shadow) to read clearly
            against any background frame, with a small dash-row slide
            indicator between them mirroring the requested reference look. */}
        <div className="absolute bottom-14 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-4 lg:flex">
          <button
            type="button"
            onClick={() => {
              setDirection("prev");
              switchTo(current - 1);
            }}
            className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-accent/70 bg-ink/30 text-white shadow-[0_14px_32px_-8px_rgba(229,0,126,0.85),0_0_0_1px_rgba(229,0,126,0.35)] backdrop-blur-md transition-all duration-300 hover:border-accent hover:bg-ink/45 hover:shadow-[0_16px_38px_-6px_rgba(229,0,126,1),0_0_0_1px_rgba(229,0,126,0.55)] active:scale-95"
            aria-label="Previous category"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <div className="flex items-center gap-1.5" aria-hidden="true">
            {heroExperiences.map((exp, i) => (
              <span
                key={exp.slug}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === current ? "w-6 bg-accent" : "w-3 bg-white/35"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setDirection("next");
              switchTo(current + 1);
            }}
            className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-accent/70 bg-ink/30 text-white shadow-[0_14px_32px_-8px_rgba(229,0,126,0.85),0_0_0_1px_rgba(229,0,126,0.35)] backdrop-blur-md transition-all duration-300 hover:border-accent hover:bg-ink/45 hover:shadow-[0_16px_38px_-6px_rgba(229,0,126,1),0_0_0_1px_rgba(229,0,126,0.55)] active:scale-95"
            aria-label="Next category"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
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
