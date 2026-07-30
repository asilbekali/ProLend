"use client";

import { useSyncExternalStore } from "react";

/**
 * SSR-safe media query hook. Reads via `useSyncExternalStore` (no
 * setState-in-effect) and returns `false` on the server, so decorative
 * desktop-only behavior never renders during SSR/hydration mismatch.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** True only on devices with a precise, hovering pointer (i.e. a real mouse). */
export function useIsDesktopPointer(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}
