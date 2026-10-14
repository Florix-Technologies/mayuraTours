"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode, type PointerEvent } from "react";
import { ArrowRight, MapPin, Play, Compass, ChevronDown } from "lucide-react";
import TravelServiceIcon from "./TravelServiceIcon";
import Reveal from "@/components/ui/Reveal";
import { packages, type TourPackage } from "@/lib/data/packages";
import { destinationArtwork, mysoreScenes } from "@/lib/data/destination-artwork";
import styles from "./package-experience.module.css";

const destinations: Record<string, { name: string; label: string }> = {
  goa: { name: "Goa", label: "By the Arabian Sea" },
  "ooty-coonoor": { name: "Ooty & Coonoor", label: "Into the Nilgiris" },
  "mysore-srirangapatna": { name: "Mysore & Srirangapatna", label: "A journey through heritage" },
  coorg: { name: "Coorg", label: "In coffee country" },
  "kerala-munnar": { name: "Kerala & Munnar", label: "Backwaters to tea hills" },
  chikmagalur: { name: "Chikmagalur", label: "Above the coffee estates" },
};

export function DestinationImage({ src, alt, className = "", eager = false, contain = false, sizes = "(max-width: 767px) 90vw, (max-width: 1023px) 70vw, 700px" }: {
  src: string; alt: string; className?: string; eager?: boolean; contain?: boolean; sizes?: string;
}) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <div className={`${styles.imageFallback} ${className}`} role="img" aria-label={alt}>
      <MapPin aria-hidden="true" size={32} /><span>{alt}</span>
    </div>
  ) : <Image src={src} alt={alt} fill sizes={sizes}
      loading={eager ? "eager" : "lazy"} className={`${contain ? styles.cutout : styles.photo} ${className}`} onError={() => setFailed(true)} />;
}

function SectionHeading({ label, title }: { label: string; title: string }) {
  return <div className={styles.heading}><p className={styles.eyebrow}>{label}</p><h2>{title}</h2></div>;
}

/** Goa moves as one image; depth comes from separate decoration, never fabricated image layers. */
function GoaArtworkStage({ children, className = "" }: { children: ReactNode; className?: string }) {
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
  return <div ref={stage} className={`${className} ${styles.goaInteractive}`} onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset}>
    {children}
    <svg className={styles.goaTravelRoute} viewBox="0 0 400 400" fill="none" aria-hidden="true">
      <path d="M48 290C12 242 25 124 92 77S286 24 343 106C374 151 382 266 328 316S123 383 62 322" pathLength="100" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeDasharray=".5 2" />
    </svg>
  </div>;
}

/** Demo provenance stays in data. Presentation uses conditional travel wording rather than prototype banners.
 * Never apply this formatter to verified client content. */
function customerCopy(text: string) {
  return text
    .replace(/^Sample plan:\s*/i, "")
    .replace(/^Sample exclusion:\s*/i, "")
    .replace(/^Sample\s+/i, "")
    .replace(/for this design preview/g, "subject to confirmation")
    .replace(/for visual preview/g, "for planning")
    .replace(/in this preview/g, "on this proposed route")
    .replace(/\bpreview\b/gi, "proposed")
    .replace(/\bsample\b/gi, "suggested")
    .replace(/^[a-z]/, (first) => first.toUpperCase());
}

function DetailList({ items, excluded = false, demo = false }: {
  items: NonNullable<TourPackage["included"]>; excluded?: boolean; demo?: boolean;
}) {
  const copy = (text: string) => demo ? customerCopy(text) : text;
  return items.length ? <ul className={styles.detailList}>{items.map((item, index) => {
    const title = typeof item === "string" ? item : item.title || item.name || "Package detail";
    return <li key={index}><span className={styles.detailIcon}><TravelServiceIcon title={title} /></span>
      <div><strong>{copy(title)}</strong>{typeof item !== "string" && item.description && <p>{copy(item.description)}</p>}</div>
    </li>;
  })}</ul> : <p className={styles.pending}>Package-specific {excluded ? "exclusions" : "inclusions"} have not been published yet.</p>;
}

function HighlightExplorer({ pkg, highlights, demo = false }: { pkg: TourPackage; highlights: NonNullable<TourPackage["highlights"]>; demo?: boolean }) {
  const [active, setActive] = useState(0);
  return <div className={styles.highlightLayout}>
    <div className={`${styles.highlightImage} ${pkg.slug === "mysore-srirangapatna" ? styles.mysoreHighlight : ""}`}><DestinationImage src={pkg.slug === "mysore-srirangapatna" ? mysoreScenes.hills.src : pkg.image} alt={pkg.slug === "mysore-srirangapatna" ? mysoreScenes.hills.alt : pkg.imageAlt} />
      <span className={styles.highlightCaption}>Explore the destination</span>
    </div>
    <ol className={styles.highlights}>{highlights.map((item, index) => <li key={index}>
      <button type="button" aria-expanded={active === index} aria-controls={`highlight-${index}`} onClick={() => setActive(index)}>
        <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
        <span>{typeof item === "string" ? item : item.title || item.name}</span><ChevronDown size={16} aria-hidden="true" />
      </button>
      <div id={`highlight-${index}`} hidden={active !== index} className={styles.highlightDescription}>
        {typeof item !== "string" && item.description && <p key={index} className={styles.dayTransition}>{demo ? customerCopy(item.description) : item.description}</p>}
      </div>
    </li>)}</ol>
  </div>;
}

function Itinerary({ itinerary, demo = false }: { itinerary: NonNullable<TourPackage["itinerary"]>; demo?: boolean }) {
  const [active, setActive] = useState(0);
  const selected = itinerary[active];
  if (!selected) return <p className={styles.pending}>The day-by-day itinerary has not been published yet. See the package overview for the currently available travel information.</p>;
  const title = typeof selected === "string" ? selected : selected.title || selected.day || `Day ${active + 1}`;
  const copy = (text: string) => demo ? customerCopy(text) : text;
  return <div className={styles.itinerary}>
    <div className={styles.dayPicker} aria-label="Choose itinerary day">
      {itinerary.map((day, index) => <button key={index} type="button" aria-pressed={active === index}
        aria-controls="itinerary-content" onClick={() => setActive(index)}>
        <span className={styles.dayNumber}>{String(index + 1).padStart(2, "0")}</span>
        <span className={styles.dayNavText}><small>{typeof day === "string" ? `Stop ${index + 1}` : day.day || `Day ${index + 1}`}</small><strong>{typeof day === "string" ? day : day.title || day.day}</strong></span>
      </button>)}
    </div>
    <div id="itinerary-content" aria-live="polite" className={styles.dayContent}>
      <div key={active} className={styles.dayTransition}><div className={styles.dayChapter}><span>{String(active + 1).padStart(2, "0")}</span><p className={styles.eyebrow}>Your journey / {itinerary.length} {itinerary.length === 1 ? "day" : "days"}</p></div>
        <h3>{title}</h3>{typeof selected !== "string" && <>
          {selected.day && selected.day !== title && <p>{selected.day}</p>}
          {selected.description && <p>{copy(selected.description)}</p>}
          {selected.details && selected.details !== selected.description && <p>{copy(selected.details)}</p>}
        </>}
      </div>
    </div>
  </div>;
}

export default function PackageExperience({ pkg }: { pkg: TourPackage }) {
  const destination = destinations[pkg.slug] ?? { name: pkg.name, label: "Discover your destination" };
  const art = destinationArtwork[pkg.slug];
  const isMysore = pkg.slug === "mysore-srirangapatna";
  const ArtworkStage = pkg.slug === "goa" ? GoaArtworkStage : "div";
  const demo = pkg.demoContent;
  const highlights = pkg.highlights?.length ? pkg.highlights : demo?.highlights ?? [];
  const itinerary = pkg.itinerary?.length ? pkg.itinerary : demo?.itinerary ?? [];
  const included = pkg.included?.length ? pkg.included : demo?.included ?? [];
  const excluded = pkg.excluded?.length ? pkg.excluded : demo?.excluded ?? [];
  const related = packages.filter(item => item.slug !== pkg.slug).sort((a, b) =>
    b.tags.filter(tag => pkg.tags.includes(tag)).length - a.tags.filter(tag => pkg.tags.includes(tag)).length
  ).slice(0, 3);
  return <div className={styles.experience}>
    <Reveal><section className={styles.introduction} aria-labelledby="destination-heading">
      <ArtworkStage className={`${styles.artworkStage} ${isMysore ? styles.mysoreStage : ""}`}>
        <div className={styles.artworkHalo} aria-hidden="true" />
        {isMysore && <div className={styles.mysorePalace}><DestinationImage src={mysoreScenes.palace.src} alt={mysoreScenes.palace.alt} sizes="(max-width: 639px) 85vw, 420px" /></div>}
        <div className={styles.artwork}><DestinationImage key={pkg.slug} src={art?.src ?? pkg.image} alt={art?.alt ?? pkg.imageAlt} contain={Boolean(art)} /></div>
        <span className={styles.imageCaption}><MapPin size={15} aria-hidden="true" />{destination.name}</span>
        <svg className={styles.route} viewBox="0 0 240 160" fill="none" aria-hidden="true"><path d="M5 140C100 145 40 10 125 25S240 60 225 5" stroke="currentColor" strokeWidth="2" strokeDasharray="4 8" /></svg>
        <p className={styles.artLabel}>Destination-inspired 3D artwork</p>
      </ArtworkStage>
      <div><p className={styles.eyebrow}>{destination.label}</p><h2 id="destination-heading">{destination.name},<br /><em>with a new perspective.</em></h2>
        <p className={styles.body}>{pkg.description}</p><a className={styles.textLink} href="#itinerary">Explore the journey <ArrowRight size={18} /></a>
      </div>
    </section></Reveal>

    <nav className={styles.sectionNav} aria-label="Package sections">
      {[ ["overview", "Overview"], ["highlights", "Highlights"], ["itinerary", "Itinerary"], ["included", "Included & excluded"], ["photos", "Photos / videos"], ["related", "Related packages"] ].map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
    </nav>

    <Reveal><section id="overview" className={styles.section}>
      <SectionHeading label="The essentials" title="Your package, at a glance." />
      <p className={styles.body}>{pkg.description}</p>
      {demo?.overview && <p className={styles.body}>{customerCopy(demo.overview)}</p>}
      <ul className={styles.essentials}>{pkg.tags.map(tag => <li key={tag}><Compass size={18} aria-hidden="true" />{tag}</li>)}</ul>
      <p className={styles.price}>{pkg.price} {pkg.priceUnit && <span>{pkg.priceUnit}</span>}</p>
    </section></Reveal>

    <Reveal><section id="highlights" className={styles.section}>
      <SectionHeading label="Worth the journey" title="The highlights." />
      <HighlightExplorer key={pkg.slug} pkg={pkg} highlights={highlights} demo={!pkg.highlights?.length} />
    </section></Reveal>

    <Reveal><section id="itinerary" className={styles.section}>
      <SectionHeading label="One moment at a time" title="Your itinerary / information." />
      {!pkg.itinerary?.length && demo?.itinerary.length ? <p className={styles.bookingCondition}>Suggested itinerary. The final route, order of visits and timings are subject to confirmation and local availability.</p> : null}
      <Itinerary key={pkg.slug} itinerary={itinerary} demo={!pkg.itinerary?.length} />
    </section></Reveal>

    <Reveal><section id="included" className={`${styles.section} ${styles.inclusions}`}>
      {(!pkg.included?.length || !pkg.excluded?.length) && demo ? <p className={styles.serviceCondition}>Services shown are indicative. Only the inclusions and exclusions listed in your confirmed booking apply.</p> : null}
      <div><SectionHeading label="Part of your package" title="What's included." /><DetailList items={included} demo={!pkg.included?.length} /></div>
      <div><SectionHeading label="Plan ahead" title="What's not included." /><DetailList items={excluded} excluded demo={!pkg.excluded?.length} /></div>
    </section></Reveal>

    <Reveal><section id="photos" className={styles.section}>
      <SectionHeading label="A sense of place" title="Photos / videos." />
      <div className={styles.gallery}><figure className={styles.galleryMain}><div><DestinationImage src={pkg.image} alt={pkg.imageAlt} /></div><figcaption>{pkg.imageAlt}</figcaption></figure>
        {pkg.slug === "goa" && <figure className={styles.video}><video controls preload="none" playsInline poster="/video/posters/beaches.jpg" aria-label="Goa coastal destination film"><source src="/video/goa-beach-aerial.mp4" type="video/mp4" />Your browser does not support video.</video><figcaption><Play size={14} aria-hidden="true" />Goa coastal film</figcaption></figure>}
      </div>
      {pkg.slug === "goa" && <><p className={styles.eyebrow}>Destination illustrations / artistic impressions</p><div className={styles.illustrations}>{[1, 2, 3].map(index => <div key={index}><DestinationImage src={`/images/destinations/goa-illustration-${index}.png`} alt={`Goa coastal travel illustration ${index}`} /></div>)}</div></>}
      {isMysore ? <figure className={styles.mysoreMarket}>
        <div className={styles.mysoreMarketImage}><DestinationImage src={mysoreScenes.market.src} alt={mysoreScenes.market.alt} sizes="(max-width: 639px) 90vw, 650px" /></div>
        <figcaption><p className={styles.eyebrow}>Heritage in the everyday</p><h3>A different perspective on Mysore.</h3><p>Destination-inspired artwork / artistic impression</p></figcaption>
      </figure> : art && <div className={styles.supportingArtwork}><div><DestinationImage src={art.src} alt={art.alt} contain /></div><p>Another perspective on the journey.<span>Destination-inspired 3D illustration</span></p></div>}
      {pkg.slug !== "goa" && <p className={styles.pending}>Additional destination photos and videos have not been published yet.</p>}
    </section></Reveal>

    <Reveal><section className={`${styles.section} ${styles.policies}`} aria-label="Package policies">
      <div><h3>Cancellation policy</h3><p>Cancellation and refund terms will be updated based on the final package policy provided by Mayura Holidays.</p></div>
      <div><h3>Important information</h3><p>Important travel instructions, reporting details, documents and other package-specific information will be updated here.</p></div>
    </section></Reveal>

    <Reveal><section id="related" className={styles.section}>
      <SectionHeading label="Keep exploring" title="More journeys with Mayura." />
      <div className={styles.related}>{related.map(item => <Link key={item.slug} href={`/packages/${item.slug}`} className={styles.relatedLink}>
        <div className={styles.relatedImage}><DestinationImage src={item.image} alt={item.imageAlt} /></div>
        <p className={styles.eyebrow}>{item.tags[0]}</p><h3>{item.name}</h3><p>{item.price} <span>{item.priceUnit}</span></p><span className={styles.textLink}>Explore package <ArrowRight size={17} /></span>
      </Link>)}</div>
    </section></Reveal>
  </div>;
}
