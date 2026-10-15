"use client";

import { useEffect, useRef } from "react";
import { BedDouble, Bus, CalendarDays, Utensils } from "lucide-react";
import type { TourPackage } from "@/lib/data/packages";
import styles from "./package-experience.module.css";

export default function PackageEssentials({ pkg }: { pkg: TourPackage }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || !window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        element.dataset.gather = "complete";
        observer.disconnect();
      }
    }, { threshold: 0.25 });
    element.dataset.gather = "waiting";
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const find = (pattern: RegExp) => pkg.tags.find(tag => pattern.test(tag)) ?? "Not specified";
  const items = [
    { label: "Duration", value: find(/nights?|days?|same-day/i), Icon: CalendarDays },
    { label: "Accommodation", value: find(/hotel|resort|stay/i), Icon: BedDouble },
    { label: "Transport", value: find(/coach|volvo|sleeper|transport/i), Icon: Bus },
    { label: "Meals", value: find(/breakfast|lunch|dinner|meals?/i), Icon: Utensils },
  ];
  return <div ref={ref} className={styles.brochureStrip}>
    <dl className={styles.brochureItems}>{items.map(({ label, value, Icon }) => <div key={label} className={styles.brochureItem}>
      <Icon size={23} strokeWidth={1.25} aria-hidden="true" />
      <dt>{label}</dt><dd>{value}</dd>
    </div>)}</dl>
    <svg className={styles.brochureRoute} viewBox="0 0 600 20" preserveAspectRatio="none" fill="none" aria-hidden="true"><path d="M2 13C120 0 170 23 300 10S470 0 598 13" pathLength="100" stroke="currentColor" strokeDasharray="1 2" /><circle cx="598" cy="13" r="2" fill="currentColor" /></svg>
  </div>;
}
