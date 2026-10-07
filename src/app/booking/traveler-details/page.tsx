"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
  const router = useRouter();
  const { user, isAuthenticated, isReady } = useAuth();

  const [intent, setIntent] = useState<BookingIntent | null>(null);

  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");

  const [travellers, setTravellers] = useState<Traveller[]>([]);

  const [travellingSelf, setTravellingSelf] = useState<boolean | null>(null);

  const [error, setError] = useState("");

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
      Array.from({ length: count }, () => emptyTraveller()),
    );

    if (user?.email) {
      setLeadEmail(user.email);
    }
  }, [isAuthenticated, isReady, router, user]);

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
    setTravellingSelf(isSelf);
    setError("");

    if (travellers.length === 0) return;

    if (!isSelf) {
      setTravellers((current) =>
        current.map((traveller, index) =>
          index === 0 ? emptyTraveller() : traveller,
        ),
      );

      return;
    }

    if (!user) {
      setError(
        "We couldn't find your saved profile details. Please enter them manually.",
      );
      return;
    }

    const fullName = user.name?.trim() ?? "";
    const age = user.age ? String(user.age) : "";
    const gender = user.gender?.trim() ?? "";

    setTravellers((current) =>
      current.map((traveller, index) =>
        index === 0
          ? {
              ...traveller,
              fullName,
              age,
              gender,
            }
          : traveller,
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

  return (
    <main className="min-h-screen bg-[#F8FAFD] pb-20">

      {/* HERO */}
      <section className="relative isolate min-h-[390px] overflow-hidden bg-navy pt-24 pb-16 sm:min-h-[430px] sm:pt-28 sm:pb-20">

        {/* Background image */}
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/traveller-details-hero.jpeg')",
          }}
        />

        {/* Cinematic dark overlay */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#031B3B]/95 via-[#062F61]/65 to-[#062F61]/20" />

        {/* Subtle bottom fade */}
        <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-[#0b2d52]/45 to-transparent" />

        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">

          {/* Back button */}
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-10 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-white/15"
          >
            <ArrowLeft size={15} />
            Back to Booking
          </button>

          {/* Hero content */}
          <div className="max-w-2xl">

            {/* Step label */}
            <div className="flex items-center gap-3">
              <span className="h-px w-9 bg-accent" />

              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/75">
                Step 2 · Traveller Details
              </p>
            </div>

            {/* Heading */}
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] text-white sm:text-5xl lg:text-[54px]">
              Who&apos;s joining
              <br />
              the journey?
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
              Tell us who&apos;s travelling so we can prepare your booking
              details correctly.
            </p>

          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="relative -mt-5">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <form
            onSubmit={handleSubmit}
            className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_330px]"
          >

            {/* MAIN FORM */}
            <div className="space-y-6">

              {/* CONTACT */}
              <section className="rounded-[28px] border border-[#E4E9F0] bg-white p-6 shadow-[0_20px_60px_-45px_rgba(8,45,92,0.3)] sm:p-8">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.18em] text-accent uppercase">
                    Your contact
                  </p>

                  <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-navy">
                    How can we reach you?
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate">
                    We&apos;ll send booking updates and important travel
                    information to these details.
                  </p>
                </div>

                <div className="mt-7 grid gap-5 sm:grid-cols-2">

                  <label className="block">
                    <span className="mb-2 block text-xs font-bold text-navy">
                      Email address
                    </span>

                    <div className="relative">
                      <Mail
                        size={16}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8EA0B8]"
                      />

                      <input
                        type="email"
                        value={leadEmail}
                        onChange={(event) => {
                          setLeadEmail(event.target.value);
                          setError("");
                        }}
                        placeholder="you@example.com"
                        className="w-full rounded-2xl border border-[#DDE5EF] bg-[#FBFCFE] py-3.5 pl-11 pr-4 text-sm text-navy outline-none transition-all placeholder:text-[#9AA9BC] focus:border-blue focus:bg-white focus:ring-4 focus:ring-blue/5"
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-bold text-navy">
                      Mobile number
                    </span>

                    <div className="relative">
                      <Phone
                        size={16}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8EA0B8]"
                      />

                      <input
                        type="tel"
                        value={leadPhone}
                        onChange={(event) => {
                          setLeadPhone(event.target.value);
                          setError("");
                        }}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-2xl border border-[#DDE5EF] bg-[#FBFCFE] py-3.5 pl-11 pr-4 text-sm text-navy outline-none transition-all placeholder:text-[#9AA9BC] focus:border-blue focus:bg-white focus:ring-4 focus:ring-blue/5"
                      />
                    </div>
                  </label>

                </div>
              </section>

              {/* WHO IS TRAVELLING */}
              <section className="rounded-[28px] border border-[#E4E9F0] bg-white p-6 shadow-[0_20px_60px_-45px_rgba(8,45,92,0.3)] sm:p-8">

                <div>
                  <p className="text-[10px] font-bold tracking-[0.18em] text-accent uppercase">
                    Traveller 01
                  </p>

                  <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-navy">
                    Who is the booking for?
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate">
                    Choose an option and we&apos;ll prepare the first
                    traveller&apos;s details accordingly.
                  </p>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">

                  {/* SELF */}
                  <button
                    type="button"
                    onClick={() => handleSelfChoice(true)}
                    className={`group flex items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                      travellingSelf === true
                        ? "border-blue bg-[#F2F7FF] ring-2 ring-blue/10"
                        : "border-[#E1E7EF] bg-[#FCFDFE] hover:border-[#B9CBE2] hover:bg-white"
                    }`}
                  >
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold transition-colors ${
                        travellingSelf === true
                          ? "bg-blue text-white"
                          : "bg-[#EEF4FC] text-blue"
                      }`}
                    >
                      01
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-navy">
                        I&apos;m travelling
                      </span>

                      <span className="mt-1 block text-xs text-slate">
                        Use my profile details
                      </span>
                    </span>

                    {travellingSelf === true && (
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue text-white">
                        <Check size={13} strokeWidth={3} />
                      </span>
                    )}
                  </button>

                  {/* SOMEONE ELSE */}
                  <button
                    type="button"
                    onClick={() => handleSelfChoice(false)}
                    className={`group flex items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                      travellingSelf === false
                        ? "border-accent bg-[#FFF6F9] ring-2 ring-accent/10"
                        : "border-[#E1E7EF] bg-[#FCFDFE] hover:border-[#D8BBC8] hover:bg-white"
                    }`}
                  >
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold transition-colors ${
                        travellingSelf === false
                          ? "bg-accent text-white"
                          : "bg-[#FCF0F4] text-accent"
                      }`}
                    >
                      02
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-navy">
                        I&apos;m booking for someone
                      </span>

                      <span className="mt-1 block text-xs text-slate">
                        Enter their details manually
                      </span>
                    </span>

                    {travellingSelf === false && (
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                        <Check size={13} strokeWidth={3} />
                      </span>
                    )}
                  </button>

                </div>

                {travellingSelf === true && (
                  <div className="mt-4 rounded-2xl border border-[#D7E6FA] bg-[#F5F9FF] px-4 py-3.5">
                    <p className="text-xs leading-5 text-[#45607F]">
                      Your saved profile details have been applied to
                      Traveller 1. You can still edit anything here.
                    </p>
                  </div>
                )}

              </section>

              {/* TRAVELLERS */}
              <section className="rounded-[28px] border border-[#E4E9F0] bg-white p-6 shadow-[0_20px_60px_-45px_rgba(8,45,92,0.3)] sm:p-8">

                <div className="flex items-end justify-between gap-5">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.18em] text-accent uppercase">
                      Travel party
                    </p>

                    <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-navy">
                      Traveller information
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate">
                      Enter the details exactly as they should appear on the
                      booking.
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-[#EEF5FF] px-3.5 py-2 text-xs font-bold text-blue">
                    {travellerCount}{" "}
                    {travellerCount === 1 ? "Traveller" : "Travellers"}
                  </span>
                </div>

                <div className="mt-7 space-y-4">

                  {travellers.map((traveller, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-[24px] border border-[#E1E7EF] bg-[#FCFDFE]"
                    >

                      <div className="flex items-center justify-between border-b border-[#E8EDF3] px-5 py-4 sm:px-6">

                        <div className="flex items-center gap-3">

                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-[11px] font-extrabold text-white">
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <div>
                            <h3 className="text-sm font-extrabold text-navy">
                              {index === 0
                                ? "Lead traveller"
                                : `Traveller ${index + 1}`}
                            </h3>

                            {index === 0 && travellingSelf === true && (
                              <p className="mt-0.5 text-[11px] font-semibold text-blue">
                                Profile details applied
                              </p>
                            )}
                          </div>

                        </div>

                        {index === 0 && (
                          <span className="hidden rounded-full border border-[#DCE7F5] bg-white px-3 py-1 text-[10px] font-bold tracking-wide text-slate uppercase sm:inline-flex">
                            Lead
                          </span>
                        )}

                      </div>

                      <div className="p-5 sm:p-6">

                        <div className="grid gap-5 sm:grid-cols-2">

                          <label className="block sm:col-span-2">
                            <span className="mb-2 block text-xs font-bold text-navy">
                              Full name
                            </span>

                            <input
                              type="text"
                              value={traveller.fullName}
                              onChange={(event) =>
                                updateTraveller(
                                  index,
                                  "fullName",
                                  event.target.value,
                                )
                              }
                              placeholder="Enter full name"
                              className="w-full rounded-2xl border border-[#DDE5EF] bg-white px-4 py-3.5 text-sm text-navy outline-none transition-all placeholder:text-[#9AA9BC] focus:border-blue focus:ring-4 focus:ring-blue/5"
                            />
                          </label>

                          <label className="block">
                            <span className="mb-2 block text-xs font-bold text-navy">
                              Age
                            </span>

                            <input
                              type="number"
                              min="1"
                              max="120"
                              value={traveller.age}
                              onChange={(event) =>
                                updateTraveller(
                                  index,
                                  "age",
                                  event.target.value,
                                )
                              }
                              placeholder="Enter age"
                              className="w-full rounded-2xl border border-[#DDE5EF] bg-white px-4 py-3.5 text-sm text-navy outline-none transition-all placeholder:text-[#9AA9BC] focus:border-blue focus:ring-4 focus:ring-blue/5"
                            />
                          </label>

                          <label className="block">
                            <span className="mb-2 block text-xs font-bold text-navy">
                              Gender
                            </span>

                            <select
                              value={traveller.gender}
                              onChange={(event) =>
                                updateTraveller(
                                  index,
                                  "gender",
                                  event.target.value,
                                )
                              }
                              className="w-full cursor-pointer rounded-2xl border border-[#DDE5EF] bg-white px-4 py-3.5 text-sm font-medium text-navy outline-none transition-all focus:border-blue focus:ring-4 focus:ring-blue/5"
                            >
                              <option value="">Select gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </select>
                          </label>

                        </div>

                      </div>
                    </div>
                  ))}

                </div>
              </section>

              {/* ERROR */}
              {error ? (
                <p
                  className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                  role="alert"
                >
                  {error}
                </p>
              ) : null}

              {/* ACTIONS */}
              <div className="flex flex-col-reverse gap-3 border-t border-[#E1E7EF] pt-6 sm:flex-row sm:items-center sm:justify-between">

                <button
                  type="button"
                  onClick={() => router.back()}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#DCE4ED] bg-white px-6 py-3.5 text-sm font-bold text-navy transition-all hover:border-[#C6D3E2] hover:bg-[#FBFCFE]"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>

                <button
                  type="submit"
                  className="group inline-flex items-center justify-center gap-3 rounded-full bg-navy px-7 py-3.5 text-sm font-extrabold text-white shadow-[0_15px_35px_-15px_rgba(7,53,112,0.45)] transition-all hover:-translate-y-0.5 hover:bg-accent"
                >
                  Continue to Payment

                  <ArrowRight
                    size={17}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </button>

              </div>

            </div>

            {/* TRIP SUMMARY */}
            <aside className="lg:sticky lg:top-28 lg:self-start">

              <div className="overflow-hidden rounded-[28px] border border-[#DDE5EF] bg-white shadow-[0_24px_70px_-45px_rgba(8,45,92,0.35)]">

                <div className="bg-navy px-6 py-6 text-white sm:px-7">

                  <p className="text-[10px] font-bold tracking-[0.18em] text-white/55 uppercase">
                    Your journey
                  </p>

                  <h2 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight">
                    {intent.packageName}
                  </h2>

                </div>

                <div className="p-6 sm:p-7">

                  <div className="space-y-5">

                    {/* DATE */}
                    <div className="flex items-start gap-4">

                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue" />

                      <div>
                        <p className="text-[10px] font-bold tracking-[0.12em] text-[#91A0B4] uppercase">
                          Travel date
                        </p>

                        <p className="mt-1 text-sm font-bold text-navy">
                          {formattedDate}
                        </p>
                      </div>

                    </div>

                    {/* TRAVELLERS */}
                    <div className="flex items-start gap-4">

                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue" />

                      <div>
                        <p className="text-[10px] font-bold tracking-[0.12em] text-[#91A0B4] uppercase">
                          Travellers
                        </p>

                        <p className="mt-1 text-sm font-bold text-navy">
                          {intent.travellers}{" "}
                          {intent.travellers === "1" ? "Adult" : "Adults"}
                        </p>
                      </div>

                    </div>

                    {/* ACCOMMODATION */}
                    <div className="flex items-start gap-4">

                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />

                      <div>
                        <p className="text-[10px] font-bold tracking-[0.12em] text-[#91A0B4] uppercase">
                          Accommodation
                        </p>

                        <p className="mt-1 text-sm font-bold capitalize text-navy">
                          {intent.accommodation || "To be confirmed"}
                        </p>
                      </div>

                    </div>

                  </div>

                  <div className="my-6 border-t border-dashed border-[#DCE4ED]" />

                  <div>
                    <p className="text-[10px] font-bold tracking-[0.14em] text-[#91A0B4] uppercase">
                      Package price
                    </p>

                    <p className="mt-1 text-xl font-extrabold text-navy">
                      To be confirmed
                    </p>
                  </div>

                  <div className="mt-6 rounded-2xl bg-[#F7F9FC] px-4 py-3.5">
                    <p className="text-[11px] leading-5 text-slate">
                      Your details are saved securely and will be carried
                      forward to the payment step.
                    </p>
                  </div>

                </div>
              </div>

            </aside>

          </form>
        </div>
      </section>
    </main>
  );
}