// FILE MISSION: what happens right after a successful login/register on this
// landing page — the hand-off to the main app.
//
// This landing page is only the doorway; the real product lives elsewhere. Once
// the backend returns tokens, we (1) stash them in localStorage in case the main
// app ends up on the same origin, and (2) redirect to NEXT_PUBLIC_MAIN_APP_URL
// with the tokens as query params so a cross-origin main app can log the user
// straight back in ("relogin" with the access token).
//
// There is no main site yet, so NEXT_PUBLIC_MAIN_APP_URL is a placeholder — set
// it in .env to the real destination.

import type { AuthResponse } from "@/lib/queries/useLoginMutation";

// `||` rather than `??`: this is inlined by `next build`, and a build that runs
// with the variable declared-but-empty (an unset CI variable passed as a build
// arg) would leave "" here. `??` only guards null/undefined, so the empty
// string would survive and `new URL("")` in buildHandoffUrl would throw at the
// exact moment a user finishes signing up.
const MAIN_APP_URL =
  process.env.NEXT_PUBLIC_MAIN_APP_URL || "https://app.th-labs.io/session";

const STORAGE_KEY = "th-labs.auth";

export function persistSession(auth: AuthResponse) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  } catch {
    // Private mode / storage disabled — the query-param handoff still works.
  }
}

// Build the main-app URL with the tokens attached so the destination can pick
// the user up already authenticated.
export function buildHandoffUrl(auth: AuthResponse): string {
  const url = new URL(MAIN_APP_URL);
  url.searchParams.set("access_token", auth.accessToken);
  url.searchParams.set("refresh_token", auth.refreshToken);
  return url.toString();
}

// Persist the session, then send the user to the main app carrying their token.
export function completeAuthAndRedirect(auth: AuthResponse) {
  persistSession(auth);
  if (typeof window !== "undefined") {
    window.location.assign(buildHandoffUrl(auth));
  }
}
