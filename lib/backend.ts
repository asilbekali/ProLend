// FILE MISSION: the single server-side gateway to the TH-LABS backend
// (PostgreSQL/Prisma API at BACKEND_API_URL). Every Next.js route handler that
// needs to talk to the backend goes through here so the base URL, JSON headers,
// and error normalization live in one place. This runs on the server only, so
// the browser never hits the raw backend host (no CORS to configure).

// `||` rather than `??` so a declared-but-empty value (easy to produce from an
// unset compose/CI variable) falls back instead of turning every request into
// a fetch against a bare path.
const BASE_URL = process.env.BACKEND_API_URL || "http://3.120.245.167/v1";

export type BackendResult<T> =
  | { ok: true; status: number; data: T; setCookie: string[] }
  | { ok: false; status: number; message: string };

// Turn the backend's error body into a single human string. NestJS validation
// errors come back as { message: string[] }, plain errors as { message: string }.
function extractMessage(body: unknown, status: number): string {
  if (body && typeof body === "object" && "message" in body) {
    const m = (body as { message: unknown }).message;
    if (Array.isArray(m)) return m.join(", ");
    if (typeof m === "string") return m;
  }
  return `Request failed (${status})`;
}

export async function backendFetch<T>(
  path: string,
  init?: RequestInit
): Promise<BackendResult<T>> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
      cache: "no-store",
    });
  } catch (err) {
    // Network / DNS / timeout — backend unreachable.
    console.error(`[backend] ${path} unreachable`, err);
    return { ok: false, status: 502, message: "Backend is unreachable." };
  }

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    return { ok: false, status: res.status, message: extractMessage(body, res.status) };
  }

  return { ok: true, status: res.status, data: body as T, setCookie: readSetCookie(res) };
}

// Pull the backend's Set-Cookie header(s) out so a route handler can pass them
// on to the browser.
//
// Why this has to be forwarded: the backend issues the refresh token as an
// httpOnly cookie, and this fetch happens SERVER-side — so without forwarding,
// the cookie is set on a response only Node ever sees and the user's browser
// ends up with no session on this origin at all. That is fine for the handoff
// itself (the Studio gets its own cookie when it redeems the code) but it is
// what makes a silent resume possible later: the Studio cannot refresh a
// third-party cookie in Safari, and bounces here to be handed a fresh code.
// This origin is first-party to that cookie, so it can still see the session.
//
// getSetCookie() is the correct accessor — Headers.get('set-cookie') folds
// multiple cookies into one comma-joined string, which is unparseable because
// cookie Expires values contain commas.
function readSetCookie(res: Response): string[] {
  const headers = res.headers as Headers & { getSetCookie?: () => string[] };
  if (typeof headers.getSetCookie === "function") return headers.getSetCookie();
  const single = res.headers.get("set-cookie");
  return single ? [single] : [];
}

/**
 * JSON response that also carries the backend's Set-Cookie header(s).
 *
 * Built from a standalone Headers object rather than `Response.json(...)` plus
 * `headers.append(...)`. A Headers instance attached to a Response carries the
 * "response" guard, and Set-Cookie is a forbidden response-header name under
 * that guard — appending it there is silently ignored, so the cookie would
 * never reach the browser and the failure would look like the backend simply
 * not issuing one. A Headers created on its own is unguarded, and the values
 * survive being handed to the constructor.
 */
export function jsonWithCookies(
  data: unknown,
  status: number,
  setCookie: string[]
): Response {
  const headers = new Headers({ "Content-Type": "application/json" });
  for (const cookie of setCookie) headers.append("set-cookie", cookie);
  return new Response(JSON.stringify(data), { status, headers });
}
