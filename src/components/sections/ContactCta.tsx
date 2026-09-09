"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal";
import { business, telHref, whatsappHref } from "@/lib/data/business";
import { packages } from "@/lib/data/packages";
import { Phone, MapPin, Mail } from "lucide-react";

export default function ContactCta() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [count, setCount] = useState("");

  function handleSubmit() {
    if (!name.trim() || !phone.trim()) {
      alert("Please enter your name and mobile number.");
      return;
    }

    const message =
      `Hi Mayura Team! 👋\n\n` +
      `🧳 *New Enquiry*\n` +
      `📛 Name: ${name.trim()}\n` +
      (destination ? `📍 Destination: ${destination}\n` : "") +
      (date ? `📅 Travel Date: ${date}\n` : "") +
      (count ? `👥 Travellers: ${count}\n` : "") +
      `\nPlease share package details and pricing. Thank you!`;

    window.open(whatsappHref(business.whatsapp, message), "_blank");
  }

  return (
    <section id="contact" className="scroll-mt-24 pt-0 pb-16 sm:pt-3 sm:pb-26">
      <div className="mx-auto max-w-(--container-width) px-5 sm:px-10">
        <Reveal className="relative grid grid-cols-1 gap-10 overflow-hidden rounded-3xl bg-linear-140 from-navy to-ink to-62% px-6 py-11 text-white sm:px-9 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:px-15 lg:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-[-190px] right-[-140px] h-130 w-130 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(229,0,126,.42), transparent 68%)" }}
          />

          <div className="relative">
            <span className="mb-3 block text-[11px] font-bold tracking-[0.22em] text-sky uppercase">Plan Your Trip</span>
            <h2 className="mb-4 text-[clamp(30px,3.4vw,44px)] leading-[1.06] font-extrabold tracking-tight">
              Ready to explore? Let&apos;s make it happen.
            </h2>
            <p className="max-w-[42ch] leading-[1.7] font-light text-white/78">
              Tell us where you want to go, and our team will craft a personalised itinerary within 24 hours —
              complete with hotel names, coach details, and all-inclusive pricing.
            </p>

            <div className="mt-7 flex flex-col gap-3.5">
              <div className="flex items-center gap-2.5 text-white/80">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  <Phone size={18} strokeWidth={1.7} className="text-sky" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold tracking-[0.14em] text-sky uppercase">Call / WhatsApp</div>
                  <a href={telHref(business.phone)} className="text-lg font-bold text-white">
                    {business.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2.5 text-white/80">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  <MapPin size={18} strokeWidth={1.7} className="text-sky" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold tracking-[0.14em] text-sky uppercase">Office</div>
                  <span className="text-[15px] font-medium text-white">
                    {business.address.line1}, {business.address.city} — {business.hours}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 text-white/80">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  <Mail size={18} strokeWidth={1.7} className="text-sky" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold tracking-[0.14em] text-sky uppercase">Email</div>
                  <a href={`mailto:${business.email}`} className="text-[15px] font-medium text-white">
                    {business.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex flex-col gap-3 rounded-2xl border border-white/18 bg-white/8 p-6.5 backdrop-blur-sm">
            <div className="mb-1 text-[17px] font-bold text-white">Get a Free Quote</div>
            <input
              type="text"
              placeholder="Your Full Name"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-[9px] border border-white/20 bg-white/10 px-4 py-3.5 text-[14.5px] text-white placeholder-white/50 outline-none focus:border-accent-light focus:bg-white/15"
            />
            <input
              type="tel"
              placeholder="Mobile Number (WhatsApp)"
              autoComplete="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-[9px] border border-white/20 bg-white/10 px-4 py-3.5 text-[14.5px] text-white placeholder-white/50 outline-none focus:border-accent-light focus:bg-white/15"
            />
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full rounded-[9px] border border-white/20 bg-white/10 px-4 py-3.5 text-[14.5px] text-white outline-none focus:border-accent-light focus:bg-white/15"
            >
              <option value="" className="text-ink">
                Choose Destination
              </option>
              {packages.map((pkg) => (
                <option key={pkg.slug} value={pkg.name} className="text-ink">
                  {pkg.name}
                </option>
              ))}
              <option value="Custom / Other" className="text-ink">
                Custom / Other
              </option>
            </select>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-[9px] border border-white/20 bg-white/10 px-4 py-3.5 text-[14.5px] text-white outline-none focus:border-accent-light focus:bg-white/15"
            />
            <input
              type="number"
              placeholder="Number of travellers"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className="w-full rounded-[9px] border border-white/20 bg-white/10 px-4 py-3.5 text-[14.5px] text-white placeholder-white/50 outline-none focus:border-accent-light focus:bg-white/15"
            />
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center justify-center gap-2.5 rounded-[9px] bg-accent py-4 text-[15px] font-bold text-white transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-accent-light"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
              Get My Free Quote via WhatsApp
            </button>
            <p className="text-center text-[11.5px] text-white/55">We reply within 30 minutes during office hours · No spam, ever</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
