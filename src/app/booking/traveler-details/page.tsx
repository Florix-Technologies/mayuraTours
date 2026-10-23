"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { DestinationImage } from "@/components/packages/PackageExperience";
import { packages } from "@/lib/data/packages";
import { business, telHref } from "@/lib/data/business";
import styles from "./traveller-details.module.css";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { loginHref } from "@/lib/auth/paths";
import {
  readBookingIntent,
  updateBookingIntent,
  type BookingIntent,
} from "@/lib/booking/intent";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Users,
  UserRound,
  House,
  Info,
  Mail,
  Phone,
} from "lucide-react";

type Traveller = {
  fullName: string;
  age: string;
  gender: string;
};

const emptyTraveller = (): Traveller => ({
  fullName: "",
  age: "",
  gender: "",
});

export default function TravelerDetailsPage() {
  const { user } = useAuth();
  // A different account receives a fresh form, including manual edits and contact data.
  return <TravelerDetailsForm key={user?.email ?? "signed-out"} />;
}

function TravelerDetailsForm() {
  const router = useRouter();
  const { user, isAuthenticated, isReady } = useAuth();

  const [intent, setIntent] = useState<BookingIntent | null>(null);

  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");

  const [travellers, setTravellers] = useState<Traveller[]>([]);

  const [travellingSelf, setTravellingSelf] = useState<boolean | null>(null);

  const [error, setError] = useState("");
  const [appliedProfile, setAppliedProfile] = useState<Traveller>(emptyTraveller);
  const editedLeadFields = useRef(new Set<keyof Traveller>());

  useEffect(() => {
    if (!isReady) return;

    if (!isAuthenticated) {
      router.replace(loginHref("/booking/traveler-details"));
      return;
    }

    const booking = readBookingIntent();

    setIntent(booking);

    if (!booking) return;

    const count = Math.max(Number(booking.travellers) || 1, 1);

    setTravellers(
      Array.from({ length: count }, (_, index) => ({
        ...(booking.travellerDetails?.[index] ?? emptyTraveller()),
      })),
    );
    if (booking.leadEmail) setLeadEmail(booking.leadEmail);
    if (booking.leadPhone) setLeadPhone(booking.leadPhone);
  }, [isAuthenticated, isReady, router]);

  useEffect(() => {
    // Synchronize the asynchronously restored account without replacing user input.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (user?.email) setLeadEmail((current) => current || user.email);
  }, [user?.email]);

  const profileName = user?.name?.trim() ?? "";
  const profileAge = user?.age?.trim() ?? "";
  const savedGender = user?.gender?.trim().toLowerCase() ?? "";
  const profileGender = ["male", "female", "other"].includes(savedGender)
    ? savedGender
    : "";

  useEffect(() => {
    if (!isReady || travellingSelf !== true) return;

    // Late profile data may fill untouched fields, but must preserve manual edits.
    const profile: Traveller = {
      fullName: profileName,
      age: profileAge,
      gender: profileGender,
    };
    const edited = new Set(editedLeadFields.current);
    const applied = { ...profile };
    for (const field of ["fullName", "age", "gender"] as const) {
      if (edited.has(field)) applied[field] = "";
    }
    // Record which values this profile synchronization actually applies.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAppliedProfile(applied);
    setTravellers((current) =>
      current.map((traveller, index) => {
        if (index !== 0) return traveller;
        const next = { ...traveller };
        for (const field of ["fullName", "age", "gender"] as const) {
          if (!edited.has(field)) next[field] = profile[field];
        }
        return next;
      }),
    );
  }, [isReady, travellingSelf, profileName, profileAge, profileGender, travellers.length]);

  const profileApplied = travellingSelf === true && Boolean(
    (appliedProfile.fullName && travellers[0]?.fullName === appliedProfile.fullName) ||
    (appliedProfile.age && travellers[0]?.age === appliedProfile.age) ||
    (appliedProfile.gender && travellers[0]?.gender === appliedProfile.gender),
  );
  const travellerCount = travellers.length || 1;

  const formattedDate = useMemo(() => {
    if (!intent?.travelDate) return "To be confirmed";

    const date = new Date(`${intent.travelDate}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return intent.travelDate;
    }

    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  }, [intent?.travelDate]);

  function updateTraveller(
    index: number,
    field: keyof Traveller,
    value: string,
  ) {
    if (index === 0) editedLeadFields.current.add(field);
    setTravellers((current) =>
      current.map((traveller, travellerIndex) =>
        travellerIndex === index
          ? {
              ...traveller,
              [field]: value,
            }
          : traveller,
      ),
    );

    setError("");
  }

  function handleSelfChoice(isSelf: boolean) {
    if (travellingSelf === isSelf) return;

    editedLeadFields.current.clear();
    setAppliedProfile(emptyTraveller());
    setTravellingSelf(isSelf);
    setError("");
    setTravellers((current) =>
      current.map((traveller, index) =>
        index === 0 && (isSelf || travellingSelf !== null) ? emptyTraveller() : traveller,
      ),
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!intent) return;

    if (travellingSelf === null) {
      setError(
        "Please select whether you are travelling yourself or booking for someone else.",
      );
      return;
    }

    if (!leadEmail.trim() || !leadPhone.trim()) {
      setError("Please enter your email address and mobile number.");
      return;
    }

    const missingTraveller = travellers.some(
      (traveller) =>
        !traveller.fullName.trim() ||
        !traveller.age.trim() ||
        !traveller.gender,
    );

    if (missingTraveller) {
      setError("Please complete the details for every traveller.");
      return;
    }

    updateBookingIntent({
      leadEmail: leadEmail.trim(),
      leadPhone: leadPhone.trim(),
      travellerDetails: travellers,
    });

    router.push("/booking/payment");
  }

  if (!isReady || !isAuthenticated) {
    return <main className="min-h-screen bg-[#F8FAFD]" />;
  }

  if (!intent) {
    return (
      <main className="min-h-screen bg-[#F8FAFD] pt-28 pb-16 sm:pt-32">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <div className="rounded-[28px] border border-[#E5EAF1] bg-white p-8 text-center shadow-[0_20px_60px_-40px_rgba(8,45,92,0.25)]">
            <p className="text-sm text-slate">
              No package is selected yet. Choose a tour to start booking.
            </p>

            <Link
              href="/packages"
              className="mt-5 inline-flex rounded-full bg-navy px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-accent"
            >
              View packages
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const pkg = packages.find((item) => item.slug === intent.slug);
  const journeyImage = pkg?.slug === "goa" ? "/video/posters/beaches.jpg" : pkg?.image || "/video/posters/western-ghats.jpg";
  const imageAlt = pkg?.imageAlt || "Scenic landscape along the journey";

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="traveller-title">
        <div className={styles.heroImage}><DestinationImage key={intent.slug} src={journeyImage} alt={imageAlt} eager sizes="100vw" /></div>
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={styles.container}>
          <button type="button" onClick={() => router.back()} className={styles.heroBack}><ArrowLeft size={14} />Back to Booking</button>
          <p className={styles.step}>Step 2 &bull; Traveller Details</p>
          <h1 id="traveller-title">Who&apos;s joining<br />the journey?</h1>
          <p className={styles.subtitle}>Tell us who&apos;s travelling so we can prepare your booking details correctly.</p>
        </div>
      </section>
      <div className={`${styles.container} ${styles.content}`}>
        <form onSubmit={handleSubmit} className={styles.layout}>
          <div className={styles.main}>
            <div className={styles.entry}><section className={styles.section} aria-labelledby="contact-title">
              <p className={styles.eyebrow}>Your contact</p>
              <h2 id="contact-title">How can we reach you?</h2>
              <p className={styles.description}>We&apos;ll send booking updates and important travel information to these details.</p>
              <div className={styles.contactFields}>
                <label><span>Email address</span><div className={styles.inputIcon}><Mail size={17} aria-hidden="true" /><input type="email" autoComplete="email" value={leadEmail} onChange={(event) => { setLeadEmail(event.target.value); setError(""); }} placeholder="Enter email address" /></div></label>
                <label><span>Mobile number</span><div className={styles.inputIcon}><Phone size={17} aria-hidden="true" /><input type="tel" autoComplete="tel" value={leadPhone} onChange={(event) => { setLeadPhone(event.target.value); setError(""); }} placeholder="Enter mobile number" /></div></label>
              </div>
            </section></div>
            <div className={styles.entry}><section className={styles.bookingFor} aria-labelledby="booking-for-title">
              <p className={styles.eyebrow}>Traveller 01</p>
              <h2 id="booking-for-title">Who is the booking for?</h2>
              <p className={styles.description}>Choose an option and we&apos;ll prepare the first traveller&apos;s details accordingly.</p>
              <div className={styles.choices} role="group" aria-labelledby="booking-for-title">
                {[{ self: true, title: "I'm travelling", detail: "Use my profile details", icon: UserRound }, { self: false, title: "I'm booking for someone", detail: "Enter their details manually", icon: Users }].map(({ self, title, detail, icon: Icon }) => (
                  <button key={String(self)} type="button" aria-pressed={travellingSelf === self} onClick={() => handleSelfChoice(self)} className={styles.choice}>
                    <span className={styles.choiceIcon}><Icon size={21} strokeWidth={1.6} aria-hidden="true" /></span>
                    <span className={styles.choiceText}><strong>{title}</strong><small>{detail}</small></span>
                    <span className={styles.check}>{travellingSelf === self && <Check size={12} strokeWidth={3} aria-hidden="true" />}</span>
                  </button>
                ))}
              </div>
              {profileApplied && <p className={styles.profileNote}>Your saved profile details have been applied to Traveller 1. You can still edit anything here.</p>}
            </section></div>
            <div className={styles.entry}><section className={styles.section} aria-labelledby="information-title">
              <p className={styles.eyebrow}>Traveller information</p>
              <div className={styles.sectionHeading}><h2 id="information-title">Traveller details</h2><span className={styles.count}>{travellerCount} {travellerCount === 1 ? "Traveller" : "Travellers"}</span></div>
              <p className={styles.description}>Enter the details exactly as they should appear on the booking.</p>
              <div className={styles.travellers}>
                {travellers.map((traveller, index) => (
                  <section key={index} className={styles.traveller} aria-labelledby={`traveller-${index}`}>
                    <div className={styles.travellerHeader}><span className={styles.number}>{String(index + 1).padStart(2, "0")}</span><div><h3 id={`traveller-${index}`}>{index === 0 ? "Lead traveller" : `Traveller ${index + 1}`}</h3>{index === 0 && profileApplied && <small>Profile details applied</small>}</div>{index === 0 && <span className={styles.lead}>Lead</span>}</div>
                    <div className={styles.travellerFields}>
                      <label><span>Full name</span><input type="text" value={traveller.fullName} onChange={(event) => updateTraveller(index, "fullName", event.target.value)} placeholder="Enter full name" /></label>
                      <label><span>Age</span><input type="number" min="1" max="120" value={traveller.age} onChange={(event) => updateTraveller(index, "age", event.target.value)} placeholder="Enter age" /></label>
                      <label><span>Gender</span><select value={traveller.gender} onChange={(event) => updateTraveller(index, "gender", event.target.value)}><option value="">Select gender</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></label>
                    </div>
                  </section>
                ))}
              </div>
            </section></div>
            {error && <p className={styles.error} role="alert">{error}</p>}
            <div className={styles.actions}>
              <button type="button" onClick={() => router.back()} className={styles.back}><ArrowLeft size={16} />Back</button>
              <button type="submit" className={styles.continue}>Continue to Payment<ArrowRight size={17} /></button>
            </div>
          </div>
          <aside className={styles.sidebar} aria-label="Your booking summary and assistance">
            <section className={styles.summary} aria-labelledby="journey-title">
              <div className={styles.summaryImage}>
                <DestinationImage key={intent.slug} src={journeyImage} alt={imageAlt} sizes="(max-width: 1023px) 90vw, 350px" />
                <div className={styles.summaryOverlay} />
                <div className={styles.summaryTitle}><p>Your journey</p><h2 id="journey-title">{intent.packageName}</h2></div>
              </div>
              <div className={styles.summaryBody}>
                <dl className={styles.facts}>
                  <div><dt><span className={styles.factIcon}><CalendarDays size={20} aria-hidden="true" /></span><span>Travel date</span></dt><dd>{formattedDate}</dd></div>
                  <div><dt><span className={styles.factIcon}><Users size={20} aria-hidden="true" /></span><span>Travellers</span></dt><dd>{intent.travellers} {intent.travellers === "1" ? "Adult" : "Adults"}</dd></div>
                  <div><dt><span className={styles.factIcon}><House size={20} aria-hidden="true" /></span><span>Accommodation</span></dt><dd className="capitalize">{intent.accommodation || "To be confirmed"}</dd></div>
                </dl>
                <div className={styles.price}><p>Package price</p><strong>To be confirmed</strong></div>
                <div className={styles.security}><Info size={19} aria-hidden="true" /><p>Your details are saved securely and will be carried forward to the payment step.</p></div>
              </div>
            </section>
            <section className={styles.help} aria-labelledby="help-title">
              <div className={styles.helpText}><h2 id="help-title">Need help with your booking?</h2><p>Our team is here to assist you at every step.</p><a href={telHref(business.phone)}><Phone size={18} aria-hidden="true" />{business.phone}</a><a href={`mailto:${business.email}`}><Mail size={18} aria-hidden="true" />{business.email}</a></div>
              <Image src="/images/traveller-details/booking-help.svg" alt="A Mayura coach travelling through peaceful hills on a winding road" width={600} height={300} className={styles.helpArtwork} unoptimized />
            </section>
          </aside>
        </form>
      </div>
    </main>
  );
}
