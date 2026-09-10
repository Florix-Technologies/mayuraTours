import Image from "next/image";
import { business, telHref } from "@/lib/data/business";
import { packages } from "@/lib/data/packages";

const platformLinks: Record<string, string> = {
  RedBus: "https://www.redbus.in",
  AbhiBus: "https://www.abhibus.com",
  MakeMyTrip: "https://www.makemytrip.com",
  EaseMyTrip: "https://www.easemytrip.com",
   "Direct Booking": "#contact",
};

const platformLogo: Record<string, string> = {
  RedBus: "/logo/redbus.svg",
  AbhiBus: "/logo/abhibus.svg",
  MakeMyTrip: "/logo/makemytrip.svg",
  EaseMyTrip: "/logo/easemytrip.svg",
  "Direct Booking": "/logo/mayura1.svg",
};

export default function SiteFooter() {
  return (
    <footer className="bg-ink px-5 pt-16 pb-28 text-white/70 sm:px-10 sm:pb-10">
      <div className="mx-auto grid max-w-(--container-width) grid-cols-1 gap-11 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.3fr]">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <Image src="/mayura.png" alt={`${business.legalName} logo`} width={60} height={60} className="rounded-lg" />
            <div className="flex flex-col leading-tight">
              <span className="font-display text-lg font-extrabold text-white">
                {business.shortName}
                <span className="text-accent">.</span>
              </span>
              <span className="text-[9px] font-semibold tracking-[0.22em] text-white/55 uppercase">
                {business.tagline}
              </span>
            </div>
          </div>
          <p className="text-sm leading-[1.85]">
            <b className="font-semibold text-white">{business.legalName}</b>
            <br />
            {business.address.line1},
            <br />
            {business.address.line2}
            <br />
            <br />
            <b className="font-semibold text-white">Phone:</b> {business.phone}
            <br />
            <b className="font-semibold text-white">WhatsApp:</b> {business.whatsapp}
            <br />
            <b className="font-semibold text-white">Email:</b> {business.email}
            <br />
            <br />
            <span className="text-xs text-white/60">{business.credentials.join(" · ")}</span>
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-[11px] font-bold tracking-[0.2em] text-accent-light uppercase">Destinations</h3>
          <ul className="grid gap-2.5 text-sm">
            {packages.map((pkg) => (
              <li key={pkg.slug}>
                <a href="#packages" className="transition-colors hover:text-sky">
                  {pkg.name}
                </a>
              </li>
            ))}
            <li>
              <a href="#destinations" className="transition-colors hover:text-sky">
                All Destinations
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-[11px] font-bold tracking-[0.2em] text-accent-light uppercase">Company</h3>
          <ul className="grid gap-2.5 text-sm">
            <li>
              <a href="#trust" className="transition-colors hover:text-sky">
                About Us
              </a>
            </li>
            <li>
              <a href="#fleet" className="transition-colors hover:text-sky">
                Our Fleet
              </a>
            </li>
            <li>
              <a href="#contact" className="transition-colors hover:text-sky">
                Corporate Bookings
              </a>
            </li>
            <li>
              <a href="#contact" className="transition-colors hover:text-sky">
                Group Tours
              </a>
            </li>
            <li>
              <a href={telHref(business.phone)} className="transition-colors hover:text-sky">
                Talk to Us
              </a>
            </li>
          </ul>
        </div>

        <div>
  <h3 className="mb-4 text-[11px] font-bold tracking-[0.2em] text-accent-light uppercase">
    Book on
  </h3>

  <ul className="grid gap-3.5 text-sm">
    {business.bookingPlatforms.map((platform) => (
      <li key={platform}>
        <a
          href={platformLinks[platform]}
          target={platformLinks[platform]?.startsWith("http") ? "_blank" : undefined}
          rel={platformLinks[platform]?.startsWith("http") ? "noopener noreferrer" : undefined}
          className="flex items-center transition-colors hover:text-sky"
        >
          {/* Fixed logo area */}
          <div className="flex h-6 w-20 shrink-0 items-center justify-start">
            <Image
              src={platformLogo[platform]}
              alt={platform}
              width={64}
              height={28}
              className={`object-contain ${
    platform === "Direct Booking"
      ? "max-h-7 max-w-16"
      : "max-h-5 max-w-14"
  }`}
            />
          </div>

          {/* Name */}
          <span className="ml-0.1 text-[14px]">
            {platform}
          </span>
        </a>
      </li>
    ))}
  </ul>
</div>
      </div>

      <div className="mx-auto mt-11 flex max-w-(--container-width) flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-6 text-xs text-white/50">
        <span>
          © {new Date().getFullYear()} {business.legalName} · {business.address.city}
        </span>
        <span>Terms · Cancellation Policy · Privacy</span>
      </div>
    </footer>
  );
}
