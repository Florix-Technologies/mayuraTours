"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  Clock3,
  Headphones,
  Heart,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Settings,
  ShieldCheck,
  Ticket,
  UserRound,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  readBookingIntent,
  type BookingIntent,
} from "@/lib/booking/intent";
import { packages } from "@/lib/data/packages";

type BookingStatus =
  | "Confirmed"
  | "Completed"
  | "Cancelled"
  | "Payment Pending";

type MockBooking = {
  id: string;
  reference: string;
  packageName: string;
  destination: string;
  travelDate: string;
  travellers: number;
  accommodation: string;
  amount: string;
  status: BookingStatus;
};

const mockBookings: MockBooking[] = [
  {
    id: "1",
    reference: "MAY-GOA-123456",
    packageName: "Goa Beach Getaway",
    destination: "Goa",
    travelDate: "12 Oct 2026",
    travellers: 2,
    accommodation: "Deluxe",
    amount: "₹12,950",
    status: "Confirmed",
  },
  {
    id: "2",
    reference: "MAY-COO-824615",
    packageName: "Coorg Coffee Country",
    destination: "Coorg",
    travelDate: "18 Aug 2026",
    travellers: 2,
    accommodation: "Premium",
    amount: "₹24,400",
    status: "Completed",
  },
  {
    id: "3",
    reference: "MAY-OOT-531927",
    packageName: "Ooty + Coonoor Hills",
    destination: "Ooty",
    travelDate: "05 Jun 2026",
    travellers: 3,
    accommodation: "Deluxe",
    amount: "₹46,800",
    status: "Completed",
  },
];

const navigationItems = [
  {
    label: "Overview",
    icon: CircleUserRound,
    id: "overview",
  },
  {
    label: "My Bookings",
    icon: Ticket,
    id: "bookings",
  },
  {
    label: "Profile",
    icon: UserRound,
    id: "profile",
  },
  {
    label: "Travel Preferences",
    icon: Heart,
    id: "preferences",
  },
  {
    label: "Settings",
    icon: Settings,
    id: "settings",
  },
];

type TravelPreferences = {
  places: string[];
  travelWith: string;
  experiences: string[];
  duration: string;
  budget: string;
};

const DEFAULT_TRAVEL_PREFERENCES: TravelPreferences = {
  places: ["Beaches", "Mountains", "Nature"],
  travelWith: "Family",
  experiences: ["Food", "Sightseeing", "Photography"],
  duration: "3–4 Days",
  budget: "₹5–10k",
};

function readTravelPreferences(): TravelPreferences {
  if (typeof window === "undefined") {
    return DEFAULT_TRAVEL_PREFERENCES;
  }

  const stored = localStorage.getItem("mayura-travel-preferences");

  if (!stored) {
    return DEFAULT_TRAVEL_PREFERENCES;
  }

  try {
    const parsed = JSON.parse(stored);

    return {
      places: Array.isArray(parsed.places)
        ? parsed.places
        : DEFAULT_TRAVEL_PREFERENCES.places,
      travelWith:
        typeof parsed.travelWith === "string"
          ? parsed.travelWith
          : DEFAULT_TRAVEL_PREFERENCES.travelWith,
      experiences: Array.isArray(parsed.experiences)
        ? parsed.experiences
        : DEFAULT_TRAVEL_PREFERENCES.experiences,
      duration:
        typeof parsed.duration === "string"
          ? parsed.duration
          : DEFAULT_TRAVEL_PREFERENCES.duration,
      budget:
        typeof parsed.budget === "string"
          ? parsed.budget
          : DEFAULT_TRAVEL_PREFERENCES.budget,
    };
  } catch {
    return DEFAULT_TRAVEL_PREFERENCES;
  }
}

function readInitialBookingIntent(): BookingIntent | null {
  if (typeof window === "undefined") {
    return null;
  }

  return readBookingIntent();
}

function getFirstName(name?: string) {
  if (!name) return "Traveller";

  return name.trim().split(" ")[0] || "Traveller";
}

function getDisplayName(name?: string) {
  if (!name) return "Traveller";

  return name.trim() || "Traveller";
}

function formatTravelDate(date: string) {
  if (!date) return "Date to confirm";

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const styles = {
    Confirmed: "bg-[#ECFDF3] text-[#15803D]",
    Completed: "bg-[#EEF4FB] text-blue",
    Cancelled: "bg-[#FEF2F2] text-[#B91C1C]",
    "Payment Pending": "bg-[#FFF7ED] text-[#C2410C]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold ${styles[status]}`}
    >
      {status === "Confirmed" && <CheckCircle2 size={12} />}
      {status === "Completed" && <CheckCircle2 size={12} />}
      {status === "Cancelled" && <X size={12} />}
      {status === "Payment Pending" && <Clock3 size={12} />}

      {status}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.025em] text-navy sm:text-3xl">
        {title}
      </h2>

      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate">
          {description}
        </p>
      )}
    </div>
  );
}

function PreferenceGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-[#E1E8F0] py-5 first:pt-0 last:border-b-0 last:pb-0">
      <p className="text-[9px] font-bold tracking-[0.12em] text-[#94A3B8] uppercase">
        {title}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function TravelPreferencesEditor({
  options,
}: {
  options: {
    places: string[];
    travelWith: string[];
    experiences: string[];
    duration: string[];
    budget: string[];
  };
}) {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [preferences, setPreferences] =
    useState<TravelPreferences>(readTravelPreferences);

  const toggleMultiple = (
    field: "places" | "experiences",
    value: string,
  ) => {
    setPreferences((current) => {
      const values = current[field];

      return {
        ...current,
        [field]: values.includes(value)
          ? values.filter((item) => item !== value)
          : [...values, value],
      };
    });
  };

  const selectSingle = (
    field: "travelWith" | "duration" | "budget",
    value: string,
  ) => {
    setPreferences((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const savePreferences = () => {
    localStorage.setItem(
      "mayura-travel-preferences",
      JSON.stringify(preferences),
    );

    setSaved(true);
    setEditing(false);

    window.setTimeout(() => {
      setSaved(false);
    }, 2200);
  };

  const cancelEditing = () => {
    setPreferences(readTravelPreferences());
    setEditing(false);
  };

  const optionClass = (selected: boolean) =>
    `rounded-full border px-3.5 py-2 text-[10px] font-bold transition-all ${
      selected
        ? "border-blue bg-blue text-white shadow-[0_8px_20px_-12px_rgba(8,33,76,0.7)]"
        : "border-[#DCE5EF] bg-white text-slate hover:border-blue/40 hover:text-blue"
    }`;

  if (!editing) {
    return (
      <>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-[#F7F9FC] p-5 ring-1 ring-[#E2EAF4]">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[9px] font-bold tracking-[0.12em] text-[#94A3B8] uppercase">
                Favourite Places
              </p>

              <Heart size={15} className="text-accent" />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {preferences.places.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-blue/10 px-3 py-1.5 text-[10px] font-bold text-blue"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-[#F7F9FC] p-5 ring-1 ring-[#E2EAF4]">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[9px] font-bold tracking-[0.12em] text-[#94A3B8] uppercase">
                Usually Travel With
              </p>

              <Users size={15} className="text-blue" />
            </div>

            <p className="mt-4 text-sm font-bold text-navy">
              {preferences.travelWith}
            </p>
          </div>

          <div className="rounded-2xl bg-[#F7F9FC] p-5 ring-1 ring-[#E2EAF4]">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[9px] font-bold tracking-[0.12em] text-[#94A3B8] uppercase">
                Preferred Experiences
              </p>

              <MapPin size={15} className="text-blue" />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {preferences.experiences.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-accent/10 px-3 py-1.5 text-[10px] font-bold text-accent"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-[#F7F9FC] p-5 ring-1 ring-[#E2EAF4]">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[9px] font-bold tracking-[0.12em] text-[#94A3B8] uppercase">
                Typical Trip
              </p>

              <CalendarDays size={15} className="text-blue" />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-blue/10 px-3 py-1.5 text-[10px] font-bold text-blue">
                {preferences.duration}
              </span>

              <span className="rounded-full bg-accent/10 px-3 py-1.5 text-[10px] font-bold text-accent">
                {preferences.budget}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue to-navy px-5 py-3 text-xs font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-none hover:bg-accent"
          >
            Edit Travel Preferences
            <ArrowRight size={14} />
          </button>

          {saved && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF3] px-4 py-2.5 text-[10px] font-bold text-[#15803D]">
              <CheckCircle2 size={14} />
              Preferences saved
            </span>
          )}
        </div>
      </>
    );
  }

  return (
    <div className="mt-8 rounded-[1.5rem] border border-[#DDE5EF] bg-[#F7F9FC] p-5 sm:p-7">
      <PreferenceGroup title="Favourite Places">
        {options.places.map((item) => {
          const selected = preferences.places.includes(item);

          return (
            <button
              key={item}
              type="button"
              onClick={() => toggleMultiple("places", item)}
              className={optionClass(selected)}
            >
              {item}
            </button>
          );
        })}
      </PreferenceGroup>

      <PreferenceGroup title="Usually Travel With">
        {options.travelWith.map((item) => {
          const selected = preferences.travelWith === item;

          return (
            <button
              key={item}
              type="button"
              onClick={() => selectSingle("travelWith", item)}
              className={optionClass(selected)}
            >
              {item}
            </button>
          );
        })}
      </PreferenceGroup>

      <PreferenceGroup title="Preferred Experiences">
        {options.experiences.map((item) => {
          const selected = preferences.experiences.includes(item);

          return (
            <button
              key={item}
              type="button"
              onClick={() => toggleMultiple("experiences", item)}
              className={optionClass(selected)}
            >
              {item}
            </button>
          );
        })}
      </PreferenceGroup>

      <PreferenceGroup title="Typical Trip Duration">
        {options.duration.map((item) => {
          const selected = preferences.duration === item;

          return (
            <button
              key={item}
              type="button"
              onClick={() => selectSingle("duration", item)}
              className={optionClass(selected)}
            >
              {item}
            </button>
          );
        })}
      </PreferenceGroup>

      <PreferenceGroup title="Typical Budget">
        {options.budget.map((item) => {
          const selected = preferences.budget === item;

          return (
            <button
              key={item}
              type="button"
              onClick={() => selectSingle("budget", item)}
              className={optionClass(selected)}
            >
              {item}
            </button>
          );
        })}
      </PreferenceGroup>

      <div className="mt-6 flex flex-wrap gap-3 border-t border-[#E1E8F0] pt-6">
        <button
          type="button"
          onClick={savePreferences}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue to-navy px-5 py-3 text-xs font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-none hover:bg-accent"
        >
          <CheckCircle2 size={14} />
          Save Preferences
        </button>

        <button
          type="button"
          onClick={cancelEditing}
          className="inline-flex items-center gap-2 rounded-full border border-[#DCE5EF] bg-white px-5 py-3 text-xs font-bold text-slate transition-colors hover:border-blue hover:text-blue"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isReady, signOut } = useAuth();

  const [intent] = useState<BookingIntent | null>(
    readInitialBookingIntent,
  );
  const [activeSection, setActiveSection] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isReady) return;

    if (!isAuthenticated) {
      router.replace("/login?next=/account");
    }
  }, [isAuthenticated, isReady, router]);

  const currentPackage = useMemo(() => {
    if (!intent) return null;

    return packages.find((pkg) => pkg.slug === intent.slug) ?? null;
  }, [intent]);

  if (!isReady || !isAuthenticated) {
    return <main className="min-h-screen bg-[#F7F9FC]" />;
  }

  const displayName = getDisplayName(user?.name);
  const firstName = getFirstName(user?.name);
  const initials = displayName.charAt(0).toUpperCase();

  const upcomingBooking = intent
    ? {
        reference: `MAY-${intent.slug.slice(0, 4).toUpperCase()}-123456`,
        packageName: intent.packageName,
        travelDate: formatTravelDate(intent.travelDate),
        travellers: Number(intent.travellers) || 1,
        accommodation: intent.accommodation || "To be confirmed",
        amount:
          currentPackage?.priceValue != null
            ? `₹${(
                currentPackage.priceValue *
                (Number(intent.travellers) || 1)
              ).toLocaleString("en-IN")}`
            : "On request",
      }
    : null;

  const completedBookings = mockBookings.filter(
    (booking) => booking.status === "Completed",
  ).length;

  const pendingPayments = mockBookings.filter(
    (booking) => booking.status === "Payment Pending",
  ).length;

  const totalBookings = mockBookings.length;

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);

    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-[#F7F9FC] pb-20 pt-20 sm:pt-24">
      {/* =====================================================
          MOBILE ACCOUNT MENU
      ====================================================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-navy/35 backdrop-blur-sm lg:hidden">
          <div className="absolute left-0 top-0 flex h-full w-[84%] max-w-sm flex-col bg-white p-6 shadow-[20px_0_60px_rgba(7,28,53,0.18)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-extrabold tracking-[-0.03em] text-navy">
                  MAYURA
                </p>

                <p className="mt-0.5 text-[9px] font-bold tracking-[0.2em] text-accent uppercase">
                  My Account
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close account menu"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3F6FA] text-navy transition-colors hover:bg-[#EAF0F7]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-9 space-y-1.5">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-sm font-bold transition-all ${
                      active
                        ? "bg-navy text-white shadow-[0_14px_30px_-18px_rgba(7,28,53,0.9)]"
                        : "text-slate hover:bg-[#F5F8FC] hover:text-navy"
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-auto border-t border-[#E4EAF1] pt-5">
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          ACCOUNT HERO
      ====================================================== */}
      <section className="relative overflow-hidden bg-white">
        {/* Soft editorial background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#E9EEF4_1px,transparent_1px),linear-gradient(to_bottom,#E9EEF4_1px,transparent_1px)] bg-[size:72px_72px] opacity-60" />

          <div className="absolute -right-28 -top-36 h-96 w-96 rounded-full bg-blue/10 blur-3xl" />

          <div className="absolute -bottom-40 left-[18%] h-80 w-80 rounded-full bg-accent/8 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pb-28 pt-12 sm:px-8 sm:pb-32 sm:pt-16">
          <div className="flex items-start justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#DDE5EF] bg-white/85 px-3.5 py-2 text-[10px] font-bold tracking-[0.14em] text-blue uppercase shadow-sm backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                My Account
              </div>

              <h1 className="mt-6 text-4xl font-extrabold tracking-[-0.045em] text-navy sm:text-5xl lg:text-6xl">
                Welcome back,
                <span className="block text-blue">{firstName}.</span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-slate sm:text-base">
                Everything you need for your Mayura journeys, from upcoming
                trips to your travel preferences, in one place.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open account menu"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#DDE5EF] bg-white text-navy shadow-sm lg:hidden"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Profile strip */}
          <div className="mt-10 flex flex-col gap-5 border-t border-[#DDE5EF] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue to-navy text-sm font-extrabold text-white shadow-[0_12px_30px_-15px_rgba(8,33,76,0.65)]">
                {initials}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-navy">
                  {displayName}
                </p>

                <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-slate">
                  <Mail size={12} />
                  {user?.email || "Email not provided"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => scrollToSection("profile")}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-[#D6E0EB] bg-white px-5 py-2.5 text-xs font-bold text-navy transition-all hover:-translate-y-0.5 hover:border-blue hover:text-blue"
            >
              View Profile
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          DASHBOARD
      ====================================================== */}
      <section className="relative -mt-12">
        <div className="mx-auto grid max-w-7xl gap-7 px-5 sm:px-8 lg:grid-cols-[230px_minmax(0,1fr)]">
          {/* =================================================
              DESKTOP SIDEBAR
          ================================================== */}
          <aside className="hidden self-start rounded-[1.75rem] border border-[#DDE5EF] bg-white p-3 shadow-[0_25px_80px_rgba(20,40,70,0.08)] lg:sticky lg:top-28 lg:block">
            <div className="px-4 py-4">
              <p className="text-[9px] font-bold tracking-[0.2em] text-[#8B9BB2] uppercase">
                Account Menu
              </p>
            </div>

            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-xs font-bold transition-all ${
                      active
                        ? "bg-navy text-white shadow-[0_12px_28px_-18px_rgba(7,28,53,0.9)]"
                        : "text-slate hover:bg-[#F5F8FC] hover:text-navy"
                    }`}
                  >
                    <Icon size={17} />
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 border-t border-[#E5EBF3] pt-3">
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-xs font-bold text-slate transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={17} />
                Sign Out
              </button>
            </div>
          </aside>

          {/* =================================================
              CONTENT
          ================================================== */}
          <div className="min-w-0 space-y-8">
            {/* =================================================
                OVERVIEW
            ================================================== */}
            <section id="overview" className="scroll-mt-28">
              {/* Stats */}
              <div className="grid grid-cols-2 overflow-hidden rounded-[1.75rem] border border-[#DDE5EF] bg-white shadow-[0_25px_80px_rgba(20,40,70,0.08)] sm:grid-cols-4">
                <div className="border-b border-r border-[#E5EBF3] p-5 sm:border-b-0">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue/10 text-blue">
                      <Ticket size={19} />
                    </div>

                    <span className="text-[9px] font-bold tracking-[0.12em] text-[#9AA8BA] uppercase">
                      Trips
                    </span>
                  </div>

                  <p className="mt-5 text-2xl font-extrabold text-navy">
                    {totalBookings}
                  </p>

                  <p className="mt-1 text-[11px] font-semibold text-slate">
                    Total Bookings
                  </p>
                </div>

                <div className="border-b border-[#E5EBF3] p-5 sm:border-r">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <CalendarDays size={19} />
                    </div>

                    <span className="text-[9px] font-bold tracking-[0.12em] text-[#9AA8BA] uppercase">
                      Next
                    </span>
                  </div>

                  <p className="mt-5 text-2xl font-extrabold text-navy">
                    {upcomingBooking ? "1" : "0"}
                  </p>

                  <p className="mt-1 text-[11px] font-semibold text-slate">
                    Upcoming Trips
                  </p>
                </div>

                <div className="border-r border-[#E5EBF3] p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF3] text-[#16A34A]">
                      <CheckCircle2 size={19} />
                    </div>

                    <span className="text-[9px] font-bold tracking-[0.12em] text-[#9AA8BA] uppercase">
                      Done
                    </span>
                  </div>

                  <p className="mt-5 text-2xl font-extrabold text-navy">
                    {completedBookings}
                  </p>

                  <p className="mt-1 text-[11px] font-semibold text-slate">
                    Completed Trips
                  </p>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF7ED] text-[#EA580C]">
                      <WalletCards size={19} />
                    </div>

                    <span className="text-[9px] font-bold tracking-[0.12em] text-[#9AA8BA] uppercase">
                      Action
                    </span>
                  </div>

                  <p className="mt-5 text-2xl font-extrabold text-navy">
                    {pendingPayments}
                  </p>

                  <p className="mt-1 text-[11px] font-semibold text-slate">
                    Pending Payments
                  </p>
                </div>
              </div>

              {/* Upcoming journey */}
              <div className="mt-7 overflow-hidden rounded-[1.75rem] border border-[#DDE5EF] bg-white shadow-[0_25px_80px_rgba(20,40,70,0.08)]">
                <div className="flex flex-col justify-between gap-4 border-b border-[#E5EBF3] px-6 py-6 sm:flex-row sm:items-center sm:px-8">
                  <SectionHeading
                    eyebrow="Your next journey"
                    title="Upcoming Trip"
                    description="Your next Mayura experience at a glance."
                  />

                  <button
                    type="button"
                    onClick={() => scrollToSection("bookings")}
                    className="inline-flex w-fit items-center gap-1.5 text-xs font-bold text-blue transition-colors hover:text-accent"
                  >
                    View all bookings
                    <ChevronRight size={15} />
                  </button>
                </div>

                {upcomingBooking ? (
                  <div className="relative overflow-hidden p-6 sm:p-8">
                    {/* Decorative route */}
                    <div className="pointer-events-none absolute right-0 top-0 h-full w-[48%] opacity-60">
                      <svg
                        className="h-full w-full"
                        viewBox="0 0 500 260"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M40 210 C120 80 190 220 280 120 S410 70 490 25"
                          fill="none"
                          stroke="#DCE7F4"
                          strokeWidth="2"
                          strokeDasharray="7 11"
                        />

                        <circle
                          cx="40"
                          cy="210"
                          r="5"
                          fill="#0B5FA5"
                        />

                        <circle
                          cx="490"
                          cy="25"
                          r="5"
                          fill="#E84B8A"
                        />
                      </svg>
                    </div>

                    <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[#ECFDF3] px-3 py-1.5 text-[9px] font-bold tracking-[0.08em] text-[#15803D] uppercase">
                            Confirmed
                          </span>

                          <span className="text-[10px] font-semibold tracking-[0.08em] text-[#94A3B8] uppercase">
                            {upcomingBooking.reference}
                          </span>
                        </div>

                        <h3 className="mt-4 max-w-xl text-2xl font-extrabold tracking-[-0.03em] text-navy sm:text-3xl">
                          {upcomingBooking.packageName}
                        </h3>

                        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-xs text-slate">
                          <span className="inline-flex items-center gap-2">
                            <CalendarDays size={15} className="text-blue" />
                            {upcomingBooking.travelDate}
                          </span>

                          <span className="inline-flex items-center gap-2">
                            <Users size={15} className="text-blue" />
                            {upcomingBooking.travellers}{" "}
                            {upcomingBooking.travellers === 1
                              ? "Traveller"
                              : "Travellers"}
                          </span>

                          <span className="inline-flex items-center gap-2">
                            <ShieldCheck
                              size={15}
                              className="text-accent"
                            />
                            {upcomingBooking.accommodation}
                          </span>
                        </div>
                      </div>

                      <div className="relative flex shrink-0 flex-col items-start gap-4 sm:flex-row sm:items-center lg:flex-col lg:items-end">
                        <div>
                          <p className="text-[9px] font-bold tracking-[0.14em] text-[#94A3B8] uppercase lg:text-right">
                            Booking Amount
                          </p>

                          <p className="mt-1 text-2xl font-extrabold text-blue">
                            {upcomingBooking.amount}
                          </p>
                        </div>

                        <Link
                          href="/booking/confirmation"
                          className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue to-navy px-5 py-3 text-xs font-bold text-white shadow-[0_14px_30px_-16px_rgba(8,33,76,0.7)] transition-all hover:-translate-y-0.5 hover:bg-none hover:bg-accent"
                        >
                          View Booking
                          <ArrowRight
                            size={15}
                            className="transition-transform group-hover:translate-x-0.5"
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="px-6 py-14 text-center sm:px-8">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF4FB] text-blue">
                      <CalendarDays size={24} />
                    </div>

                    <h3 className="mt-5 text-lg font-extrabold text-navy">
                      No upcoming trips
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate">
                      Explore our curated packages and start planning your
                      next Mayura journey.
                    </p>

                    <Link
                      href="/packages"
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue to-navy px-5 py-3 text-xs font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-none hover:bg-accent"
                    >
                      Browse Packages
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </div>

              {/* Quick actions */}
              <div className="mt-7">
                <div className="mb-4">
                  <p className="text-[10px] font-bold tracking-[0.2em] text-[#94A3B8] uppercase">
                    Explore
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <Link
                    href="/packages"
                    className="group rounded-[1.5rem] border border-[#DDE5EF] bg-white p-5 transition-all hover:-translate-y-1 hover:border-blue/30 hover:shadow-[0_20px_50px_-35px_rgba(8,33,76,0.45)]"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue/10 text-blue">
                      <MapPin size={18} />
                    </div>

                    <p className="mt-4 text-sm font-extrabold text-navy">
                      Explore Packages
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-slate">
                      Find your next Mayura journey.
                    </p>

                    <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold text-blue">
                      Explore
                      <ArrowRight size={13} />
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => scrollToSection("preferences")}
                    className="group rounded-[1.5rem] border border-[#DDE5EF] bg-white p-5 text-left transition-all hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_20px_50px_-35px_rgba(8,33,76,0.45)]"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <Heart size={18} />
                    </div>

                    <p className="mt-4 text-sm font-extrabold text-navy">
                      Travel Preferences
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-slate">
                      Personalise your travel experience.
                    </p>

                    <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold text-accent">
                      Update
                      <ArrowRight size={13} />
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollToSection("support")}
                    className="group rounded-[1.5rem] border border-[#DDE5EF] bg-white p-5 text-left transition-all hover:-translate-y-1 hover:border-blue/30 hover:shadow-[0_20px_50px_-35px_rgba(8,33,76,0.45)]"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF4FB] text-blue">
                      <Headphones size={18} />
                    </div>

                    <p className="mt-4 text-sm font-extrabold text-navy">
                      Need Help?
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-slate">
                      Get assistance with your Mayura journey.
                    </p>

                    <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold text-blue">
                      Get Support
                      <ArrowRight size={13} />
                    </span>
                  </button>
                </div>
              </div>
            </section>

            {/* =================================================
                MY BOOKINGS
            ================================================== */}
            <section
              id="bookings"
              className="scroll-mt-28 overflow-hidden rounded-[1.75rem] border border-[#DDE5EF] bg-white shadow-[0_25px_80px_rgba(20,40,70,0.08)]"
            >
              <div className="px-6 py-7 sm:px-8">
                <SectionHeading
                  eyebrow="Your Trips"
                  title="My Bookings"
                  description="A record of your Mayura journeys. Live booking history will connect here after backend integration."
                />
              </div>

              <div className="border-t border-[#E5EBF3]">
                {mockBookings.map((booking, index) => (
                  <div
                    key={booking.id}
                    className={`p-6 transition-colors hover:bg-[#FBFCFE] sm:p-7 ${
                      index !== mockBookings.length - 1
                        ? "border-b border-[#E5EBF3]"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EEF4FB] text-blue">
                          <Ticket size={20} />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-extrabold text-navy">
                              {booking.packageName}
                            </h3>

                            <StatusBadge status={booking.status} />
                          </div>

                          <p className="mt-1 text-[10px] font-bold tracking-[0.08em] text-[#94A3B8] uppercase">
                            {booking.reference}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-slate">
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays
                                size={13}
                                className="text-blue"
                              />
                              {booking.travelDate}
                            </span>

                            <span className="inline-flex items-center gap-1.5">
                              <Users size={13} className="text-blue" />
                              {booking.travellers} travellers
                            </span>

                            <span className="inline-flex items-center gap-1.5">
                              <ShieldCheck
                                size={13}
                                className="text-accent"
                              />
                              {booking.accommodation}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-5 border-t border-[#E5EBF3] pt-4 sm:justify-end sm:border-t-0 sm:pt-0">
                        <div className="sm:text-right">
                          <p className="text-[9px] font-semibold tracking-[0.1em] text-[#94A3B8] uppercase">
                            Total
                          </p>

                          <p className="mt-1 text-lg font-extrabold text-navy">
                            {booking.amount}
                          </p>
                        </div>

                        <Link
                          href={
                            booking.id === "1"
                              ? "/booking/confirmation"
                              : "#"
                          }
                          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[11px] font-bold transition-colors ${
                            booking.id === "1"
                              ? "bg-blue text-white hover:bg-accent"
                              : "bg-[#F1F5F9] text-slate"
                          }`}
                        >
                          View Details
                          <ChevronRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* =================================================
                PROFILE
            ================================================== */}
            <section
              id="profile"
              className="scroll-mt-28 rounded-[1.75rem] border border-[#DDE5EF] bg-white p-6 shadow-[0_25px_80px_rgba(20,40,70,0.08)] sm:p-8"
            >
              <SectionHeading
                eyebrow="Personal Details"
                title="Profile"
                description="Your basic account information."
              />

              <div className="mt-8 flex flex-col gap-5 border-b border-[#E5EBF3] pb-7 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue to-navy text-2xl font-extrabold text-white shadow-[0_15px_35px_-18px_rgba(8,33,76,0.65)]">
                  {initials}
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-navy">
                    {displayName}
                  </h3>

                  <p className="mt-1 text-sm text-slate">
                    Mayura Traveller
                  </p>
                </div>

                <div className="sm:ml-auto">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF3] px-3.5 py-2 text-[10px] font-bold text-[#15803D]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
                    Active Account
                  </span>
                </div>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#F7F9FC] p-5 ring-1 ring-[#E2EAF4]">
                  <p className="text-[9px] font-semibold tracking-[0.12em] text-[#94A3B8] uppercase">
                    Full Name
                  </p>

                  <p className="mt-2 text-sm font-bold text-navy">
                    {displayName}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F7F9FC] p-5 ring-1 ring-[#E2EAF4]">
                  <p className="text-[9px] font-semibold tracking-[0.12em] text-[#94A3B8] uppercase">
                    Email Address
                  </p>

                  <p className="mt-2 break-all text-sm font-bold text-navy">
                    {user?.email || "Not provided"}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F7F9FC] p-5 ring-1 ring-[#E2EAF4]">
                  <p className="text-[9px] font-semibold tracking-[0.12em] text-[#94A3B8] uppercase">
                    Mobile Number
                  </p>

                  <p className="mt-2 text-sm font-bold text-navy">
                    Not provided
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F7F9FC] p-5 ring-1 ring-[#E2EAF4]">
                  <p className="text-[9px] font-semibold tracking-[0.12em] text-[#94A3B8] uppercase">
                    Account Status
                  </p>

                  <p className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-[#15803D]">
                    <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
                    Active
                  </p>
                </div>
              </div>

              <p className="mt-6 text-[11px] leading-5 text-slate">
                Profile editing will be connected to your account API when
                backend integration is added.
              </p>
            </section>

            {/* =================================================
                TRAVEL PREFERENCES
            ================================================== */}
            <section
              id="preferences"
              className="scroll-mt-28 rounded-[1.75rem] border border-[#DDE5EF] bg-white p-6 shadow-[0_25px_80px_rgba(20,40,70,0.08)] sm:p-8"
            >
              <SectionHeading
                eyebrow="Personalise Your Trips"
                title="Travel Preferences"
                description="These preferences can later be used to personalise Mayura recommendations and package discovery."
              />

              <TravelPreferencesEditor
                options={{
                  places: [
                    "Beaches",
                    "Mountains",
                    "Nature",
                    "Wildlife",
                    "History & Culture",
                    "Adventure",
                    "Cities",
                    "Spiritual",
                  ],
                  travelWith: ["Solo", "Couple", "Family", "Friends"],
                  experiences: [
                    "Relaxation",
                    "Adventure",
                    "Food",
                    "Photography",
                    "Sightseeing",
                    "Local Experiences",
                    "Luxury",
                  ],
                  duration: ["Weekend", "3–4 Days", "5–7 Days", "1+ Week"],
                  budget: ["Under ₹5k", "₹5–10k", "₹10–20k", "₹20k+"],
                }}
              />
            </section>

            {/* =================================================
                SETTINGS
            ================================================== */}
            <section
              id="settings"
              className="scroll-mt-28 rounded-[1.75rem] border border-[#DDE5EF] bg-white p-6 shadow-[0_25px_80px_rgba(20,40,70,0.08)] sm:p-8"
            >
              <SectionHeading
                eyebrow="Account Controls"
                title="Settings"
                description="Manage the basic behaviour of your Mayura account."
              />

              <div className="mt-8 divide-y divide-[#E5EBF3]">
                <div className="flex flex-col gap-4 py-5 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-navy">
                      Change Password
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate">
                      Update your account password securely.
                    </p>
                  </div>

                  <Link
                    href="/forgot-password"
                    className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-[#DCE5EF] px-4 py-2.5 text-[11px] font-bold text-navy transition-colors hover:border-blue hover:text-blue"
                  >
                    Change
                    <ChevronRight size={14} />
                  </Link>
                </div>

                <div className="flex items-center justify-between gap-5 py-5">
                  <div>
                    <p className="text-sm font-bold text-navy">
                      Booking Notifications
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate">
                      Receive booking and trip updates by email.
                    </p>
                  </div>

                  <div
                    aria-label="Booking notifications enabled"
                    className="h-6 w-11 shrink-0 rounded-full bg-blue p-1"
                  >
                    <div className="h-4 w-4 translate-x-5 rounded-full bg-white shadow-sm" />
                  </div>
                </div>

                <div className="flex flex-col gap-4 py-5 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-navy">
                      Account Privacy
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate">
                      Manage your account and personal information.
                    </p>
                  </div>

                  <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-[#F3F6FA] px-4 py-2.5 text-[11px] font-bold text-slate">
                    Coming with backend
                    <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </section>

            {/* =================================================
                SUPPORT
            ================================================== */}
            <section
              id="support"
              className="scroll-mt-28 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-navy via-[#103B6D] to-blue p-7 text-white shadow-[0_30px_80px_-35px_rgba(8,33,76,0.65)] sm:p-9"
            >
              <div className="pointer-events-none absolute" />

              <div className="relative flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] text-white/55 uppercase">
                    Need Assistance?
                  </p>

                  <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.025em] sm:text-3xl">
                    We&apos;re here to help.
                  </h2>

                  <p className="mt-3 max-w-lg text-sm leading-6 text-white/70">
                    Have a question about your booking, payment or upcoming
                    journey? The Mayura team is here to assist.
                  </p>
                </div>

                <div className="shrink-0">
                  <a
                    href="https://wa.me/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-bold text-navy transition-all hover:-translate-y-0.5 hover:bg-accent hover:text-white"
                  >
                    <Headphones size={15} />
                    Contact Mayura
                  </a>

                  <p className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-white/55 sm:justify-end">
                    <Mail size={12} />
                    Travel assistance available
                  </p>
                </div>
              </div>
            </section>

            {/* =================================================
                SIGN OUT
            ================================================== */}
            <div className="flex justify-center pt-1">
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-xs font-bold text-slate transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>

            {/* =================================================
                FOOTER LINK
            ================================================== */}
            <div className="border-t border-[#DDE5EF] pt-7 text-center">
              <Link
                href="/packages"
                className="inline-flex items-center gap-2 text-xs font-bold text-blue transition-colors hover:text-accent"
              >
                Browse more Mayura packages
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}