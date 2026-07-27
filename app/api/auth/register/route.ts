// POST /api/auth/register — thin proxy to the TH-LABS backend
// POST /v1/users/create-user. Takes { name, email, password }, forwards it, and
// returns the backend's { accessToken, refreshToken, user } on success so the
// landing page can hand the tokens to the main app. Contract mirrors
// lib/queries/useRegisterMutation.ts.

import { backendFetch } from "@/lib/backend";
import type { AuthResponse } from "@/lib/queries/useLoginMutation";

export async function POST(request: Request) {
  let body: { name?: string; email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }

  const result = await backendFetch<AuthResponse>("/users/create-user", {
    method: "POST",
    body: JSON.stringify({
      name: (body.name ?? "").trim(),
      email: (body.email ?? "").trim(),
      password: body.password ?? "",
    }),
  });

  if (!result.ok) {
    return Response.json({ message: result.message }, { status: result.status });
  }
  return Response.json(result.data, { status: result.status });
}
