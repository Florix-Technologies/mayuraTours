export const BOOKING_INTENT_KEY = "mayura-booking-intent";

export type BookingIntent = {
  slug: string;
  packageName: string;
  travelDate: string;
  travellers: string;
  accommodation: string;
};

export function saveBookingIntent(intent: BookingIntent) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(BOOKING_INTENT_KEY, JSON.stringify(intent));
}

export function readBookingIntent(): BookingIntent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(BOOKING_INTENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BookingIntent;
    if (!parsed?.slug) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearBookingIntent() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(BOOKING_INTENT_KEY);
}
