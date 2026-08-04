// FILE MISSION: turn a freshly-issued backend session into something safe to
// hand the browser. SERVER ONLY — never import this from a "use client" file.
//
// The landing page (aytingchi.uz) and the Studio (*.modal.run) are separate
// origins, so a cookie set here cannot be read there and the session has to
// travel through the redirect itself. It used to travel as the tokens:
//
//     modal.run/?access_token=eyJ...&refresh_token=eyJ...
//
// which put a 7-day refresh token — one that re-mints itself on every use, so
// effectively permanent — into browser history, the address bar, session
// restore, and the access log of every hop in between. Anyone who later read
// any of those owned the account.
//
// Now the route handlers keep the tokens server-side and swap them for a
// one-time code (POST /v1/auth/handoff). Only the code reaches the browser,
// and it is worthless ~60s later or the instant the Studio redeems it. The
// refresh token never exists in client-side JavaScript at all, which is also
// what retires the old localStorage copy.

import { backendFetch, type BackendResult } from "@/lib/backend";
import type { AuthUser } from "@/lib/queries/useLoginMutation";

/**
 * What the backend returns from login / create-user. Stays on the server.
 *
 * No refreshToken field: the account API issues the refresh token as an
 * httpOnly cookie rather than in the body. The route handlers forward that
 * Set-Cookie to the browser (see jsonWithCookies) so this origin keeps a
 * first-party session — which is what lets the Studio bounce back here for a
 * silent re-handoff when its own third-party cookie is blocked.
 */
export type BackendAuthResponse = {
  accessToken: string;
  user: AuthUser;
};

/** What the browser is allowed to see. Note the absence of any token. */
export type HandoffPayload = {
  user: AuthUser;
  code: string;
  expiresIn: number;
};

/**
 * Exchange a just-issued token pair for a single-use handoff code.
 *
 * Uses the access token as the bearer credential, so the backend mints the
 * code for exactly the user who just authenticated — this route never has to
 * assert an identity of its own.
 */
export async function mintHandoff(
  auth: BackendAuthResponse
): Promise<BackendResult<HandoffPayload>> {
  const result = await backendFetch<{ code: string; expiresIn: number }>(
    "/auth/handoff",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    }
  );

  if (!result.ok) return result;

  return {
    ok: true,
    status: 200,
    data: {
      user: auth.user,
      code: result.data.code,
      expiresIn: result.data.expiresIn,
    },
    // Passed through rather than hardcoded to []: minting a code sets no
    // cookie today, but if it ever does, dropping it here would be a silent
    // loss rather than a type error. The cookie the browser actually needs
    // comes from the login/create-user call the route makes first.
    setCookie: result.setCookie,
  };
}
