import { useSyncExternalStore } from "react";

/** Reads a media query without the cascading-render pattern of setState-in-effect. SSR-safe (defaults to `false` on the server). */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}
