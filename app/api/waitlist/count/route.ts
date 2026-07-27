// GET /api/waitlist/count — total registered users, for the Hero "+N supporters"
// counter. Proxies the backend GET /v1/users/all-users ({ usersCount }) and maps
// it to { count } for the client. The endpoint is public, so no token is needed;
// if BACKEND_SERVICE_TOKEN happens to be set we forward it anyway. Contract
// mirrors lib/queries/useEarlyUsersCount.ts.

import { backendFetch } from "@/lib/backend";

export async function GET() {
  const token = process.env.BACKEND_SERVICE_TOKEN;

  const result = await backendFetch<{ usersCount: number }>("/users/all-users", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!result.ok) {
    return Response.json({ message: result.message }, { status: result.status });
  }
  return Response.json({ count: result.data.usersCount });
}
