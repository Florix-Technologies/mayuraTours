"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./package-experience.module.css";

/** Each resting wrapper owns its observer; only its image/text layers move. */
export function JoiningHighlight({ children, className = styles.editorialEntry }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || !window.IntersectionObserver) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    let firstFrame = 0;
    let secondFrame = 0;
    const disconnect = () => {
      observer?.disconnect();
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
    const configure = () => {
      disconnect();
      if (motion.matches) {
        delete element.dataset.join;
        return;
      }
      // No attribute in SSR: content remains visible without hydration or browser support.
      // Paint the prepared pose before attaching the observer, avoiding coalesced styles.
      element.dataset.join = "prepared";
      firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(() => {
          element.dataset.join = "waiting";
          observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
              if (entry.isIntersecting && entry.intersectionRatio >= .18) {
                element.dataset.join = "visible";
              } else if (!entry.isIntersecting && entry.intersectionRatio === 0) {
                // Reset offscreen only; dipping below the entrance threshold never flickers.
                element.dataset.join = "prepared";
              }
            });
          }, { threshold: [0, .18], rootMargin: "0px" });
          observer.observe(element);
        });
      });
    };
    configure();
    motion.addEventListener("change", configure);
    return () => {
      disconnect();
      motion.removeEventListener("change", configure);
      delete element.dataset.join;
    };
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}

export default function JoiningHighlights({ children }: { children: ReactNode }) {
  return <div className={styles.editorialHighlights}>{children}</div>;
}
