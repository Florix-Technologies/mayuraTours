import { updateBookingIntent } from "@/lib/booking/intent";

export const AUTH_STORAGE_KEY = "mayura-auth-session";
const PROFILE_STORAGE_PREFIX = "mayura-account-profile:";

export type AuthUser = {
  email: string;
  name?: string;
  age?: string;
  gender?: string;
};

function normalizeUser(value: unknown): AuthUser | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  if (typeof data.email !== "string" || !data.email.trim()) return null;
  const user: AuthUser = { email: data.email.trim().toLowerCase() };
  if (typeof data.name === "string" && data.name.trim()) user.name = data.name.trim();
  const age = typeof data.age === "string" || typeof data.age === "number"
    ? String(data.age).trim() : "";
  if (age && Number.isInteger(Number(age)) && Number(age) >= 1 && Number(age) <= 120) {
    user.age = age;
  }
  const gender = typeof data.gender === "string" ? data.gender.trim().toLowerCase() : "";
  if (["male", "female", "other"].includes(gender)) user.gender = gender;
  return user;
}

export function readAccountProfile(email: string): AuthUser | null {
  if (typeof window === "undefined") return null;
  const normalizedEmail = email.trim().toLowerCase();
  try {
    const profile = normalizeUser(JSON.parse(
      window.localStorage.getItem(PROFILE_STORAGE_PREFIX + normalizedEmail) ?? "null",
    ));
    return profile?.email === normalizedEmail ? profile : null;
  } catch {
    return null;
  }
}

function saveAccountProfile(user: AuthUser) {
  // Profile persistence is separate from authentication; it cannot sign a user in.
  const profile = { ...readAccountProfile(user.email), ...user };
  try {
    window.localStorage.setItem(PROFILE_STORAGE_PREFIX + user.email, JSON.stringify(profile));
  } catch {
    // Keep the current session usable when persistent storage is unavailable.
  }
}

export function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  for (const storage of [window.localStorage, window.sessionStorage]) {
    try {
      const user = normalizeUser(JSON.parse(storage.getItem(AUTH_STORAGE_KEY) ?? "null"));
      if (user) return { ...readAccountProfile(user.email), ...user };
    } catch {
      // A malformed storage entry must not hide a valid session in the other store.
    }
  }
  return null;
}

function clearBookingPersonalDetails() {
  updateBookingIntent({ leadEmail: undefined, leadPhone: undefined, travellerDetails: undefined });
}

export function persistUser(user: AuthUser, remember: boolean) {
  const previous = readStoredUser();
  if (previous) saveAccountProfile(previous);
  const normalized = normalizeUser(user);
  if (!normalized) return;
  if (previous?.email !== normalized.email) clearBookingPersonalDetails();
  const nextUser = { ...readAccountProfile(normalized.email), ...normalized };
  saveAccountProfile(nextUser);
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
  (remember ? window.localStorage : window.sessionStorage).setItem(
    AUTH_STORAGE_KEY, JSON.stringify(nextUser),
  );
}

export function clearStoredUser() {
  const previous = readStoredUser();
  if (previous) saveAccountProfile(previous);
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
  clearBookingPersonalDetails();
}
