import type { TourPackage } from "@/lib/data/packages";
import type { BookingIntent } from "./intent";

function parseDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T12:00:00`);
  const [year, month, day] = value.split("-").map(Number);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
}

function formatDate(date: Date | null) {
  return date ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(date) : "To be confirmed";
}

export function getPaymentReview(intent: BookingIntent, pkg?: TourPackage) {
  // Preserve the existing catalogue calculation; this is not an authorized charge.
  const travellerCount = Number(intent.travellers) || 1;
  const pricePerPerson = pkg?.priceValue ?? null;
  const totalAmount = pricePerPerson !== null ? pricePerPerson * travellerCount : null;
  const duration = pkg?.duration || pkg?.tags.find(tag => /\b\d+\s*(?:days?|nights?)\b|same.day return/i.test(tag));
  const days = duration?.match(/(\d+)\s*days?\b/i)?.[1];
  const dayCount = days ? Number(days) : /same.day return/i.test(duration || "") ? 1 : null;
  const endDate = parseDate(intent.travelDate);
  if (endDate && dayCount) endDate.setDate(endDate.getDate() + dayCount - 1);
  return {
    travellerCount, pricePerPerson, totalAmount,
    duration: duration || "To be confirmed",
    startDate: formatDate(parseDate(intent.travelDate)),
    endDate: endDate && dayCount ? formatDate(endDate) : "To be confirmed",
  };
}

export function formatRupees(value: number | null) {
  return value === null ? "On request" : `₹${value.toLocaleString("en-IN")}`;
}
