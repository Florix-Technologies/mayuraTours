export const AUTH_STORAGE_KEY = "mayura-auth-session";

export type AuthUser = {
  email: string;
};

export function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw =
      window.localStorage.getItem(AUTH_STORAGE_KEY) ??
      window.sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (!parsed?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function persistUser(user: AuthUser, remember: boolean) {
  const raw = JSON.stringify(user);
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
  (remember ? window.localStorage : window.sessionStorage).setItem(
    AUTH_STORAGE_KEY,
    raw,
  );
}

export function clearStoredUser() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
}
