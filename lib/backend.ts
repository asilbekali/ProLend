// FILE MISSION: the single server-side gateway to the TH-LABS backend
// (PostgreSQL/Prisma API at BACKEND_API_URL). Every Next.js route handler that
// needs to talk to the backend goes through here so the base URL, JSON headers,
// and error normalization live in one place. This runs on the server only, so
// the browser never hits the raw backend host (no CORS to configure).

const BASE_URL = process.env.BACKEND_API_URL ?? "http://3.120.245.167/v1";

export type BackendResult<T> =
  | { ok: true; status: number; data: T }
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

  return { ok: true, status: res.status, data: body as T };
}
