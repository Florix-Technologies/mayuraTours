"use client";
import { packages } from "@/lib/data/packages";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  readBookingIntent,
  BookingIntent,
} from "@/lib/booking/intent";

export default function PaymentPage() {
  const router = useRouter();

  const [intent, setIntent] = useState<BookingIntent | null>(null);

  useEffect(() => {
    const booking = readBookingIntent();

    if (!booking) {
      router.replace("/packages");
      return;
    }

    setIntent(booking);
  }, [router]);

  if (!intent) {
    return null;
  }

  const travellerCount = Number(intent.travellers) || 1;

  const packageData = packages.find(
  (pkg) => pkg.slug === intent.slug
  );

  const pricePerPerson = packageData?.priceValue ?? null;

  const totalAmount =
  pricePerPerson !== null
    ? pricePerPerson * travellerCount
    : null;

  const formattedDate = intent.travelDate
    ? new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(`${intent.travelDate}T00:00:00`))
    : "Not selected";

  return (
    <main className="min-h-screen bg-[#F3F7FC]">
      {/* Top Header */}
      <section className="relative overflow-hidden bg-linear-to-br from-navy via-[#0D4C91] to-blue pt-24 pb-12 sm:pt-28">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-5 sm:px-8 lg:-translate-x-20">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
          >
            <ArrowLeft size={15} />
            Back to Traveller Details
          </button>

          <div className="max-w-2xl">
            <p className="text-[10px] font-bold tracking-[0.2em] text-white/70 uppercase">
              Step 3 · Secure Checkout
            </p>

            <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.035em] text-white sm:text-5xl">
              Review & Payment
            </h1>

            <p className="mt-4 text-sm leading-7 text-white/75 sm:text-base">
              Review your journey and traveller information before
              proceeding to payment.
            </p>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="relative -mt-5 pb-16 sm:pb-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
            {/* LEFT */}
            <div className="space-y-6">
              {/* Booking Summary */}
              <section className="overflow-hidden rounded-3xl border border-[#DCE7F4] bg-white shadow-[0_18px_50px_-35px_rgba(8,33,76,0.35)]">
                <div className="border-b border-[#E5EDF6] bg-linear-to-r from-[#EEF5FD] to-white px-6 py-5 sm:px-8">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.17em] text-accent uppercase">
                        Booking Summary
                      </p>

                      <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-navy">
                        {intent.packageName}
                      </h2>
                    </div>

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue/10 text-blue">
                      <CheckCircle2 size={21} />
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 p-6 sm:grid-cols-3 sm:p-8">
                  <div className="rounded-2xl border border-[#E1EAF5] bg-[#F7FAFE] p-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue/10 text-blue">
                      <CalendarDays size={17} />
                    </div>

                    <p className="mt-4 text-[10px] font-semibold tracking-[0.12em] text-[#8B9BB2] uppercase">
                      Travel Date
                    </p>

                    <p className="mt-1 text-sm font-bold text-navy">
                      {formattedDate}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#E1EAF5] bg-[#F7FAFE] p-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue/10 text-blue">
                      <Users size={17} />
                    </div>

                    <p className="mt-4 text-[10px] font-semibold tracking-[0.12em] text-[#8B9BB2] uppercase">
                      Travellers
                    </p>

                    <p className="mt-1 text-sm font-bold text-navy">
                      {travellerCount}{" "}
                      {travellerCount === 1 ? "Adult" : "Adults"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#E1EAF5] bg-[#F7FAFE] p-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <CheckCircle2 size={17} />
                    </div>

                    <p className="mt-4 text-[10px] font-semibold tracking-[0.12em] text-[#8B9BB2] uppercase">
                      Accommodation
                    </p>

                    <p className="mt-1 text-sm font-bold capitalize text-navy">
                      {intent.accommodation || "To be confirmed"}
                    </p>
                  </div>
                </div>
              </section>

              {/* Contact Details */}
              <section className="rounded-3xl border border-[#DCE7F4] bg-white p-6 shadow-[0_18px_50px_-35px_rgba(8,33,76,0.28)] sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="h-1 w-8 rounded-full bg-accent" />

                  <p className="text-[10px] font-bold tracking-[0.17em] text-accent uppercase">
                    Contact Details
                  </p>
                </div>

                <h2 className="mt-2 text-2xl font-extrabold text-navy">
                  Lead Traveller
                </h2>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[#F7FAFE] p-4 ring-1 ring-[#E2EAF4]">
                    <p className="text-[10px] font-semibold tracking-[0.12em] text-[#8B9BB2] uppercase">
                      Email
                    </p>

                    <p className="mt-1.5 break-all text-sm font-semibold text-navy">
                      {intent.leadEmail || "Not provided"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#F7FAFE] p-4 ring-1 ring-[#E2EAF4]">
                    <p className="text-[10px] font-semibold tracking-[0.12em] text-[#8B9BB2] uppercase">
                      Mobile
                    </p>

                    <p className="mt-1.5 text-sm font-semibold text-navy">
                      {intent.leadPhone || "Not provided"}
                    </p>
                  </div>
                </div>
              </section>

              {/* Traveller Details */}
              <section className="rounded-3xl border border-[#DCE7F4] bg-white p-6 shadow-[0_18px_50px_-35px_rgba(8,33,76,0.28)] sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="h-1 w-8 rounded-full bg-blue" />

                  <p className="text-[10px] font-bold tracking-[0.17em] text-blue uppercase">
                    Traveller Details
                  </p>
                </div>

                <h2 className="mt-2 text-2xl font-extrabold text-navy">
                  Travellers
                </h2>

                <div className="mt-6 space-y-3">
                  {intent.travellerDetails?.map(
                    (traveller, index) => (
                      <div
                        key={`${traveller.fullName}-${index}`}
                        className="rounded-2xl border border-[#E1EAF5] bg-[#F8FAFD] p-4 transition-colors hover:border-blue/30"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue text-xs font-bold text-white">
                              {index + 1}
                            </span>

                            <p className="text-sm font-bold text-navy">
                              Traveller {index + 1}
                            </p>
                          </div>

                          <span className="rounded-full bg-accent/10 px-3 py-1 text-[10px] font-bold capitalize text-accent">
                            {traveller.gender || "Not specified"}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-4 border-t border-[#E5EBF3] pt-4 sm:grid-cols-2">
                          <div>
                            <p className="text-[10px] font-semibold tracking-[0.1em] text-[#8B9BB2] uppercase">
                              Full Name
                            </p>

                            <p className="mt-1 text-sm font-semibold text-navy">
                              {traveller.fullName}
                            </p>
                          </div>

                          <div>
                            <p className="text-[10px] font-semibold tracking-[0.1em] text-[#8B9BB2] uppercase">
                              Age
                            </p>

                            <p className="mt-1 text-sm font-semibold text-navy">
                              {traveller.age}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </section>
            </div>

            {/* RIGHT */}
            <aside className="lg:sticky lg:top-8 lg:self-start">
              <div className="overflow-hidden rounded-3xl bg-white shadow-[0_24px_70px_-30px_rgba(8,33,76,0.45)]">
                {/* Price Header */}
                <div className="bg-linear-to-br from-navy to-[#0C559F] p-6 text-white sm:p-7">
                  <p className="text-[10px] font-bold tracking-[0.17em] text-white/65 uppercase">
                    Payment
                  </p>

                  <h2 className="mt-2 text-2xl font-extrabold">
                    Price Summary
                  </h2>

                  <p className="mt-2 text-xs leading-5 text-white/65">
                    Your final payable amount will be confirmed before
                    payment.
                  </p>
                </div>

                <div className="p-6 sm:p-7">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-sm text-slate">
                        Package
                      </span>

                      <span className="max-w-45 text-right text-sm font-semibold text-navy">
                        {intent.packageName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-slate">
                        Travellers
                      </span>

                      <span className="text-sm font-semibold text-navy">
                        {travellerCount}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-slate">
                        Price per person
                      </span>

                    <span className="text-sm font-semibold text-navy">
  {pricePerPerson !== null
    ? `₹${pricePerPerson.toLocaleString("en-IN")}`
    : "On request"}
</span>
                    </div>
                  </div>

                  <div className="my-6 border-t border-[#E5EBF3]" />

                  <div className="rounded-2xl bg-[#F1F6FC] p-4">
                    <p className="text-[10px] font-semibold tracking-[0.12em] text-[#8B9BB2] uppercase">
                      Payable Amount
                    </p>

                    <p className="mt-1 text-2xl font-extrabold text-navy">
                       {totalAmount !== null
                              ? `₹${totalAmount.toLocaleString("en-IN")}`
                              : "On request"}
                    </p>
                  </div>

                  {/* Payment Method */}
                  <div className="mt-5 rounded-2xl border border-blue/20 bg-[#F5F9FE] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue/10 text-blue">
                        <CreditCard size={19} />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-navy">
                          Online Payment
                        </p>

                        <p className="mt-0.5 text-xs text-slate">
                          Secure payment gateway
                        </p>
                      </div>
                    </div>
                  </div>

                <button
  type="button"
  onClick={() => router.push("/booking/confirmation")}
  className="mt-5 w-full rounded-full bg-linear-to-r from-blue to-navy px-5 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-none hover:bg-accent hover:shadow-lg"
>
  Proceed to Payment
</button>

                  <div className="mt-4 flex items-start gap-2 rounded-2xl bg-[#F8FAFD] px-3.5 py-3 text-[11px] leading-5 text-slate">
                    <ShieldCheck
                      size={15}
                      className="mt-0.5 shrink-0 text-blue"
                    />

                    <p>
                     Your total is calculated based on the selected package
                     and number of travellers.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}