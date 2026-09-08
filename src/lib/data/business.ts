export const business = {
  legalName: "Gautam's Mayura Package Tours",
  shortName: "Mayura",
  tagline: "Package Tours · Bengaluru",
  foundedYear: 2000,

  phone: "+91 80 2200 1234",
  whatsapp: "+91 80 2200 1234",
  email: "bookings@mayurapackagetours.com",

  address: {
    line1: "Gandhi Nagar (Anandrao Circle)",
    line2: "Bengaluru – 560 009, Karnataka",
    city: "Bengaluru",
    state: "Karnataka",
    postalCode: "560009",
    country: "IN",
  },

  hours: "9 AM – 9 PM daily",

  credentials: ["Karnataka Tourism Licensed"],
  bookingPlatforms: ["RedBus", "AbhiBus", "MakeMyTrip", "EaseMyTrip", "Direct Booking"],

  /** Aggregate rating only — no individual reviews are fabricated or displayed as verified quotes. */
  aggregateRating: {
    value: 4.4,
    source: "JustDial & Google",
  },

  /** Inferred from the business email domain; confirm before launch. */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mayurapackagetours.com",
} as const;

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}

export function whatsappHref(phone: string, message?: string) {
  const digits = phone.replace(/[^\d]/g, "");
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${text}`;
}
