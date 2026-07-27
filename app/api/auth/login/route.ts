// POST /api/auth/login — thin proxy to the TH-LABS backend
// POST /v1/auth/login. Takes { email, password }, forwards it, and returns the
// backend's { accessToken, refreshToken, user } on success. Contract mirrors
// lib/queries/useLoginMutation.ts.

import { backendFetch } from "@/lib/backend";
import type { AuthResponse } from "@/lib/queries/useLoginMutation";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }

  const result = await backendFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: (body.email ?? "").trim(),
      password: body.password ?? "",
    }),
  });

  if (!result.ok) {
    return Response.json({ message: result.message }, { status: result.status });
  }
  return Response.json(result.data, { status: result.status });
}
