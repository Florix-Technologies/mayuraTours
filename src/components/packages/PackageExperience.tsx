"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, MapPin, Play } from "lucide-react";
import HighlightIllustration from "./HighlightIllustration";
import { resolveHighlightIllustrations, type HighlightTheme } from "@/lib/data/highlight-illustrations";
import cardStyles from "./highlight-cards.module.css";
import HighlightsBackdrop from "./HighlightsBackdrop";
import { JoiningHighlight } from "./JoiningHighlights";
import AvatarStage from "./AvatarStage";
import PackageEssentials from "./PackageEssentials";
import TravelServiceIcon from "./TravelServiceIcon";
import Reveal from "@/components/ui/Reveal";
import { packages, type TourPackage } from "@/lib/data/packages";
import { resolvePackageVisuals, isImageSource, needsUnoptimizedImage, type VisualImage } from "@/lib/data/package-visuals";
import styles from "./package-experience.module.css";

export function DestinationImage({ src, alt, fallback, className = "", eager = false, contain = false, sizes = "(max-width: 767px) 90vw, (max-width: 1023px) 70vw, 700px" }: {
  src: string; alt: string; fallback?: VisualImage; className?: string; eager?: boolean; contain?: boolean; sizes?: string;
}) {
  const [failed, setFailed] = useState<string[]>([]);
  const photo = [{ src, alt }, ...(fallback ? [fallback] : [])].find(image => isImageSource(image.src) && !failed.includes(image.src));
  return !photo ? (
    <div className={`${styles.imageFallback} ${className}`} role="img" aria-label={alt || "Package image unavailable"}>
      <MapPin aria-hidden="true" size={32} /><span>{alt || "Package image unavailable"}</span>
    </div>
  ) : <Image key={photo.src} src={photo.src} alt={photo.alt} fill sizes={sizes} unoptimized={needsUnoptimizedImage(photo.src)}
      loading={eager ? "eager" : "lazy"} className={`${contain && photo.src === src ? styles.cutout : styles.photo} ${className}`} onError={() => setFailed(previous => [...previous, photo.src])} />;
}

function SectionHeading({ label, title }: { label: string; title: string }) {
  return <div className={styles.heading}><p className={styles.eyebrow}>{label}</p><h2>{title}</h2></div>;
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

/** Failed uploads fall back to the approved SVG scene within the same animated card. */
function HighlightArtwork({ image, alt, kind }: { image?: string; alt: string; kind: Parameters<typeof HighlightIllustration>[0]["kind"] }) {
  const [failed, setFailed] = useState<string>();
  return image && isImageSource(image) && failed !== image
    ? <Image src={image} alt={alt} fill sizes="(max-width: 639px) 90vw, 360px" unoptimized={needsUnoptimizedImage(image)} className={cardStyles.customImage} onError={() => setFailed(image)} />
    : <HighlightIllustration kind={kind} />;
}

function HighlightExplorer({ pkg, highlights, demo = false }: { pkg: TourPackage; highlights: NonNullable<TourPackage["highlights"]>; demo?: boolean }) {
  if (!highlights.length) return <p className={styles.pending}>Destination highlights will be published soon.</p>;
  const themes: HighlightTheme[] = ["blue", "pink", "yellow"];
  const illustrations = resolveHighlightIllustrations(highlights, `${pkg.destination || ""} ${pkg.name} ${pkg.slug}`);
  return <div className={cardStyles.grid}>{highlights.map((item, index) => {
    const title = typeof item === "string" ? item : item.title || item.name || "Destination highlight";
    const description = typeof item === "string" ? "" : item.description || "";
    const illustration = illustrations[index];
    const theme = themes[index % themes.length];
    return <JoiningHighlight key={`${pkg.slug}-${index}`} className={cardStyles.reveal}>
      <article className={cardStyles.card} data-theme={theme} tabIndex={0}>
        <div className={cardStyles.art}><span className={cardStyles.number}>{String(index + 1).padStart(2, "0")}</span><HighlightArtwork image={demo || typeof item === "string" ? undefined : item.image} alt={typeof item === "string" ? title : item.imageAlt || title} kind={illustration} /></div>
        <div className={cardStyles.copy}><span className={cardStyles.accent} aria-hidden="true" /><h3>{demo ? customerCopy(title) : title}</h3>
          {description && <p>{demo ? customerCopy(description) : description}</p>}
        </div>
      </article>
    </JoiningHighlight>;
  })}</div>;
}

function Itinerary({ itinerary, demo = false }: { itinerary: NonNullable<TourPackage["itinerary"]>; demo?: boolean }) {
  const [active, setActive] = useState(0);
  const dayButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const selectDay = (index: number) => {
    setActive(index);
    // Keep the selected stop visible in the compact, horizontally scrolling route.
    const button = dayButtons.current[index];
    const picker = button?.parentElement;
    if (button && picker && picker.scrollWidth > picker.clientWidth) {
      picker.scrollTo({ left: button.offsetLeft - (picker.clientWidth - button.offsetWidth) / 2,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    }
  };
  const selected = itinerary[active];
  if (!selected) return <p className={styles.pending}>The day-by-day itinerary has not been published yet. See the package overview for the currently available travel information.</p>;
  const title = typeof selected === "string" ? selected : selected.title || selected.day || `Day ${active + 1}`;
  const copy = (text: string) => demo ? customerCopy(text) : text;
  return <div className={styles.itinerary}>
    <div className={styles.dayPicker} role="group" aria-label="Choose itinerary day"
      style={{ "--day-count": itinerary.length, "--active-day": active } as CSSProperties}>
      <span className={styles.dayIndicator} aria-hidden="true" />
      {itinerary.map((day, index) => <button key={index} type="button" aria-pressed={active === index}
        ref={element => { dayButtons.current[index] = element; }}
        aria-controls="itinerary-content" onClick={() => selectDay(index)}>
        <span className={styles.dayNumber}>{String(index + 1).padStart(2, "0")}</span>
        <span className={styles.dayNavText}><small>Day {String(index + 1).padStart(2, "0")}</small><strong>{copy(typeof day === "string" ? day : day.title || day.day || `Day ${index + 1}`)}</strong></span>
      </button>)}
    </div>
    <div className={styles.dayContent}>
      <svg className={styles.dayRoute} viewBox="0 0 320 300" fill="none" aria-hidden="true">
        <path d="M300 20C180 5 310 130 210 115S50 90 100 190 250 210 180 290" stroke="currentColor" strokeWidth="1" strokeDasharray="3 7" />
        <circle cx="300" cy="20" r="5" stroke="currentColor" /><circle cx="180" cy="290" r="5" stroke="currentColor" />
      </svg>
      <div id="itinerary-content" role="region" aria-label="Selected itinerary day" aria-live="polite" aria-atomic="true">
        <div key={active} className={styles.dayTransition}>
          <span className={styles.dayWatermark} aria-hidden="true">{String(active + 1).padStart(2, "0")}</span>
          <div className={styles.panelDayLabel}>Day {String(active + 1).padStart(2, "0")}</div>
          <h3>{copy(title)}</h3>{typeof selected !== "string" && <>
            {selected.day && selected.day !== title && !/^\s*day\s*\d+\s*$/i.test(selected.day) && <p>{copy(selected.day)}</p>}
            {selected.description && <p>{copy(selected.description)}</p>}
            {selected.details && selected.details !== selected.description && <p>{copy(selected.details)}</p>}
          </>}
        </div>
      </div>
      {itinerary.length > 1 && <div className={styles.dayControls} aria-label="Journey navigation">
        <button type="button" disabled={active === 0} onClick={() => selectDay(active - 1)} aria-controls="itinerary-content" aria-label="Previous day"><ArrowLeft size={18} strokeWidth={1.5} aria-hidden="true" /><span>Previous</span></button>
        <button type="button" disabled={active === itinerary.length - 1} onClick={() => selectDay(active + 1)} aria-controls="itinerary-content" aria-label="Next day"><span>Next</span><ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" /></button>
      </div>}
    </div>
  </div>;
}

function RelatedPackages({ items }: { items: TourPackage[] }) {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef({ pointerId: -1, x: 0, scrollLeft: 0, moved: false });
  const [dragging, setDragging] = useState(false);
  const [scroll, setScroll] = useState({ progress: 0, visible: 1, overflow: false });
  const syncScroll = () => {
    const node = track.current;
    if (!node) return;
    const max = node.scrollWidth - node.clientWidth;
    const next = { progress: max > 1 ? Math.max(0, Math.min(1, node.scrollLeft / max)) : 0,
      visible: node.scrollWidth ? Math.min(1, node.clientWidth / node.scrollWidth) : 1, overflow: max > 1 };
    setScroll(previous => previous.progress === next.progress && previous.visible === next.visible && previous.overflow === next.overflow ? previous : next);
  };
  useEffect(() => {
    const node = track.current;
    if (!node) return;
    const observer = new ResizeObserver(syncScroll);
    observer.observe(node);
    const frame = requestAnimationFrame(syncScroll);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, []);
  const move = (direction: number) => {
    const node = track.current;
    const card = node?.firstElementChild as HTMLElement | null;
    if (!node || !card) return;
    const step = card.offsetWidth + parseFloat(getComputedStyle(node).columnGap);
    node.scrollTo({ left: Math.round(node.scrollLeft / step) * step + direction * step,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  return <section id="related" className={`${styles.section} ${styles.relatedSection}`} aria-labelledby="related-heading">
    <div className={styles.relatedSurface}>
      <div className={styles.relatedHeader}>
        <div><p className={styles.relatedEyebrow}>Handpicked journeys</p><h2 id="related-heading">Just For You</h2></div>
        <Link href="/packages" className={styles.relatedAll}>View All Packages<ArrowRight size={15} aria-hidden="true" /></Link>
      </div>
      <div className={styles.relatedCarousel} style={{ "--package-count": Math.max(1, items.length) } as CSSProperties}>
        <div id="related-packages-track" ref={track} className={styles.related} onScroll={syncScroll} data-dragging={dragging} data-scrollable={scroll.overflow}
          onDragStart={event => event.preventDefault()}
          onPointerDown={event => {
            drag.current.moved = false;
            if (event.pointerType !== "mouse" || event.button !== 0 || !scroll.overflow) return;
            drag.current = { pointerId: event.pointerId, x: event.clientX, scrollLeft: event.currentTarget.scrollLeft, moved: false };
          }}
          onPointerMove={event => {
            const gesture = drag.current;
            if (gesture.pointerId !== event.pointerId) return;
            if ((event.buttons & 1) === 0) { gesture.pointerId = -1; setDragging(false); return; }
            const distance = event.clientX - gesture.x;
            if (!gesture.moved && Math.abs(distance) < 6) return;
            if (!gesture.moved) {
              gesture.moved = true;
              event.currentTarget.setPointerCapture(event.pointerId);
              setDragging(true);
            }
            event.preventDefault();
            event.currentTarget.scrollLeft = gesture.scrollLeft - distance;
          }}
          onPointerUp={event => {
            if (drag.current.pointerId !== event.pointerId) return;
            drag.current.pointerId = -1;
            setDragging(false);
          }}
          onPointerCancel={() => { drag.current.pointerId = -1; setDragging(false); }}
          onLostPointerCapture={() => { drag.current.pointerId = -1; setDragging(false); }}
          onClickCapture={event => {
            if (drag.current.moved && event.detail !== 0) {
              event.preventDefault(); event.stopPropagation(); drag.current.moved = false;
            }
          }}
          role="region" aria-label="Handpicked travel packages" tabIndex={0}
          onKeyDown={event => {
            if (event.target !== event.currentTarget) return;
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1);
            }
          }}>
          {items.map(item => {
            const duration = item.duration || item.tags.find(tag => /night|day|same-day/i.test(tag));
            const destination = item.destination || resolvePackageVisuals(item).name;
            return <article key={item.slug} className={styles.relatedLink} tabIndex={0} aria-labelledby={`related-title-${item.slug}`}>
              <div className={styles.relatedImage}>
                <DestinationImage src={item.image} alt={item.imageAlt} sizes="(max-width: 639px) 85vw, (max-width: 1023px) 40vw, 260px" />
              </div>
              <div className={styles.relatedCopy}>
                <div className={styles.relatedTitle}><h3 id={`related-title-${item.slug}`}>{item.name}</h3></div>
                {destination && <p className={styles.relatedDestination}><MapPin size={13} aria-hidden="true" />{destination}</p>}
                <p className={styles.relatedPrice}>{item.price}{item.priceUnit && <span>{item.priceUnit}</span>}</p>
                {(duration || item.travellerInfo) && <div className={styles.relatedMeta}>
                  {duration && <span>{duration}</span>}{item.travellerInfo && <span>{item.travellerInfo}</span>}
                </div>}
                <Link href={`/packages/${item.slug}`} className={styles.relatedExplore} aria-label={`Explore ${item.name}`}>Explore Now<ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" /></Link>
              </div>
            </article>;
          })}
        </div>
        {scroll.overflow && <div className={styles.relatedScrollCue}>
          <div className={styles.relatedProgress} role="progressbar" aria-label="Related packages scroll position"
            aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(scroll.progress * 100)}>
            <span style={{ width: `${scroll.visible * 100}%`, left: `${scroll.progress * (1 - scroll.visible) * 100}%` }} />
          </div>
          <span className={styles.relatedDragHint}>Drag to explore</span>
          <span className={styles.relatedSwipeHint}>Swipe to explore</span>
        </div>}
      </div>
    </div>
  </section>;
}

export default function PackageExperience({ pkg }: { pkg: TourPackage }) {
  const destination = resolvePackageVisuals(pkg);
  const art = destination.avatar;
  // Only the legacy traveler illustration uses the separate palace backdrop.
  // Standalone palace overrides keep the normal stage and must not show a second opaque palace.
  const isMysore = Boolean(destination.palace) && art?.src === "/images/destinations/mysore-srirangapatna-avatar-3d.webp";
  const demo = pkg.demoContent;
  const highlights = pkg.highlights?.length ? pkg.highlights : demo?.highlights ?? [];
  const itinerary = pkg.itinerary?.length ? pkg.itinerary : demo?.itinerary ?? [];
  const included = pkg.included?.length ? pkg.included : demo?.included ?? [];
  const excluded = pkg.excluded?.length ? pkg.excluded : demo?.excluded ?? [];
  const related = packages.filter(item => item.slug !== pkg.slug).sort((a, b) =>
    b.tags.filter(tag => pkg.tags.includes(tag)).length - a.tags.filter(tag => pkg.tags.includes(tag)).length
  );
  return <div className={styles.experience}>
    <Reveal><section className={styles.introduction} aria-labelledby="destination-heading">
      <AvatarStage className={`${styles.artworkStage} ${isMysore ? styles.mysoreStage : ""}`}>
        <div className={styles.artworkHalo} aria-hidden="true" />
        {isMysore && destination.palace && <div className={styles.mysorePalace}><DestinationImage src={destination.palace.src} alt={destination.palace.alt} sizes="(max-width: 639px) 85vw, 420px" /></div>}
        <div className={styles.artwork}><DestinationImage key={pkg.slug} src={art?.src ?? pkg.image} alt={art?.alt ?? pkg.imageAlt} contain={Boolean(art)} fallback={{ src: pkg.image, alt: pkg.imageAlt }} /></div>
        <span className={styles.imageCaption}><MapPin size={15} aria-hidden="true" />{destination.name}</span>
        <svg className={styles.route} viewBox="0 0 240 160" fill="none" aria-hidden="true"><path d="M5 140C100 145 40 10 125 25S240 60 225 5" stroke="currentColor" strokeWidth="2" strokeDasharray="4 8" /></svg>
      </AvatarStage>
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
      <PackageEssentials key={pkg.slug} pkg={pkg} />
      <p className={styles.price}>{pkg.price} {pkg.priceUnit && <span>{pkg.priceUnit}</span>}</p>
    </section></Reveal>

    <section id="highlights" className={`${styles.section} ${styles.highlightsSection}`}>
      <HighlightsBackdrop key={pkg.slug} artwork={destination.backgroundImage} />
      <SectionHeading label="Worth the journey" title="The highlights." />
      <HighlightExplorer key={pkg.slug} pkg={pkg} highlights={highlights} demo={!pkg.highlights?.length} />
    </section>

    <Reveal><section id="itinerary" className={`${styles.section} ${styles.itinerarySection}`} aria-labelledby="itinerary-heading">
      <div className={styles.heading}><p className={styles.eyebrow}>One moment at a time</p><h2 id="itinerary-heading">Your itinerary</h2></div>
      {!pkg.itinerary?.length && demo?.itinerary.length ? <p className={styles.itineraryDisclaimer}>Suggested itinerary. The final route, order of visits and timings are subject to confirmation and local availability.</p> : null}
      <Itinerary key={pkg.slug} itinerary={itinerary} demo={!pkg.itinerary?.length} />
    </section></Reveal>

    <Reveal><section id="included" className={`${styles.section} ${styles.inclusions}`}>
      {(!pkg.included?.length || !pkg.excluded?.length) && demo ? <p className={styles.serviceCondition}>Services shown are indicative. Only the inclusions and exclusions listed in your confirmed booking apply.</p> : null}
      <div className={styles.includedPanel}><SectionHeading label="Part of your package" title="What's included." /><DetailList items={included} demo={!pkg.included?.length} /></div>
      <div className={styles.excludedPanel}><SectionHeading label="Plan ahead" title="What's not included." /><DetailList items={excluded} excluded demo={!pkg.excluded?.length} /></div>
    </section></Reveal>

    <Reveal><section id="photos" className={styles.section}>
      <SectionHeading label="A sense of place" title="Moments from the Journey." />
      <div className={styles.gallery}><figure className={styles.galleryMain}><div><DestinationImage src={pkg.image} alt={pkg.imageAlt} /></div><figcaption>{pkg.imageAlt}</figcaption></figure>
        {destination.video && <figure className={styles.video}><video controls preload="none" playsInline poster={destination.video.poster} aria-label={destination.video.label}><source src={destination.video.src} type="video/mp4" />Your browser does not support video.</video><figcaption><Play size={14} aria-hidden="true" />{destination.video.title}</figcaption></figure>}
        {pkg.gallery?.map((photo, index) => <figure key={`${photo.src}-${index}`} className={styles.galleryMain}><div><DestinationImage src={photo.src} alt={photo.alt} /></div><figcaption>{photo.alt}</figcaption></figure>)}
      </div>
      {destination.illustrations && <div className={styles.illustrations}>{destination.illustrations.map(photo => <div key={photo.src}><DestinationImage src={photo.src} alt={photo.alt} /></div>)}</div>}
      {destination.feature && <figure className={styles.mysoreMarket}>
        <div className={styles.mysoreMarketImage}><DestinationImage src={destination.feature.src} alt={destination.feature.alt} sizes="(max-width: 639px) 90vw, 650px" /></div>
        <figcaption><p className={styles.eyebrow}>{destination.feature.label}</p><h3>{destination.feature.title}</h3><p>Destination-inspired artwork / artistic impression</p></figcaption>
      </figure>}
      {!destination.video && !pkg.gallery?.length && <p className={styles.pending}>Additional destination photos and videos have not been published yet.</p>}
    </section></Reveal>

    <Reveal><section className={styles.section} aria-label="Package policies">
      <div className={styles.policies}>
        <div className={styles.policyRow}>
          <h3>Cancellation Policy</h3>
          <p>Cancellation and refund terms will be updated based on the final package policy provided by Mayura Holidays.</p>
        </div>
        <div className={styles.policyRow}>
          <h3>Important Information</h3>
          <p>Important travel instructions, reporting details, documents and other package-specific information will be updated here.</p>
        </div>
      </div>
    </section></Reveal>

    <Reveal><RelatedPackages key={pkg.slug} items={related} /></Reveal>
  </div>;
}
