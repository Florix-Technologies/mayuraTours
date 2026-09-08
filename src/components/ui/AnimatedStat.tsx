"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedStatProps = {
  to: number;
  suffix?: string;
  className?: string;
};

/** Counts up to a target number once it scrolls into view. */
export default function AnimatedStat({ to, suffix = "", className = "" }: AnimatedStatProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || started) return;
          setStarted(true);
          observer.unobserve(entry.target);

          if (reduceMotion) {
            setValue(to);
            return;
          }

          const duration = 1400;
          let start: number | null = null;
          const step = (timestamp: number) => {
            if (start === null) start = timestamp;
            const progress = Math.min(1, (timestamp - start) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(to * eased);
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to]);

  const display = to < 10 ? value.toFixed(1) : Math.round(value).toLocaleString("en-IN");

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
