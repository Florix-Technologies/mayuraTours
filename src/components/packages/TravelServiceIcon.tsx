import type { ReactNode } from "react";

type ServiceKind = "transport" | "stay" | "meals" | "sights" | "tickets" | "expenses" | "activities" | "support" | "journey";

function category(title: string): ServiceKind {
  if (/same-day|no overnight/i.test(title)) return "journey";
  if (/transport|transfer|coach/i.test(title)) return "transport";
  if (/stay|hotel|resort|houseboat/i.test(title)) return "stay";
  if (/meal|breakfast/i.test(title)) return "meals";
  if (/assist|support/i.test(title)) return "support";
  if (/ticket/i.test(title)) return "tickets";
  if (/purchase|expense/i.test(title)) return "expenses";
  if (/optional|activit|experience/i.test(title)) return "activities";
  if (/sightseeing/i.test(title)) return "sights";
  return "journey";
}

/** Small original SVG travel illustrations: shared outline, perspective and brand accents.
 * Decorative only; the adjacent service title provides the accessible name. */
export default function TravelServiceIcon({ title }: { title: string }) {
  const accent = "var(--color-accent)";
  const paper = "var(--color-paper)";
  const drawings: Record<ServiceKind, ReactNode> = {
    transport: <>
      <path d="m12 21 28-8 13 8v25l-28 9-13-8Z" fill={paper} />
      <path d="m12 21 13 8 28-8M25 29v26M12 37l13 8 28-8" />
      <path d="m29 30 8-2v10l-8 2Zm12-4 8-2v10l-8 2Z" fill="white" />
      <path d="m15 25 7 4v10l-7-4Z" fill="white" />
      <path d="m14 43 6 3m10 1 5-1" stroke={accent} strokeWidth="2.5" />
      <ellipse cx="19" cy="49" rx="3" ry="4" fill="white" /><ellipse cx="44" cy="47" rx="3" ry="4" fill="white" />
    </>,
    stay: <>
      <path d="m15 22 18-9 18 9v30l-18 8-18-9Z" fill={paper} />
      <path d="m15 22 18 9 18-9M33 31v29" /><path d="m8 24 25-13 25 13" stroke={accent} />
      <path d="m20 29 6 3v7l-6-3Zm0 13 6 3v7l-6-3Zm19-10 6-3v7l-6 3Z" fill="white" />
      <path d="m39 48 6-3v10l-6 3Z" fill="white" />
      <path d="M27 12V6h9v5" stroke={accent} />
    </>,
    meals: <>
      <ellipse cx="31" cy="34" rx="17" ry="16" fill={paper} /><ellipse cx="31" cy="34" rx="12" ry="11" />
      <path d="M7 13v12c0 4 7 4 7 0V13M10.5 13v42M54 13c-5 5-6 14-5 20h6V13Zm1 20v22" />
      <path d="m26 35 4 4 8-9" stroke={accent} strokeWidth="2" />
      <path d="M24 11c0-2 3-2 3-5m9 5c0-2 3-2 3-5" opacity=".5" />
    </>,
    sights: <>
      <path d="m8 27 15-5 17 6 15-5v29l-15 5-17-6-15 5Z" fill={paper} />
      <path d="M23 22v29M40 28v29" />
      <path d="M32 8c-8 0-12 9-7 16l7 9 7-9c5-7 1-16-7-16Z" fill="white" />
      <circle cx="32" cy="18" r="4" stroke={accent} strokeWidth="2" />
      <path d="m15 40 4-2m8 2 5 2m12 2 5-2" stroke={accent} strokeDasharray="2 3" />
    </>,
    tickets: <>
      <path d="m15 15 31-5 7 37-31 5-2-10c5-1 4-8-1-8Z" fill={paper} />
      <path d="M9 24h40v8c-7 0-7 9 0 9v10H9V41c7 0 7-9 0-9Z" fill="white" />
      <path d="M35 25v25" strokeDasharray="2 3" /><path d="m19 31 5 4 5-4m-10 9h10" stroke={accent} strokeWidth="2" />
    </>,
    expenses: <>
      <path d="m12 22 29-9 10 7-28 9Z" fill={paper} /><path d="M12 22v30l39 2V23l-28 6Z" fill="white" />
      <path d="M12 31h39M38 35h17v12H38c-7 0-7-12 0-12Z" fill={paper} />
      <circle cx="42" cy="41" r="2" stroke={accent} strokeWidth="2" /><path d="m21 23-2-12 20-3 2 12m-17-4 9-2" stroke={accent} />
    </>,
    activities: <>
      <path d="M32 8c-22 0-23 20-9 32h18C55 28 54 8 32 8Z" fill={paper} />
      <path d="M32 8c-11 5-13 19-6 32m6-32c11 5 13 19 6 32M32 8v32" />
      <path d="m24 40 4 9m12-9-4 9M27 49h10v8H27Z" fill="white" />
      <path d="M19 28h26" stroke={accent} strokeWidth="2.5" />
    </>,
    support: <>
      <path d="M13 32v-4a19 19 0 0 1 38 0v4" /><path d="M18 28v-2a14 14 0 0 1 28 0v2" opacity=".5" />
      <rect x="9" y="29" width="10" height="19" rx="4" fill={paper} /><rect x="45" y="29" width="10" height="19" rx="4" fill={paper} />
      <path d="M50 47c0 8-8 8-14 8" /><rect x="27" y="52" width="11" height="6" rx="3" fill="white" stroke={accent} />
      <path d="M14 34v8m36-8v8" stroke={accent} />
    </>,
    journey: <>
      <path d="M14 43c13 18 38 4 31-12C39 16 19 24 32 12" strokeDasharray="3 4" />
      <path d="M14 29c-7 0-10 7-6 12l6 8 6-8c4-5 1-12-6-12Z" fill={paper} /><circle cx="14" cy="37" r="3" stroke={accent} />
      <path d="m29 12 7-6 7 5" stroke={accent} strokeWidth="2" /><path d="M42 51h14" />
    </>,
  };
  return <svg viewBox="0 0 64 64" width="56" height="56" fill="none" stroke="var(--color-ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{drawings[category(title)]}</svg>;
}
