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
  Check,
  User,
  Users,
  ShieldCheck,
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

  const [travellingSelf, setTravellingSelf] = useState<boolean | null>(
    null,
  );

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

    // Use the authenticated user's email from AuthProvider.
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

    // Booking for someone else → clear Traveller 1.
    if (!isSelf) {
      setTravellers((current) =>
        current.map((traveller, index) =>
          index === 0 ? emptyTraveller() : traveller,
        ),
      );

      return;
    }

    // Travelling yourself → use the logged-in user's profile.
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
    return <main className="min-h-screen bg-[#F7F9FC]" />;
  }

  if (!intent) {
    return (
      <main className="min-h-screen bg-[#F7F9FC] pt-28 pb-16 sm:pt-32">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <div className="rounded-3xl border border-[#E4EAF2] bg-white p-8 text-center">
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_12%_18%,rgba(54,113,202,0.08),transparent_28%),radial-gradient(circle_at_88%_72%,rgba(235,91,145,0.06),transparent_25%),#F7F9FC] pb-16">
      {/* HERO */}
      <section className="relative overflow-hidden bg-linear-to-br from-navy via-[#0D4C91] to-blue pt-24 pb-12 sm:pt-28">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-5 sm:px-8 lg:-translate-x-20">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
          >
            <ArrowLeft size={15} />
            Back to Booking
          </button>

          <div className="max-w-2xl">
            <p className="text-[10px] font-bold tracking-[0.2em] text-white/70 uppercase">
              Step 2 · Traveller Details
            </p>

            <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.035em] text-white sm:text-5xl">
              Traveller Details
            </h1>

            <p className="mt-4 text-sm leading-7 text-white/75 sm:text-base">
              Enter the details of everyone travelling with you to complete
              your booking.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="relative -mt-5 pb-16 sm:pb-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <form
            onSubmit={handleSubmit}
            className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]"
          >
            {/* LEFT */}
            <div className="space-y-6">
              {/* Contact */}
              <section className="rounded-3xl border border-[#DCE7F5] bg-white p-6 shadow-[0_16px_50px_-35px_rgba(35,92,160,0.35)] sm:p-8">
                <p className="text-[11px] font-bold tracking-[0.16em] text-accent uppercase">
                  Contact details
                </p>

                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-navy">
                  Lead traveller
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate">
                  We&apos;ll use these details for booking updates and
                  confirmations.
                </p>

                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="mb-2 block text-sm font-semibold text-navy">
                      Email address
                    </span>

                    <input
                      type="email"
                      value={leadEmail}
                      onChange={(event) => {
                        setLeadEmail(event.target.value);
                        setError("");
                      }}
                      placeholder="you@example.com"
                      className="w-full rounded-2xl border border-[#E4EAF2] bg-[#F7FAFE] px-4 py-3.5 text-sm text-navy outline-none transition-colors placeholder:text-[#93A4BE] focus:border-blue"
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="mb-2 block text-sm font-semibold text-navy">
                      Mobile number
                    </span>

                    <input
                      type="tel"
                      value={leadPhone}
                      onChange={(event) => {
                        setLeadPhone(event.target.value);
                        setError("");
                      }}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-2xl border border-[#E4EAF2] bg-[#F7FAFE] px-4 py-3.5 text-sm text-navy outline-none transition-colors placeholder:text-[#93A4BE] focus:border-blue"
                    />
                  </label>
                </div>
              </section>

              {/* SELF CHOICE */}
              <section className="rounded-3xl border border-[#DCE7F5] bg-white p-6 shadow-[0_16px_50px_-35px_rgba(35,92,160,0.35)] sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EEF5FF] text-blue">
                    <User size={21} />
                  </div>

                  <div>
                    <p className="text-[11px] font-bold tracking-[0.16em] text-accent uppercase">
                      Before we fill this in
                    </p>

                    <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-navy">
                      Are you travelling yourself?
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate">
                      If you&apos;re travelling, we can use your saved account
                      details for Traveller 1.
                    </p>
                  </div>
                </div>

                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  {/* YES */}
                  <button
                    type="button"
                    onClick={() => handleSelfChoice(true)}
                    className={`group relative rounded-2xl border p-5 text-left transition-all duration-200 ${
                      travellingSelf === true
                        ? "border-blue bg-[#EEF5FF] shadow-[0_10px_30px_-20px_rgba(37,99,180,0.6)]"
                        : "border-[#E4EAF2] bg-[#FBFCFE] hover:border-[#B9CDE7] hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
                            travellingSelf === true
                              ? "bg-blue text-white"
                              : "bg-[#EAF1FA] text-blue"
                          }`}
                        >
                          <User size={19} />
                        </div>

                        <div>
                          <p className="text-sm font-bold text-navy">
                            Yes, this is me
                          </p>

                          <p className="mt-1 text-xs text-slate">
                            Autofill my details
                          </p>
                        </div>
                      </div>

                      {travellingSelf === true && (
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue text-white">
                          <Check size={15} strokeWidth={3} />
                        </span>
                      )}
                    </div>
                  </button>

                  {/* NO */}
                  <button
                    type="button"
                    onClick={() => handleSelfChoice(false)}
                    className={`group relative rounded-2xl border p-5 text-left transition-all duration-200 ${
                      travellingSelf === false
                        ? "border-accent bg-[#FFF4F8] shadow-[0_10px_30px_-20px_rgba(235,91,145,0.55)]"
                        : "border-[#E4EAF2] bg-[#FBFCFE] hover:border-[#E4C3D0] hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
                            travellingSelf === false
                              ? "bg-accent text-white"
                              : "bg-[#F9EDF2] text-accent"
                          }`}
                        >
                          <Users size={19} />
                        </div>

                        <div>
                          <p className="text-sm font-bold text-navy">
                            No, someone else
                          </p>

                          <p className="mt-1 text-xs text-slate">
                            I&apos;m booking for them
                          </p>
                        </div>
                      </div>

                      {travellingSelf === false && (
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-white">
                          <Check size={15} strokeWidth={3} />
                        </span>
                      )}
                    </div>
                  </button>
                </div>

                {travellingSelf === true && (
                  <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#D7E6FA] bg-[#F5F9FF] px-4 py-3.5">
                    <ShieldCheck
                      size={17}
                      className="mt-0.5 shrink-0 text-blue"
                    />

                    <p className="text-xs leading-5 text-[#45607F]">
                      Your saved profile details have been filled into
                      Traveller 1. You can edit them if anything needs to be
                      changed.
                    </p>
                  </div>
                )}
              </section>

              {/* TRAVELLERS */}
              <section className="rounded-3xl border border-[#DCE7F5] bg-white p-6 shadow-[0_16px_50px_-35px_rgba(35,92,160,0.35)] sm:p-8">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold tracking-[0.16em] text-accent uppercase">
                      Travellers
                    </p>

                    <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-navy">
                      Who&apos;s travelling?
                    </h2>
                  </div>

                  <span className="rounded-full bg-[#EAF3FF] px-3 py-1.5 text-xs font-bold text-blue">
                    {travellerCount}{" "}
                    {travellerCount === 1 ? "Traveller" : "Travellers"}
                  </span>
                </div>

                <div className="mt-7 space-y-6">
                  {travellers.map((traveller, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-[#DCE8F7] bg-[#F5F9FF] p-5 sm:p-6"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue to-accent text-xs font-bold text-white shadow-sm">
                          {index + 1}
                        </span>

                        <div>
                          <h3 className="text-base font-bold text-navy">
                            {index === 0
                              ? "Lead traveller"
                              : `Traveller ${index + 1}`}
                          </h3>

                          {index === 0 && travellingSelf === true ? (
                            <p className="mt-0.5 text-xs font-medium text-blue">
                              Your profile details were autofilled
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        <label className="block sm:col-span-2">
                          <span className="mb-2 block text-sm font-semibold text-navy">
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
                            placeholder="Full name"
                            className="w-full rounded-2xl border border-[#E4EAF2] bg-white px-4 py-3.5 text-sm text-navy outline-none transition-colors placeholder:text-[#93A4BE] focus:border-blue"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-sm font-semibold text-navy">
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
                            placeholder="Age"
                            className="w-full rounded-2xl border border-[#E4EAF2] bg-white px-4 py-3.5 text-sm text-navy outline-none transition-colors placeholder:text-[#93A4BE] focus:border-blue"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-sm font-semibold text-navy">
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
                            className="w-full cursor-pointer rounded-2xl border border-[#E4EAF2] bg-white px-4 py-3.5 text-sm font-medium text-navy outline-none focus:border-blue"
                          >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </label>
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
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#DCE7F5] bg-white px-6 py-3.5 text-sm font-bold text-navy transition-colors hover:bg-[#F7FAFE]"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-navy px-7 py-3.5 text-sm font-extrabold text-white shadow-[0_12px_30px_-10px_rgba(7,53,112,0.35)] transition-all hover:-translate-y-0.5 hover:bg-accent"
                >
                  Continue to Payment
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>

            {/* RIGHT SUMMARY */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="relative min-h-[560px] overflow-hidden rounded-[32px] bg-gradient-to-br from-[#06285F] via-[#0B4F9D] to-[#1676C8] p-7 text-white shadow-[0_30px_80px_-30px_rgba(7,53,112,0.55)] sm:p-8">
                <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#F06B9A]/25 blur-3xl" />

                <div className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-[#5FB4FF]/20 blur-3xl" />

                <div className="pointer-events-none absolute right-7 top-7 h-24 w-24 rounded-full border border-white/10" />

                <div className="pointer-events-none absolute right-12 top-12 h-14 w-14 rounded-full border border-white/10" />

                <div className="relative flex min-h-[500px] flex-col">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#F58BAF]" />

                      <p className="text-[10px] font-bold tracking-[0.2em] text-white/65 uppercase">
                        Your booking
                      </p>
                    </div>

                    <h2 className="mt-4 max-w-[280px] text-3xl font-extrabold leading-tight tracking-tight text-white">
                      {intent.packageName}
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-white/65">
                      Your journey starts here. Review your trip details before
                      continuing.
                    </p>
                  </div>

                  <div className="mt-8 rounded-[24px] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-sm">
                    <div className="space-y-5">
                      {/* Date */}
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <rect
                              x="3"
                              y="4"
                              width="18"
                              height="17"
                              rx="2"
                            />
                            <path d="M16 2v4M8 2v4M3 10h18" />
                          </svg>
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold tracking-[0.12em] text-white/45 uppercase">
                            Travel date
                          </p>

                          <p className="mt-1 text-sm font-semibold text-white">
                            {formattedDate}
                          </p>
                        </div>
                      </div>

                      {/* Travellers */}
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <circle cx="9" cy="8" r="3" />
                            <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                            <path d="M16 5.5a3 3 0 0 1 0 5.8M18 14c1.7.8 3 2.4 3 4.5" />
                          </svg>
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold tracking-[0.12em] text-white/45 uppercase">
                            Travellers
                          </p>

                          <p className="mt-1 text-sm font-semibold text-white">
                            {intent.travellers}{" "}
                            {intent.travellers === "1"
                              ? "Adult"
                              : "Adults"}
                          </p>
                        </div>
                      </div>

                      {/* Accommodation */}
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <path d="M3 21V9l9-6 9 6v12" />
                            <path d="M7 21v-6h10v6M9 11h6" />
                          </svg>
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold tracking-[0.12em] text-white/45 uppercase">
                            Accommodation
                          </p>

                          <p className="mt-1 text-sm font-semibold capitalize text-white">
                            {intent.accommodation || "To be confirmed"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-7 flex items-end justify-between border-t border-white/10 pt-6">
                    <div>
                      <p className="text-[10px] font-semibold tracking-[0.15em] text-white/45 uppercase">
                        Package price
                      </p>

                      <p className="mt-1 text-2xl font-extrabold text-white">
                        To be confirmed
                      </p>
                    </div>

                    <div className="rounded-full bg-[#F58BAF]/15 px-3 py-1.5">
                      <span className="text-[10px] font-bold text-[#FFC2D3]">
                        MAYURA
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto pt-7">
                    <button
                      type="submit"
                      className="group flex w-full items-center justify-center gap-3 rounded-full bg-white px-5 py-4 text-sm font-extrabold text-navy shadow-[0_12px_30px_-10px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent hover:text-white"
                    >
                      Continue to Payment

                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </button>

                    <p className="mt-4 text-center text-[11px] leading-5 text-white/50">
                      Your booking details will be reviewed before payment.
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