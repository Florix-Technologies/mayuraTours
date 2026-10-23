import type { BookingIntent } from "./intent";

const PREVIEW_KEY = "mayura-development-confirmation-preview";

export function isLocalDevelopmentHost(host: string) {
  if (process.env.NODE_ENV !== "development") return false;
  try {
    const hostname = new URL(`http://${host}`).hostname;
    return ["localhost", "127.0.0.1", "[::1]"].includes(hostname);
  } catch {
    return false;
  }
}

export function canUseDevelopmentPayment() {
  return typeof window !== "undefined" && isLocalDevelopmentHost(window.location.host);
}

export function isCompletePreviewBooking(booking: BookingIntent) {
  const count = Number(booking.travellers);
  const date = new Date(`${booking.travelDate}T00:00:00Z`);
  return Boolean(booking.slug && booking.packageName && booking.accommodation
    && typeof booking.leadEmail === "string" && booking.leadEmail.trim()
    && typeof booking.leadPhone === "string" && booking.leadPhone.trim()
    && Number.isInteger(count) && count > 0
    && /^\d{4}-\d{2}-\d{2}$/.test(booking.travelDate)
    && !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === booking.travelDate
    && Array.isArray(booking.travellerDetails) && booking.travellerDetails.length === count
    && booking.travellerDetails.every(traveller =>
      typeof traveller.fullName === "string" && traveller.fullName.trim()
      && Number.isInteger(Number(traveller.age)) && Number(traveller.age) >= 1 && Number(traveller.age) <= 120
      && ["male", "female", "other"].includes(traveller.gender)));
}

export function startDevelopmentConfirmationPreview(booking: BookingIntent) {
  if (!canUseDevelopmentPayment() || !isCompletePreviewBooking(booking)) {
    throw new Error("A complete booking on localhost in development mode is required.");
  }
  // This is UI-preview authorization, not a transaction or a paid booking record.
  // No payment status, payment ID or booking confirmation is written anywhere.
  window.sessionStorage.setItem(PREVIEW_KEY, JSON.stringify(booking));
}

export function hasDevelopmentConfirmationPreview(booking: BookingIntent) {
  if (!canUseDevelopmentPayment() || !isCompletePreviewBooking(booking)) return false;
  try {
    return window.sessionStorage.getItem(PREVIEW_KEY) === JSON.stringify(booking);
  } catch {
    return false;
  }
}
