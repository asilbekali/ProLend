// FILE MISSION: what happens right after a successful login/register on this
// landing page — the hand-off to the Studio.
//
// This landing page is only the doorway; the real product (the Studio) lives on
// Modal, at a different origin. Different origin means no shared cookie, so the
// session has to travel in the redirect itself.
//
// What travels is a one-time code, not the session:
//
//     1. The server-side route handler authenticates the user, keeps the token
//        pair, and swaps it for a single-use code (lib/handoff.ts).
//     2. The browser receives only { user, code, expiresIn }.
//     3. We redirect to  <studio>/?code=<code>.
//     4. The Studio redeems the code against POST /v1/auth/handoff/exchange
//        and gets the real tokens over a direct HTTPS POST, then strips the
//        code from its URL.
//
// The code is good for ~60 seconds and exactly one redemption, so the copy that
// inevitably ends up in browser history and in Modal's ingress log is already
// spent by the time anyone could read it.
//
// This replaces an earlier version that put `access_token` and `refresh_token`
// straight into the query string and mirrored them into localStorage. Both are
// gone: no token is ever exposed to client-side JavaScript on this origin, so
// there is nothing here for an XSS or a compromised third-party script (this
// page loads Google Identity Services and the Spline runtime) to steal.

import type { AuthHandoff } from "@/lib/queries/useLoginMutation";

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

// Build the Studio URL carrying the one-time code. The code is a credential for
// the next few seconds, so it is the ONLY thing added — no email, no user id.
// Anything else here would be permanently readable in history and logs without
// the code's saving grace of expiring.
export function studioUrlWithCode(code: string): string {
  const url = new URL(MAIN_APP_URL);
  url.searchParams.set("code", code);
  return url.toString();
}

export function buildHandoffUrl(handoff: AuthHandoff): string {
  return studioUrlWithCode(handoff.code);
}

// Send the user to the Studio carrying their one-time code.
export function completeAuthAndRedirect(handoff: AuthHandoff) {
  if (typeof window === "undefined") return;
  // `replace`, not `assign`: keeps the code-bearing URL out of the back stack,
  // so Back cannot return to it and re-fire a redemption.
  window.location.replace(buildHandoffUrl(handoff));
}
