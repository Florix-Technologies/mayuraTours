
"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import DestinationBackdrop from "@/components/packages/DestinationBackdrop";
import PackageExperience, { DestinationImage } from "@/components/packages/PackageExperience";
import styles from "@/components/packages/package-experience.module.css";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Clock3,
  ShieldCheck,
  Users,
  MapPin,
  Compass,
  HeartHandshake,
  Sparkles,
} from "lucide-react";

import { useAuth } from "@/components/auth/AuthProvider";
import { loginHref } from "@/lib/auth/paths";
import { saveBookingIntent } from "@/lib/booking/intent";
import Reveal from "@/components/ui/Reveal";
import { business, whatsappHref } from "@/lib/data/business";
import { packages } from "@/lib/data/packages";

function formatPrice(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return `₹${value.toLocaleString("en-IN")}`;
  }

  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  return "On request";
}

export default function PackageDetailsPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { isAuthenticated, isReady } = useAuth();

  const slug = params.slug;

  const pkg = useMemo(
    () => packages.find((item) => item.slug === slug),
    [slug],
  );


  const [travelDate, setTravelDate] = useState("");
  const [travellers, setTravellers] = useState("2");
  const [accommodation, setAccommodation] = useState("Deluxe");
  const [bookingError, setBookingError] = useState("");

  if (!pkg) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-paper px-6">
        <div className="max-w-md text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-ink">
            Journey not found
          </p>
          <h1 className="mt-4 text-3xl font-bold text-ink">
            Let&apos;s find another adventure.
          </h1>
          <Link
            href="/packages"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-navy"
          >
            <ArrowLeft size={16} />
            Explore packages
          </Link>
        </div>
      </main>
    );
  }

  const packageData = pkg;
  const packageName = packageData.name;
  const price = formatPrice(packageData.price);
  const duration = pkg.duration || pkg.tags.find(tag => /night|day|same-day/i.test(tag));
  const destination = pkg.destination || pkg.name;
  const specialityIcons = [Compass, Sparkles, HeartHandshake, ShieldCheck];
  const genericSpecialities = [
    { title: "Discover more", description: "Find inspiration for your journey" },
    { title: "Your kind of escape", description: "Explore at your own pace" },
    { title: "Personal travel advice", description: "Talk through your preferences" },
    { title: "Plan with confidence", description: "Review details before booking" },
  ];
  const specialities = [...(pkg.specialities?.length ? pkg.specialities : pkg.tags.map(title => ({ title, description: `Part of ${packageName}` }))).slice(0, 4)];
  while (specialities.length < 4) specialities.push(genericSpecialities[specialities.length]);

  function continueBooking() {
    setBookingError("");

    if (!travelDate) {
      setBookingError("Please select your preferred travel date.");
      return;
    }

    if (!accommodation) {
      setBookingError("Please select your accommodation preference.");
      return;
    }

    if (!isReady) {
      setBookingError("Please wait a moment and try again.");
      return;
    }

    saveBookingIntent({
      slug: packageData.slug,
      packageName: packageData.name,
      travelDate,
      travellers,
      accommodation: accommodation.toLowerCase(),
    });

    const next = "/booking/traveler-details";

    router.push(isAuthenticated ? next : loginHref(next));
  }

  return (
    <main className="min-h-screen bg-white text-ink">
      {/* Photography-led destination hero; checkout state and navigation are unchanged. */}
      <section className={styles.cinematicHero} aria-labelledby="package-title">
        <div className={styles.heroMedia}>
          <DestinationImage key={pkg.slug} src={pkg.slug === "goa" ? "/video/posters/beaches.jpg" : pkg.image} alt={pkg.slug === "goa" ? "Aerial view of the Goa coastline" : pkg.imageAlt} eager sizes="100vw" />
        </div>
        <div className={styles.heroOverlay} aria-hidden="true" />
        <svg className={styles.heroRoute} viewBox="0 0 600 420" fill="none" aria-hidden="true">
          <path d="M40 370C210 390 70 100 255 160S520 320 555 70" stroke="currentColor" strokeWidth="1" strokeDasharray="3 9" />
          <circle cx="555" cy="70" r="10" stroke="currentColor" /><circle cx="555" cy="70" r="3" fill="currentColor" />
        </svg>
        <div className={styles.heroContent}>
          <div className={styles.heroEntrance}>

            <h1 id="package-title">{packageName}</h1>
            <p className={styles.heroTagline}>{pkg.tagline || packageData.badge}</p>
            <p className={styles.heroDescription}>{packageData.description}</p>
            <div className={styles.heroInfo}>
              {duration && <span><Clock3 size={18} aria-hidden="true" />{duration}</span>}
              <span><Users size={18} aria-hidden="true" />{pkg.travellerInfo || `${travellers} ${travellers === "1" ? "traveller" : "travellers"} selected`}</span>
              <span><MapPin size={18} aria-hidden="true" />{destination}</span>
            </div>
            <div className={styles.heroActions}><a href="#plan-your-trip" className={styles.heroBook}>Book This Package<ArrowRight size={17} aria-hidden="true" /></a><a href="#itinerary" className={styles.heroSecondary}>Explore itinerary<ArrowRight size={16} aria-hidden="true" /></a></div>
          </div>
          <div className={styles.heroFootnote}><span>Mayura Holidays</span><span>Explore the journey below <ArrowRight size={14} aria-hidden="true" /></span></div>
        </div>
      </section>

      <div className={styles.destinationPaper} data-destination={pkg.slug}>
      <DestinationBackdrop slug={pkg.slug} image={pkg.backgroundImage} />
      <div className={styles.specialities} aria-label="Travel specialities">{specialities.map((item, index) => {
        const Icon = specialityIcons[index];
        return <div key={index} className={styles.speciality}><span className={styles.specialityIcon}><Icon size={28} strokeWidth={1.6} aria-hidden="true" /></span><div><h2>{item.title}</h2><p>{item.description}</p></div></div>;
      })}</div>
      {/* Journey overview */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14">
          <PackageExperience key={pkg.slug} pkg={pkg} />

          {/* Booking panel */}
          <aside id="plan-your-trip" className="scroll-mt-28 lg:row-start-1 lg:col-start-2" aria-label="Book now">
            <div className="overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-xl shadow-ink/5 lg:sticky lg:top-28">
              <div className={styles.priceHeader}>
                <div className={styles.priceMedia}><DestinationImage key={pkg.slug} src={pkg.slug === "goa" ? "/video/posters/beaches.jpg" : pkg.image} alt={pkg.slug === "goa" ? "Daylight aerial photograph of Goa's sandy coastline" : pkg.imageAlt} sizes="(max-width: 1023px) 90vw, 340px" /></div>
                <div className={styles.priceOverlay} aria-hidden="true" />
                <div className={styles.priceContent}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                  Your getaway
                </p>

                <div className="mt-3 flex items-end gap-2">
                  <span className="text-3xl font-semibold">{price}</span>
                  {packageData.priceUnit && (
                    <span className="pb-1 text-sm text-white/65">
                      {packageData.priceUnit}
                    </span>
                  )}
                </div>

                <p className="mt-2 text-sm text-white/65">
                  Final pricing depends on your selected preferences.
                </p>
                </div>
              </div>

              <div className="space-y-5 p-6">
                <div>
                  <label
                    htmlFor="travel-date"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Preferred travel date
                  </label>
                  <div className="relative">
                    <CalendarDays
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate"
                    />
                    <input
                      id="travel-date"
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={travelDate}
                      onChange={(event) => setTravelDate(event.target.value)}
                      className="w-full rounded-xl border border-line bg-white py-3 pl-10 pr-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="travellers"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Number of travellers
                  </label>
                  <div className="relative">
                    <Users
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate"
                    />
                    <select
                      id="travellers"
                      value={travellers}
                      onChange={(event) => setTravellers(event.target.value)}
                      className="w-full appearance-none rounded-xl border border-line bg-white py-3 pl-10 pr-10 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10"
                    >
                      {Array.from({ length: 10 }, (_, index) => index + 1).map(
                        (count) => (
                          <option key={count} value={String(count)}>
                            {count} {count === 1 ? "traveller" : "travellers"}
                          </option>
                        ),
                      )}
                    </select>
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="accommodation"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Accommodation
                  </label>
                  <div className="relative">
                    <select
                      id="accommodation"
                      value={accommodation}
                      onChange={(event) =>
                        setAccommodation(event.target.value)
                      }
                      className="w-full appearance-none rounded-xl border border-line bg-white px-4 py-3 pr-10 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10"
                    >
                      <option value="Standard">Standard</option>
                      <option value="Deluxe">Deluxe</option>
                      <option value="Premium">Premium</option>
                    </select>
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate"
                    />
                  </div>
                </div>

                {bookingError && (
                  <p role="alert" className="text-sm text-red-600">
                    {bookingError}
                  </p>
                )}

                <button
                  type="button"
                  onClick={continueBooking}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-4 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy focus:outline-none focus:ring-4 focus:ring-accent/20"
                >
                  Continue to booking
                  <ArrowRight size={17} />
                </button>

                <div className="flex items-start gap-3 border-t border-line pt-5">
                  <ShieldCheck
                    size={19}
                    className="mt-0.5 shrink-0 text-navy"
                  />
                  <p className="text-xs leading-5 text-slate">
                    Your preferences are saved as you continue through the
                    Mayura booking process.
                  </p>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 size={14} />
                    Planned for you
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck size={14} />
                    Secure booking flow
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className={styles.finalCta} aria-labelledby="final-cta-title">
        <div className={styles.ctaMedia}><DestinationImage src={pkg.ctaImage || (pkg.slug === "goa" ? "/video/posters/beaches.jpg" : pkg.image)} alt="" sizes="100vw" /></div>
        <div className={styles.ctaOverlay} aria-hidden="true" />
        <Reveal className={styles.ctaContent}>
          <p>READY FOR YOUR NEXT ADVENTURE?</p>
          <h2 id="final-cta-title">Let&apos;s Plan Your Dream Trip</h2>
          <p>Get in touch with our travel experts for customised packages, great experiences, and unforgettable memories.</p>
          <a href={whatsappHref(business.whatsapp, pkg.whatsappMessage)} className={styles.heroBook}>Enquire Now<ArrowRight size={17} aria-hidden="true" /></a>
        </Reveal>
      </section>
      </div>
    </main>
  );
}
