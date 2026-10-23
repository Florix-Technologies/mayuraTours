"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ChevronDown, Clock3, LockKeyhole, Mail, Phone, X } from "lucide-react";
import { readBookingIntent, type BookingIntent } from "@/lib/booking/intent";
import { formatRupees, getPaymentReview } from "@/lib/booking/payment-review";
import { canUseDevelopmentPayment, isCompletePreviewBooking, startDevelopmentConfirmationPreview } from "@/lib/booking/development-payment";
import { packages } from "@/lib/data/packages";
import { destinations } from "@/lib/data/destinations";
import { business, telHref } from "@/lib/data/business";
import styles from "./payment.module.css";

const travellerHref = "/booking/traveler-details";
const policies = ["Terms & Conditions", "Cancellation & Refund Policy", "Privacy Policy"] as const;

// Preview metadata only. A future gateway must supply supported methods/providers
// before these controls can be enabled; logos do not indicate live acceptance.
const paymentMethodPreviews = [
  { id: "upi", title: "UPI", description: "Pay with your preferred UPI app", logos: [
    { name: "Google Pay", file: "google-pay.svg" },
    { name: "PhonePe", file: "phonepe.svg" },
    { name: "Paytm", file: "paytm.svg" },
  ] },
  { id: "card", title: "Credit / Debit Cards", description: "Pay using your card", logos: [
    { name: "Visa", file: "visa.png" },
    { name: "Mastercard", file: "mastercard.svg" },
    { name: "RuPay", file: "rupay.svg" },
  ] },
  { id: "netbanking", title: "Net Banking", description: "Pay through your bank", logos: [] },
];

export default function PaymentPage() {
  const router = useRouter();
  const [intent, setIntent] = useState<BookingIntent | null>(null);
  const [policy, setPolicy] = useState<string | null>(null);
  const policyDialog = useRef<HTMLDialogElement>(null);
  const [developmentPreview, setDevelopmentPreview] = useState(false);
  const [previewStarting, setPreviewStarting] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const previewInProgress = useRef(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setDevelopmentPreview(canUseDevelopmentPayment());
      const booking = readBookingIntent();
      if (!booking) router.replace("/packages");
      else setIntent(booking);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [router]);

  function openPolicy(title: string) {
    setPolicy(title);
    policyDialog.current?.showModal();
  }

  function previewConfirmation() {
    if (previewInProgress.current) return;
    previewInProgress.current = true;
    setPreviewStarting(true);
    setPreviewError("");
    try {
      const booking = readBookingIntent();
      if (!booking || !packages.some(item => item.slug === booking.slug)) {
        throw new Error("Select a valid package before previewing confirmation.");
      }
      startDevelopmentConfirmationPreview(booking);
      router.push("/booking/confirmation");
    } catch (error) {
      setPreviewError(error instanceof Error ? error.message : "Unable to open the development preview.");
      previewInProgress.current = false;
      setPreviewStarting(false);
    }
  }

  const pkg = packages.find(item => item.slug === intent?.slug);
  const destination = pkg?.destination || destinations
    .filter(item => item.packageSlugs.includes(intent?.slug ?? ""))
    .map(item => item.name).join(" · ");
  const review = intent ? getPaymentReview(intent, pkg) : null;
  const travellers = intent?.travellerDetails ?? [];
  const detailsComplete = Boolean(intent?.leadEmail?.trim() && intent?.leadPhone?.trim()
    && travellers.length === review?.travellerCount
    && travellers.every(traveller => traveller.fullName.trim() && traveller.age.trim() && traveller.gender));

  return (
    <div className={styles.checkout}>
      <header className={styles.header}>
        <div className={`${styles.container} ${styles.headerInner}`}>
          <Link href="/" className={styles.brand} aria-label="Mayura Holidays home">
            <Image src="/mayura.png" alt="Mayura Holidays" width={72} height={56} priority />
            <span><strong>Mayura Holidays</strong><small>Thoughtfully planned. Beautifully travelled.</small></span>
          </Link>
          <div className={styles.headerActions}>
            <span className={styles.secure}><LockKeyhole size={14} strokeWidth={1.6} aria-hidden="true" />Secure Checkout</span>
          </div>
        </div>
      </header>
      <main className={styles.container} id="checkout-main">
        <div className={styles.backRow}><Link href={travellerHref} className={styles.back}><ArrowLeft size={17} aria-hidden="true" /><span>Back to Traveller Details</span></Link></div>
        <div className={styles.intro}>
          <h1>Review &amp; Pay</h1>
          <p>One final check before you&apos;re on your way.</p>
        </div>
        {!intent || !review ? <p className={styles.loading} role="status">Loading your booking details…</p> : (
          <div className={styles.layout}>
            <div className={styles.mainColumn}>
              <section className={styles.panel} aria-labelledby="trip-title">
                <div className={styles.sectionHeading}><h2 id="trip-title">Your trip</h2><span className={styles.eyebrow}>Booking review</span></div>
                <div className={styles.trip}>
                  {pkg?.image && <div className={styles.tripImage}><Image src={pkg.image} alt={pkg.imageAlt} fill sizes="(max-width: 480px) 80px, 112px" /></div>}
                  <div className={styles.tripTitle}>
                    <p className={styles.eyebrow}>Mayura Holidays package</p>
                    <h3>{intent.packageName || pkg?.name}</h3>
                    {destination && <p>{destination}</p>}
                    <span className={styles.duration}>{review.duration}</span>
                  </div>
                </div>
                <dl className={styles.tripFacts}>
                  <div><dt>Departure</dt><dd>{review.startDate}</dd></div>
                  <div><dt>Trip end <span title="Calculated from the package duration">(scheduled)</span></dt><dd>{review.endDate}</dd></div>
                  <div><dt>Travellers</dt><dd>{review.travellerCount} {review.travellerCount === 1 ? "traveller" : "travellers"}</dd></div>
                  <div><dt>Accommodation</dt><dd className={styles.capitalize}>{intent.accommodation || "To be confirmed"}</dd></div>
                </dl>
                <details className={styles.tripDetails}>
                  <summary>View trip details<ChevronDown size={16} aria-hidden="true" /></summary>
                  <div className={styles.tripDetailsBody}>
                    {pkg?.description && <p>{pkg.description}</p>}
                    {!!pkg?.itinerary?.length && <><h4>Itinerary at a glance</h4><ol>{pkg.itinerary.slice(0, 3).map((day, index) => <li key={index}>{typeof day === "string" ? day : day.title || day.day || day.description || day.details}</li>)}</ol></>}
                    <div className={styles.inclusions}>
                      <div><h4>Included</h4>{pkg?.included?.length ? <ul>{pkg.included.map((item, index) => <li key={index}>{typeof item === "string" ? item : item.title || item.name || item.description}</li>)}</ul> : <p>Package inclusions are awaiting confirmation.</p>}</div>
                      <div><h4>Not included</h4>{pkg?.excluded?.length ? <ul>{pkg.excluded.map((item, index) => <li key={index}>{typeof item === "string" ? item : item.title || item.name || item.description}</li>)}</ul> : <p>Package exclusions are awaiting confirmation.</p>}</div>
                    </div>
                    <Link href={`/packages/${intent.slug}`} className={styles.textLink}>Full package details<ArrowUpRight size={14} aria-hidden="true" /></Link>
                  </div>
                </details>
              </section>
              <section className={styles.panel} aria-labelledby="travellers-title">
                <div className={styles.sectionHeading}><h2 id="travellers-title">Traveller details</h2><Link href={travellerHref} className={styles.textLink}>Edit details<ArrowUpRight size={14} aria-hidden="true" /></Link></div>
                <p className={styles.sectionDescription}>Please check that every name matches the traveller&apos;s ID.</p>
                {travellers.length > 0 ? <ol className={styles.travellerList}>{travellers.map((traveller, index) => (
                  <li key={index}>
                    <span className={styles.travellerNumber}>{String(index + 1).padStart(2, "0")}</span>
                    <div><strong>{traveller.fullName || "Name not provided"}</strong><p>{traveller.age ? `${traveller.age} years` : "Age not provided"}<span aria-hidden="true"> / </span><span className={styles.capitalize}>{traveller.gender || "Gender not provided"}</span></p></div>
                    {index === 0 && <span className={styles.lead}>Lead traveller</span>}
                  </li>
                ))}</ol> : <p className={styles.emptyDetails}>Traveller information hasn&apos;t been added yet. <Link href={travellerHref}>Add traveller details</Link></p>}
                <div className={styles.contactReview}>
                  <p className={styles.eyebrow}>Booking contact</p>
                  <dl><div><dt>Email address</dt><dd>{intent.leadEmail || "Not provided"}</dd></div><div><dt>Mobile number</dt><dd>{intent.leadPhone || "Not provided"}</dd></div></dl>
                </div>
                {!detailsComplete && <p className={styles.validation} role="status">Complete the traveller and contact details before making a payment.</p>}
              </section>
              <section className={styles.panel} aria-labelledby="payment-title">
                <div className={styles.sectionHeading}><h2 id="payment-title">Select Payment Method</h2></div>
                <p className={styles.sectionDescription} id="payment-availability">Payment options preview. Provider availability will be confirmed at checkout.</p>
                <fieldset className={styles.paymentMethods} disabled aria-labelledby="payment-title" aria-describedby="payment-availability">
                  {paymentMethodPreviews.map(method => (
                    <label key={method.id} className={styles.paymentMethod}>
                      <input type="radio" name="payment-method" value={method.id} />
                      <span className={styles.paymentMethodText}><strong>{method.title}</strong><small>{method.description}</small></span>
                      {method.logos.length > 0 && <span className={styles.paymentLogos} aria-label={`${method.title} provider logos (preview)`}>
                        {method.logos.map(logo => <Image key={logo.name} src={`/images/payment/${logo.file}`} alt={logo.name} width={68} height={28} unoptimized />)}
                      </span>}
                    </label>
                  ))}
                </fieldset>
              </section>
              <section className={styles.panel} aria-labelledby="policies-title">
                <div className={styles.sectionHeading}><h2 id="policies-title">Before you book</h2></div>
                <p className={styles.sectionDescription} id="policy-availability">Booking terms, cancellation charges and refund conditions are awaiting publication. Please request the applicable policies from Mayura Holidays before paying.</p>
                <div className={styles.policyLinks}>{policies.map(title => <button key={title} type="button" aria-haspopup="dialog" onClick={() => openPolicy(title)}>{title}<ArrowUpRight size={13} aria-hidden="true" /></button>)}</div>
                <label className={styles.acceptance}><input type="checkbox" disabled aria-describedby="policy-availability" /><span>I have reviewed and agree to the Booking Terms &amp; Conditions and Cancellation &amp; Refund Policy.</span></label>
                <p className={styles.acceptanceNote}>Acceptance will be available once the policies are published.</p>
              </section>
            </div>
            <aside className={styles.sidebar} aria-label="Price summary">
              <section className={`${styles.panel} ${styles.pricePanel}`} aria-labelledby="price-title">
                <div className={styles.sectionHeading}><h2 id="price-title">Price summary</h2><span className={styles.priceCurrency}>INR</span></div>
                <dl className={styles.priceLines}>
                  <div><dt>Package price<small>Per person</small></dt><dd>{formatRupees(review.pricePerPerson)}</dd></div>
                  <div><dt>Number of travellers</dt><dd>× {review.travellerCount}</dd></div>
                  <div className={styles.subtotal}><dt>Package subtotal</dt><dd>{formatRupees(review.totalAmount)}</dd></div>
                </dl>
                <div className={styles.total}><span>Total package price</span><strong>{formatRupees(review.totalAmount)}</strong></div>
                <p className={styles.priceNote}>Based on the listed package price. Final payable amount, applicable taxes and any accommodation adjustments must be confirmed by our booking team.</p>
                {developmentPreview && !isCompletePreviewBooking(intent) && <p className={styles.validation}>Complete the package, travel date, accommodation, contact and traveller details to open the preview.</p>}
                <button className={styles.payButton} type="button" disabled={!developmentPreview || previewStarting || !pkg || !isCompletePreviewBooking(intent)} onClick={previewConfirmation} aria-busy={previewStarting} aria-describedby={developmentPreview ? "development-preview-note" : "payment-availability"}>{previewStarting ? "Opening preview…" : "Pay Securely"}</button>
                {previewError && <p className={styles.validation} role="alert">{previewError}</p>}
                <p className={styles.paymentNote} id={developmentPreview ? "development-preview-note" : undefined}>{developmentPreview ? "Local development preview — no charge or booking is created." : "Review your booking details and terms before continuing."}</p>
                <div className={styles.summaryFooter}><span className={styles.neutralDot} aria-hidden="true" />Your trip, all in one place.</div>
              </section>
              <section className={styles.help} aria-labelledby="help-title">
                <svg className={styles.helpBackdrop} viewBox="0 0 96 96" fill="none" aria-hidden="true" focusable="false">
                  <circle cx="48" cy="48" r="47" fill="var(--help-illustration)" />
                  <g stroke="var(--help-ink)" strokeWidth="2.2" strokeOpacity=".65" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M26 54V43A22 22 0 0 1 70 43V54" />
                    <path d="M31 39A17 17 0 0 1 65 39" strokeOpacity=".55" />
                    <rect x="23" y="46" width="10" height="21" rx="4" fill="var(--help-illustration)" />
                    <rect x="63" y="46" width="10" height="21" rx="4" fill="var(--help-illustration)" />
                    <path d="M68 68V71C68 76 58 78 53 78" />
                    <rect x="44" y="75" width="10" height="5" rx="2.5" fill="var(--help-illustration)" />
                  </g>
                </svg>
                <div className={styles.helpContent}>
                  <h2 id="help-title">Need help with your booking?</h2>
                  <p>Our team is happy to help with your trip.</p>
                  <ul className={styles.helpRows}>
                    <li><a className={styles.helpRow} href={telHref(business.phone)}>
                      <span className={styles.helpIcon}><Phone size={17} strokeWidth={1.6} aria-hidden="true" /></span>
                      <span className={styles.helpRowText}><span>Call us</span><strong>{business.phone}</strong></span>
                      <ArrowUpRight className={styles.helpArrow} size={15} aria-hidden="true" />
                    </a></li>
                    <li><a className={styles.helpRow} href={`mailto:${business.email}`}>
                      <span className={styles.helpIcon}><Mail size={17} strokeWidth={1.6} aria-hidden="true" /></span>
                      <span className={styles.helpRowText}><span>Email us</span><strong>{business.email.split("@")[0]}<wbr />@{business.email.split("@")[1]}</strong></span>
                      <ArrowUpRight className={styles.helpArrow} size={15} aria-hidden="true" />
                    </a></li>
                    <li><div className={styles.helpRow}>
                      <span className={styles.helpIcon}><Clock3 size={17} strokeWidth={1.6} aria-hidden="true" /></span>
                      <span className={styles.helpRowText}><span>Available on</span><strong>{business.hours}</strong></span>
                    </div></li>
                  </ul>
                </div>
              </section>
            </aside>
          </div>
        )}
        <footer className={styles.footer}><span>Mayura Holidays · Since {business.foundedYear}</span><span>{business.legalName}</span></footer>
      </main>
      <dialog className={styles.policyDialog} ref={policyDialog} aria-labelledby="policy-dialog-title" onClick={event => { if (event.target === event.currentTarget) policyDialog.current?.close(); }}>
        <div className={styles.dialogHeading}><h2 id="policy-dialog-title">{policy}</h2><button type="button" aria-label="Close policy information" onClick={() => policyDialog.current?.close()}><X size={20} aria-hidden="true" /></button></div>
        <p>This policy has not been published here yet. Please request the current document from Mayura Holidays before arranging payment.</p>
        <a className={styles.textLink} href={`mailto:${business.email}`}>Request policy by email<ArrowUpRight size={14} aria-hidden="true" /></a>
      </dialog>
    </div>
  );
}
