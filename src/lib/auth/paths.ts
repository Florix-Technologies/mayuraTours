export const AUTH_PAGE_PATHS = [
  "/login",
  "/signup",
  "/forgot-password",
  "/verify-email",
] as const;

export function isAuthPagePath(pathname: string) {
  return AUTH_PAGE_PATHS.includes(
    pathname as (typeof AUTH_PAGE_PATHS)[number],
  );
}

function isAuthDestination(path: string) {
  return AUTH_PAGE_PATHS.some(
    (authPath) => path === authPath || path.startsWith(`${authPath}?`),
  );
}

export function loginHref(next?: string | null) {
  if (!next || isAuthDestination(next)) {
    return "/login";
  }
  return `/login?next=${encodeURIComponent(next)}`;
}

export function signupHref(next?: string | null) {
  if (!next || isAuthDestination(next)) {
    return "/signup";
  }
  return `/signup?next=${encodeURIComponent(next)}`;
}

export function verifyEmailHref(email: string, next?: string | null) {
  const params = new URLSearchParams();
  const trimmed = email.trim();
  if (trimmed) params.set("email", trimmed);
  if (next && !isAuthDestination(next)) {
    params.set("next", next);
  }
  const query = params.toString();
  return query ? `/verify-email?${query}` : "/verify-email";
}

export function safeNextPath(next: string | null | undefined) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/account";
  }
  return next;
}
