// Shared fetch helper used by every hook in lib/queries/.
// All API routes are same-origin Next.js route handlers (app/api/**/route.ts),
// so this just centralizes JSON headers + turns non-2xx responses into a
// thrown Error, which is what TanStack Query needs to populate `error`.
// The backend routes don't exist yet — calls will fail with a 404 until
// they're added, which is expected while the API is still being built.

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `Request failed (${res.status})`);
  }

  return res.json() as Promise<T>;
}
