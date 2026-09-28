"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  Clock3,
  Download,
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

function getFirstName(name?: string) {
  if (!name) return "Traveller";

  return name.trim().split(" ")[0] || "Traveller";
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

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isReady, signOut } = useAuth();

  const [intent, setIntent] = useState<BookingIntent | null>(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isReady) return;

    if (!isAuthenticated) {
      router.replace("/login?next=/account");
      return;
    }

    setIntent(readBookingIntent());
  }, [isAuthenticated, isReady, router]);

  const currentPackage = useMemo(() => {
    if (!intent) return null;

    return packages.find((pkg) => pkg.slug === intent.slug) ?? null;
  }, [intent]);

  if (!isReady || !isAuthenticated) {
    return <main className="min-h-screen bg-paper" />;
  }

  const firstName = "Traveller";

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
    <main className="min-h-screen bg-[#F5F8FC] pb-16 pt-24 sm:pt-28">
      {/* =========================
          MOBILE MENU
      ========================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-navy/35 backdrop-blur-sm lg:hidden">
          <div className="absolute left-0 top-0 h-full w-[82%] max-w-sm bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-extrabold tracking-tight text-navy">
                  MAYURA
                </p>

                <p className="text-[9px] font-bold tracking-[0.18em] text-accent uppercase">
                  My Account
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F7FB] text-navy"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mt-8 space-y-1.5">
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
                        ? "bg-blue text-white shadow-[0_12px_30px_-15px_rgba(20,92,168,0.8)]"
                        : "text-slate hover:bg-[#F5F8FC] hover:text-navy"
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 border-t border-[#E5EBF3] pt-6">
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

      {/* =========================
          PAGE HEADER
      ========================== */}
      <section className="relative overflow-hidden bg-linear-to-br from-navy via-[#0D4C91] to-blue px-5 pb-24 pt-10 sm:px-8 sm:pb-28">
        <div className="absolute -right-28 -top-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] text-white/65 uppercase">
                My Account
              </p>

              <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl">
                Welcome back, {firstName}
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">
                Manage your trips, bookings and travel preferences
                from one place.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/15 lg:hidden"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* =========================
          MAIN DASHBOARD
      ========================== */}
      <section className="relative -mt-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:px-8 lg:grid-cols-[240px_minmax(0,1fr)]">
          {/* =========================
              SIDEBAR
          ========================== */}
          <aside className="hidden self-start rounded-3xl border border-[#DCE7F4] bg-white p-3 shadow-[0_24px_70px_-35px_rgba(8,33,76,0.4)] lg:block">
            <div className="px-4 py-4">
              <p className="text-[9px] font-bold tracking-[0.18em] text-[#8B9BB2] uppercase">
                Account
              </p>

              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue to-accent text-sm font-extrabold text-white">
                  {firstName.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-navy">
                    {firstName || firstName}
                  </p>

                  <p className="truncate text-[10px] text-slate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-2 space-y-1">
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
                        ? "bg-blue text-white shadow-[0_12px_30px_-15px_rgba(20,92,168,0.8)]"
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

          {/* =========================
              CONTENT
          ========================== */}
          <div className="min-w-0 space-y-6">
            {/* =========================
                OVERVIEW
            ========================== */}
            <section id="overview" className="scroll-mt-28">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-3xl border border-[#DCE7F4] bg-white p-5 shadow-[0_18px_50px_-35px_rgba(8,33,76,0.3)]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue/10 text-blue">
                    <Ticket size={19} />
                  </div>

                  <p className="mt-5 text-2xl font-extrabold text-navy">
                    3
                  </p>

                  <p className="mt-1 text-[11px] font-semibold text-slate">
                    Total Bookings
                  </p>
                </div>

                <div className="rounded-3xl border border-[#DCE7F4] bg-white p-5 shadow-[0_18px_50px_-35px_rgba(8,33,76,0.3)]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <CalendarDays size={19} />
                  </div>

                  <p className="mt-5 text-2xl font-extrabold text-navy">
                    {upcomingBooking ? "1" : "0"}
                  </p>

                  <p className="mt-1 text-[11px] font-semibold text-slate">
                    Upcoming Trips
                  </p>
                </div>

                <div className="rounded-3xl border border-[#DCE7F4] bg-white p-5 shadow-[0_18px_50px_-35px_rgba(8,33,76,0.3)]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF3] text-[#16A34A]">
                    <CheckCircle2 size={19} />
                  </div>

                  <p className="mt-5 text-2xl font-extrabold text-navy">
                    2
                  </p>

                  <p className="mt-1 text-[11px] font-semibold text-slate">
                    Completed Trips
                  </p>
                </div>

                <div className="rounded-3xl border border-[#DCE7F4] bg-white p-5 shadow-[0_18px_50px_-35px_rgba(8,33,76,0.3)]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF7ED] text-[#EA580C]">
                    <WalletCards size={19} />
                  </div>

                  <p className="mt-5 text-2xl font-extrabold text-navy">
                    0
                  </p>

                  <p className="mt-1 text-[11px] font-semibold text-slate">
                    Pending Payments
                  </p>
                </div>
              </div>

              {/* Upcoming Trip */}
              <div className="mt-6 overflow-hidden rounded-3xl border border-[#DCE7F4] bg-white shadow-[0_22px_60px_-35px_rgba(8,33,76,0.35)]">
                <div className="flex flex-col justify-between gap-3 border-b border-[#E5EBF3] px-6 py-5 sm:flex-row sm:items-center sm:px-8">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.18em] text-accent uppercase">
                      Your next journey
                    </p>

                    <h2 className="mt-1 text-xl font-extrabold text-navy">
                      Upcoming Trip
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => scrollToSection("bookings")}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue hover:text-accent"
                  >
                    View all bookings
                    <ChevronRight size={15} />
                  </button>
                </div>

                {upcomingBooking ? (
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue/10 text-blue">
                          <MapPin size={24} />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-xl font-extrabold text-navy">
                              {upcomingBooking.packageName}
                            </h3>

                            <span className="rounded-full bg-[#ECFDF3] px-2.5 py-1 text-[9px] font-bold text-[#15803D]">
                              CONFIRMED
                            </span>
                          </div>

                          <p className="mt-1 text-xs font-semibold text-slate">
                            {upcomingBooking.reference}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate">
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays size={14} className="text-blue" />
                              {upcomingBooking.travelDate}
                            </span>

                            <span className="inline-flex items-center gap-1.5">
                              <Users size={14} className="text-blue" />
                              {upcomingBooking.travellers}{" "}
                              {upcomingBooking.travellers === 1
                                ? "Traveller"
                                : "Travellers"}
                            </span>

                            <span className="inline-flex items-center gap-1.5">
                              <ShieldCheck
                                size={14}
                                className="text-accent"
                              />
                              {upcomingBooking.accommodation}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
                        <div>
                          <p className="text-[9px] font-semibold tracking-[0.12em] text-[#8B9BB2] uppercase lg:text-right">
                            Booking Amount
                          </p>

                          <p className="mt-1 text-2xl font-extrabold text-blue">
                            {upcomingBooking.amount}
                          </p>
                        </div>

                        <Link
                          href="/booking/confirmation"
                          className="group inline-flex items-center gap-2 rounded-full bg-linear-to-r from-blue to-navy px-5 py-3 text-xs font-bold text-white shadow-[0_12px_25px_-12px_rgba(8,33,76,0.7)] transition-all hover:-translate-y-0.5 hover:bg-none hover:bg-accent"
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
                  <div className="px-6 py-12 text-center sm:px-8">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1F6FC] text-blue">
                      <CalendarDays size={24} />
                    </div>

                    <h3 className="mt-4 text-lg font-extrabold text-navy">
                      No upcoming trips
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate">
                      Explore our curated packages and start planning
                      your next journey.
                    </p>

                    <Link
                      href="/packages"
                      className="mt-5 inline-flex rounded-full bg-blue px-5 py-3 text-xs font-bold text-white"
                    >
                      Browse Packages
                    </Link>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <Link
                  href="/packages"
                  className="group rounded-3xl border border-[#DCE7F4] bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_45px_-30px_rgba(8,33,76,0.45)]"
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
                  className="group rounded-3xl border border-[#DCE7F4] bg-white p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_45px_-30px_rgba(8,33,76,0.45)]"
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
                  className="group rounded-3xl border border-[#DCE7F4] bg-white p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_45px_-30px_rgba(8,33,76,0.45)]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF3] text-[#16A34A]">
                    <Headphones size={18} />
                  </div>

                  <p className="mt-4 text-sm font-extrabold text-navy">
                    Need Help?
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-slate">
                    We're here for your travel questions.
                  </p>

                  <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold text-[#16A34A]">
                    Get Support
                    <ArrowRight size={13} />
                  </span>
                </button>
              </div>
            </section>

            {/* =========================
                MY BOOKINGS
            ========================== */}
            <section
              id="bookings"
              className="scroll-mt-28 rounded-3xl border border-[#DCE7F4] bg-white shadow-[0_20px_60px_-35px_rgba(8,33,76,0.3)]"
            >
              <div className="border-b border-[#E5EBF3] px-6 py-6 sm:px-8">
                <p className="text-[10px] font-bold tracking-[0.18em] text-accent uppercase">
                  Your Trips
                </p>

                <h2 className="mt-1.5 text-2xl font-extrabold text-navy">
                  My Bookings
                </h2>

                <p className="mt-2 text-sm text-slate">
                  View and manage your Mayura travel bookings.
                </p>
              </div>

              <div className="divide-y divide-[#E5EBF3]">
                {mockBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-6 transition-colors hover:bg-[#FBFCFE] sm:p-7"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F1F6FC] text-blue">
                          <Ticket size={20} />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-extrabold text-navy">
                              {booking.packageName}
                            </h3>

                            <StatusBadge status={booking.status} />
                          </div>

                          <p className="mt-1 text-[11px] font-semibold text-slate">
                            {booking.reference}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-slate">
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays size={13} className="text-blue" />
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
                          <p className="text-[9px] font-semibold tracking-[0.1em] text-[#8B9BB2] uppercase">
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
                          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[11px] font-bold ${
                            booking.id === "1"
                              ? "bg-blue text-white hover:bg-accent"
                              : "bg-[#F1F6FC] text-slate"
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

              <div className="border-t border-[#E5EBF3] px-6 py-5 sm:px-8">
                <p className="text-xs text-slate">
                  Booking history and real-time status will be
                  connected to your account after backend integration.
                </p>
              </div>
            </section>

            {/* =========================
                PROFILE
            ========================== */}
            <section
              id="profile"
              className="scroll-mt-28 rounded-3xl border border-[#DCE7F4] bg-white p-6 shadow-[0_20px_60px_-35px_rgba(8,33,76,0.3)] sm:p-8"
            >
              <p className="text-[10px] font-bold tracking-[0.18em] text-accent uppercase">
                Personal Details
              </p>

              <h2 className="mt-1.5 text-2xl font-extrabold text-navy">
                Profile
              </h2>

              <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue to-accent text-2xl font-extrabold text-white shadow-[0_15px_35px_-15px_rgba(20,92,168,0.55)]">
                  {firstName.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-navy">
                    {firstName || firstName}
                  </h3>

                  <p className="mt-1 text-sm text-slate">
                    Mayura Traveller
                  </p>
                </div>

                <button
                  type="button"
                  className="sm:ml-auto inline-flex items-center justify-center rounded-full border border-[#DCE7F4] bg-white px-5 py-3 text-xs font-bold text-navy transition-all hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-white"
                >
                  Edit Profile
                </button>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#F7FAFE] p-4 ring-1 ring-[#E2EAF4]">
                  <p className="text-[9px] font-semibold tracking-[0.1em] text-[#8B9BB2] uppercase">
                    Full Name
                  </p>

                  <p className="mt-1.5 text-sm font-bold text-navy">
                    {firstName || "Not provided"}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F7FAFE] p-4 ring-1 ring-[#E2EAF4]">
                  <p className="text-[9px] font-semibold tracking-[0.1em] text-[#8B9BB2] uppercase">
                    Email Address
                  </p>

                  <p className="mt-1.5 break-all text-sm font-bold text-navy">
                    {user?.email || "Not provided"}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F7FAFE] p-4 ring-1 ring-[#E2EAF4]">
                  <p className="text-[9px] font-semibold tracking-[0.1em] text-[#8B9BB2] uppercase">
                    Mobile Number
                  </p>

                  <p className="mt-1.5 text-sm font-bold text-navy">
                    Not provided
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F7FAFE] p-4 ring-1 ring-[#E2EAF4]">
                  <p className="text-[9px] font-semibold tracking-[0.1em] text-[#8B9BB2] uppercase">
                    Account Status
                  </p>

                  <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-bold text-[#15803D]">
                    <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
                    Active
                  </p>
                </div>
              </div>
            </section>

            {/* =========================
                TRAVEL PREFERENCES
            ========================== */}
            <section
              id="preferences"
              className="scroll-mt-28 rounded-3xl border border-[#DCE7F4] bg-white p-6 shadow-[0_20px_60px_-35px_rgba(8,33,76,0.3)] sm:p-8"
            >
              <p className="text-[10px] font-bold tracking-[0.18em] text-accent uppercase">
                Personalise Your Trips
              </p>

              <h2 className="mt-1.5 text-2xl font-extrabold text-navy">
                Travel Preferences
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate">
                Tell us what kind of travel you enjoy. These
                preferences can later be used to personalise your
                Mayura recommendations.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#F7FAFE] p-5 ring-1 ring-[#E2EAF4]">
                  <p className="text-[9px] font-bold tracking-[0.1em] text-[#8B9BB2] uppercase">
                    Favourite Places
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Beaches", "Mountains", "Nature"].map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-blue/10 px-3 py-1.5 text-[10px] font-bold text-blue"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-[#F7FAFE] p-5 ring-1 ring-[#E2EAF4]">
                  <p className="text-[9px] font-bold tracking-[0.1em] text-[#8B9BB2] uppercase">
                    Usually Travel With
                  </p>

                  <p className="mt-3 text-sm font-bold text-navy">
                    Family
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F7FAFE] p-5 ring-1 ring-[#E2EAF4]">
                  <p className="text-[9px] font-bold tracking-[0.1em] text-[#8B9BB2] uppercase">
                    Preferred Experiences
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Food", "Sightseeing", "Photography"].map(
                      (item) => (
                        <span
                          key={item}
                          className="rounded-full bg-accent/10 px-3 py-1.5 text-[10px] font-bold text-accent"
                        >
                          {item}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div className="rounded-2xl bg-[#F7FAFE] p-5 ring-1 ring-[#E2EAF4]">
                  <p className="text-[9px] font-bold tracking-[0.1em] text-[#8B9BB2] uppercase">
                    Typical Trip
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue/10 px-3 py-1.5 text-[10px] font-bold text-blue">
                      3–4 Days
                    </span>

                    <span className="rounded-full bg-accent/10 px-3 py-1.5 text-[10px] font-bold text-accent">
                      ₹5k–₹10k
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-navy px-5 py-3 text-xs font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-accent"
              >
                Edit Travel Preferences
                <ArrowRight size={14} />
              </button>
            </section>

            {/* =========================
                SETTINGS
            ========================== */}
            <section
              id="settings"
              className="scroll-mt-28 rounded-3xl border border-[#DCE7F4] bg-white p-6 shadow-[0_20px_60px_-35px_rgba(8,33,76,0.3)] sm:p-8"
            >
              <p className="text-[10px] font-bold tracking-[0.18em] text-accent uppercase">
                Account Controls
              </p>

              <h2 className="mt-1.5 text-2xl font-extrabold text-navy">
                Settings
              </h2>

              <div className="mt-7 divide-y divide-[#E5EBF3]">
                <div className="flex items-center justify-between gap-5 py-5 first:pt-0">
                  <div>
                    <p className="text-sm font-bold text-navy">
                      Change Password
                    </p>

                    <p className="mt-1 text-xs text-slate">
                      Update your account password.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="shrink-0 rounded-full border border-[#DCE7F4] px-4 py-2 text-[11px] font-bold text-navy hover:border-accent hover:text-accent"
                  >
                    Change
                  </button>
                </div>

                <div className="flex items-center justify-between gap-5 py-5">
                  <div>
                    <p className="text-sm font-bold text-navy">
                      Booking Notifications
                    </p>

                    <p className="mt-1 text-xs text-slate">
                      Receive booking and trip updates by email.
                    </p>
                  </div>

                  <div className="h-6 w-11 rounded-full bg-blue p-1">
                    <div className="h-4 w-4 translate-x-5 rounded-full bg-white shadow-sm" />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-5 py-5 last:pb-0">
                  <div>
                    <p className="text-sm font-bold text-navy">
                      Account Privacy
                    </p>

                    <p className="mt-1 text-xs text-slate">
                      Manage your account and personal information.
                    </p>
                  </div>

                  <ChevronRight
                    size={18}
                    className="shrink-0 text-slate"
                  />
                </div>
              </div>
            </section>

            {/* =========================
                SUPPORT
            ========================== */}
            <section
              id="support"
              className="scroll-mt-28 overflow-hidden rounded-3xl bg-linear-to-br from-navy via-[#0D4C91] to-blue p-6 text-white shadow-[0_25px_70px_-35px_rgba(8,33,76,0.6)] sm:p-8"
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.18em] text-white/60 uppercase">
                    Need Assistance?
                  </p>

                  <h2 className="mt-2 text-2xl font-extrabold">
                    We're here to help.
                  </h2>

                  <p className="mt-2 max-w-lg text-sm leading-6 text-white/70">
                    Have a question about your booking, payment or
                    upcoming trip? Get in touch with the Mayura team.
                  </p>
                </div>

                <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-bold text-navy transition-all hover:-translate-y-0.5 hover:bg-accent hover:text-white"
                  >
                    <Headphones size={15} />
                    Contact Support
                  </Link>

                  <div className="inline-flex items-center gap-2 text-[10px] text-white/65">
                    <Mail size={13} />
                    Support available for your travel needs
                  </div>
                </div>
              </div>
            </section>

            {/* =========================
                SIGN OUT
            ========================== */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-xs font-bold text-slate transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>

            {/* =========================
                BACK TO PACKAGES
            ========================== */}
            <div className="text-center">
              <Link
                href="/packages"
                className="inline-flex items-center gap-2 text-xs font-bold text-blue hover:text-accent"
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