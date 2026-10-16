"use client";

import { useEffect, useRef, type ReactNode, type PointerEvent } from "react";
import styles from "./package-experience.module.css";

/** Shared original Goa motion, with its timing and movement preserved. */
export default function AvatarStage({ children, className = "" }: { children: ReactNode; className?: string }) {
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const enabled = useRef(false);
  const reset = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    const element = stage.current;
    if (!element) return;
    delete element.dataset.engaged;
    ["--tilt-x", "--tilt-y", "--travel-x", "--travel-y", "--depth-x", "--depth-y", "--shadow-x", "--shadow-y"].forEach(name => element.style.removeProperty(name));
  };
  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const update = () => { enabled.current = media.matches; if (!media.matches) reset(); };
    update();
    media.addEventListener("change", update);
    return () => { media.removeEventListener("change", update); if (frame.current !== null) cancelAnimationFrame(frame.current); };
  }, []);
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (!enabled.current || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      const element = stage.current;
      if (!element) return;
      element.dataset.engaged = "true";
      element.style.setProperty("--tilt-x", `${-y * 14}deg`);
      element.style.setProperty("--tilt-y", `${x * 14}deg`);
      element.style.setProperty("--travel-x", `${x * 20}px`);
      element.style.setProperty("--travel-y", `${y * 20}px`);
      element.style.setProperty("--depth-x", `${-x * 12}px`);
      element.style.setProperty("--depth-y", `${-y * 12}px`);
      element.style.setProperty("--shadow-x", `${-x * 18}px`);
      element.style.setProperty("--shadow-y", `${28 - y * 12}px`);
    });
  };
  return <div ref={stage} className={`${className} ${styles.avatarInteractive}`} onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset}>
    {children}
    <svg className={styles.avatarTravelRoute} viewBox="0 0 400 400" fill="none" aria-hidden="true">
      <path d="M48 290C12 242 25 124 92 77S286 24 343 106C374 151 382 266 328 316S123 383 62 322" pathLength="100" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeDasharray=".5 2" />
    </svg>
  </div>;
}

