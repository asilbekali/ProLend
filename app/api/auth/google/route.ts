// POST /api/auth/google — "Continue with Google" bridge.
//
// The browser sends the Google ID token (`credential`) from Google Identity
// Services. We verify it with Google, then bridge to the SAME backend the manual
// form uses (create-user / login) so Google users end up with a real backend
// { accessToken, refreshToken, user } — no backend Google endpoint required.
//
// How the "no password from the user" part works: Google accounts have no
// password here, so we derive a deterministic one server-side from the Google
// account id (`sub`) + GOOGLE_AUTH_SECRET. It never leaves the server, and it's
// the same every time, so the same Google account can both register (first time)
// and log in (every time after) against the password-based backend.
//
// GOOGLE_AUTH_SECRET is therefore a password-equivalent for every Google user
// on the platform, and the ONLY secret in that derivation — `sub` is public,
// it ships inside any ID token Google mints for the account. This used to fall
// back to the literal "th-labs-google" when the variable was unset, which meant
// anyone reading this repository could compute a given user's backend password
// and log in as them through /v1/auth/login. It now fails closed instead; see
// derivePassword.
//
// ── MIGRATION, if this ever ran in production with GOOGLE_AUTH_SECRET unset ──
// Accounts created back then hold a password derived from "th-labs-google".
// Setting a real secret changes what derivePassword returns, so those users
// stop matching their stored hash: the login below fails, create-user fails on
// the duplicate email, and they land on the 409 "already registered with a
// password" message — locked out of an account they never set a password for.
//
// There is no self-service path out of that today, so before rotating, check
// whether any such accounts exist and reset them deliberately (an admin
// password reset, or deleting the row so the next sign-in re-registers).
// Leaving the secret unset is not the safer option — it is the vulnerability.
//
// If this backend later grows a native Google endpoint, swap the two
// backendFetch calls below for a single call to it — that removes the derived
// password entirely, which is strictly better than keeping a secret this load-
// bearing.

import { createHmac } from "crypto";
import { backendFetch, jsonWithCookies } from "@/lib/backend";
import { mintHandoff, type BackendAuthResponse } from "@/lib/handoff";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
const AUTH_SECRET = process.env.GOOGLE_AUTH_SECRET ?? "";

type GoogleTokenInfo = {
  aud: string;
  sub: string;
  email: string;
  email_verified: string; // "true" | "false" (string from tokeninfo)
  name?: string;
  given_name?: string;
};

// Verify the Google ID token with Google and return its payload, or null.
async function verifyGoogleToken(credential: string): Promise<GoogleTokenInfo | null> {
  let res: Response;
  try {
    res = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`,
      { cache: "no-store" }
    );
  } catch {
    return null;
  }
  if (!res.ok) return null;
  const info = (await res.json().catch(() => null)) as GoogleTokenInfo | null;
  if (!info) return null;
  // The token must have been minted for OUR client and have a verified email.
  if (CLIENT_ID && info.aud !== CLIENT_ID) return null;
  if (info.email_verified !== "true" && (info.email_verified as unknown) !== true) return null;
  if (!info.email || !info.sub) return null;
  return info;
}

// Stable per-Google-account backend password. Server-only, never returned.
// No fallback secret on purpose — a default here is a published password for
// every Google account on the platform. Callers must check AUTH_SECRET first.
function derivePassword(sub: string): string {
  return createHmac("sha256", AUTH_SECRET).update(`google:${sub}`).digest("hex");
}

export async function POST(request: Request) {
  // Fail closed rather than silently deriving passwords from a known constant.
  // Sign-in being unavailable is a visible, fixable outage; a guessable
  // password for every Google user is neither.
  if (!CLIENT_ID || !AUTH_SECRET) {
    return Response.json(
      { message: "Google sign-in is not configured." },
      { status: 501 }
    );
  }

  let body: { credential?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }

  if (!body.credential) {
    return Response.json({ message: "Missing Google credential." }, { status: 400 });
  }

  const info = await verifyGoogleToken(body.credential);
  if (!info) {
    return Response.json({ message: "Could not verify your Google account." }, { status: 401 });
  }

  const email = info.email.trim().toLowerCase();
  const name = (info.name || info.given_name || email.split("@")[0]).trim();
  const password = derivePassword(info.sub);

  // Returning Google user: log in first (one call for the common case).
  const login = await backendFetch<BackendAuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (login.ok) {
    const handoff = await mintHandoff(login.data);
    if (!handoff.ok) {
      return Response.json({ message: handoff.message }, { status: handoff.status });
    }
    return jsonWithCookies(handoff.data, 200, login.setCookie);
  }

  // First time with Google: create the account, which also returns tokens.
  const created = await backendFetch<BackendAuthResponse>("/users/create-user", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  if (created.ok) {
    const handoff = await mintHandoff(created.data);
    if (!handoff.ok) {
      return Response.json({ message: handoff.message }, { status: handoff.status });
    }
    return jsonWithCookies(handoff.data, 201, created.setCookie);
  }

  // Both failed — most likely this email was registered manually with a
  // different password, so the derived Google password can't unlock it.
  return Response.json(
    {
      message:
        "This email is already registered with a password. Please log in with your email and password.",
    },
    { status: 409 }
  );
}
