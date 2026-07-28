// FILE MISSION: what happens right after a successful login/register on this
// landing page — the hand-off to the main app.
//
// This landing page is only the doorway; the real product lives elsewhere. Once
// the backend returns tokens, we (1) stash them in localStorage in case the main
// app ends up on the same origin, and (2) redirect to NEXT_PUBLIC_MAIN_APP_URL
// with the tokens as query params so a cross-origin main app can log the user
// straight back in ("relogin" with the access token).
//
// The destination is the Studio, deployed on Modal. Note that the Studio has no
// authentication of its own yet, so it does not currently read the tokens this
// sends — a handed-off user lands on the Studio already, but as an anonymous
// visitor. Wiring the token up on that side is what turns this into a real
// single sign-on rather than a redirect.

import type { AuthResponse } from "@/lib/queries/useLoginMutation";

// `||` rather than `??`: this is inlined by `next build`, and a build that runs
// with the variable declared-but-empty (an unset CI variable passed as a build
// arg) would leave "" here. `??` only guards null/undefined, so the empty
// string would survive and `new URL("")` in buildHandoffUrl would throw at the
// exact moment a user finishes signing up.
// Defaults to the live Modal deployment rather than a placeholder, so a build
// that runs without the variable set still redirects somewhere real. Override
// via the repository variable when the Studio moves to its own domain.
const MAIN_APP_URL =
  process.env.NEXT_PUBLIC_MAIN_APP_URL ||
  "https://isoqovjorabek2--th-labs-dubbing-web.modal.run";

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
