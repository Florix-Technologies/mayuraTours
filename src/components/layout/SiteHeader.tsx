"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { business, telHref } from "@/lib/data/business";

const NAV_LINKS = [
  { href: "#packages", label: "Packages" },
  { href: "#destinations", label: "Destinations" },
  { href: "#fleet", label: "Our Fleet" },
  { href: "#trust", label: "Why Us" },
  { href: "#contact", label: "Contact" },
];

export default function SiteHeader() {
  const [solid, setSolid] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    function onScroll() {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const h = document.body.scrollHeight - window.innerHeight;
        setProgress(h > 0 ? (y / h) * 100 : 0);
        setSolid(y > 60);
        ticking.current = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <div
        className="fixed left-0 top-[9px] z-[200] h-[0.5px] w-full "
        aria-hidden="true"
      >
        {/* Progress line */}
        <div
          className="h-full bg-linear-to-r from-accent to-sky transition-[width] duration-75"
          style={{ width: `${progress}%` }}
       />
     </div>

    {/* Bus */}
      <div
        className="pointer-events-none fixed top-[9px] z-[201] -translate-x-1/2 -translate-y-1/2 leading-none transition-[left] duration-300 ease-out"
         style={{ left: `${progress}%` }}
         aria-hidden="true"
       >
       <Image
        src="/bus.png"
        alt=""
        width={124}
        height={40}
        className="h-7 w-[87px] object-contain sm:h-10 sm:w-[124px]"
        />


     </div>

      <header
        className={`fixed inset-x-0 top-0 z-[150] transition-[background-color,box-shadow,padding] duration-300 ${
          solid ? "bg-ink/95 shadow-lg backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1680px] items-center gap-3 px-4 transition-[padding] duration-300 sm:gap-6 sm:px-8 ${
            solid ? "py-2.5 sm:py-3" : "py-2.5 sm:py-5"
          }`}
        >
     {/*   <a href="#top" className="flex items-center gap-3">
            <Image
              src="/mayura.png"
              alt={`${business.legalName} logo`}
              width={solid ? 68 : 100}
              height={solid ? 68 : 100}
              priority
              className="rounded-xl transition-[width,height] duration-300"
            />
            <span className="flex flex-col leading-tight">
              <span className="font-display text-lg font-extrabold text-white sm:text-xl">
                {business.shortName}
                <span className="text-accent">.</span>
              </span>
              <span className="text-[9px] font-semibold tracking-[0.22em] text-white/55 uppercase">
                {business.tagline}
              </span>
            </span>
          </a>
*/}
 
 <a href="#top" className="flex items-center gap-3">
  <Image
    src="/mayura.png"
    alt={`${business.legalName} logo`}
    width={solid ? 68 : 150}
    height={solid ? 68 : 150}
    priority
    className={`rounded-xl object-contain transition-[width,height] duration-300 ${
      solid ? "h-[54px] w-[68px]" : "h-16 w-[92px] sm:h-[100px] sm:w-[150px]"
    }`}
  />


 <span
  className={`font-display font-semibold tracking-[0.6em] text-white/70 transition-all duration-300 ${
    solid ? "text-sm" : "text-sm sm:text-lg"
  }`}
>
  SINCE.{business.foundedYear}
</span>

 {/* <span className="font-display text-lg font-extrabold text-white sm:text-xl">
    {business.shortName}
    <span className="text-accent">.</span>
  </span> */}


</a>

          <nav aria-label="Primary" className="mx-auto hidden gap-8 text-sm font-medium text-white/85 lg:flex">
            {NAV_LINKS.map((link) => (
             <a
                key={link.href}
                href={link.href}
                className={`relative rounded-full border bg-white/10 px-4 py-2 backdrop-blur-sm transition-all duration-300 hover:border-accent/60 hover:bg-white/15 hover:text-white ${
                  activeId === link.href.slice(1)
                    ? "border-accent text-white"
                    : "border-white/20 text-white/85"
             }`}
>
  {link.label}
</a>
            ))}
          </nav>

          <a
            href={telHref(business.phone)}
            className="ml-auto hidden items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-white shadow-[0_12px_30px_-12px_rgba(229,0,126,0.95)] transition-transform hover:-translate-y-0.5 sm:inline-flex lg:ml-0"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 1.9.6 2.8a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.2-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.8.6a2 2 0 0 1 1.8 2.1z" />
            </svg>
            Call Us
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="ml-auto flex items-center justify-center p-1 lg:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[210] bg-ink/70 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <div
        // Right-anchored, not left-[18vw]: translate-x-full only ever moves an element
        // by its OWN width. Once w-[82vw] hit its max-w-sm cap (any viewport roughly
        // 470-1023px — most tablets), that translation stopped being enough to clear
        // a left-anchored panel, so it sat permanently on-screen over the hero even
        // while "closed". Anchoring to the right edge instead means translating by
        // its own width always lands it exactly off-screen, at any width.
        className={`fixed inset-y-0 right-0 z-[220] flex w-[82vw] max-w-sm flex-col gap-8 bg-ink px-8 py-8 shadow-2xl transition-transform duration-300 lg:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-extrabold text-white">
            {business.shortName}
            <span className="text-accent">.</span>
          </span>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="p-1 text-white"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-1 text-base font-medium text-white/85" aria-label="Mobile primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="border-b border-white/10 py-4 transition-colors hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href={telHref(business.phone)}
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-4 text-sm font-bold text-white"
        >
          Call {business.phone}
        </a>
      </div>
    </>
  );
}

export { NAV_LINKS };
