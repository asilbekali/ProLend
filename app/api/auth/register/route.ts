// POST /api/auth/register — thin proxy to the TH-LABS backend
// POST /v1/users/create-user. Takes { name, email, password }, forwards it, and
// returns { user, code, expiresIn } — a one-time handoff code, NOT the token
// pair. See lib/handoff.ts for why. Contract mirrors
// lib/queries/useRegisterMutation.ts.

import { backendFetch } from "@/lib/backend";
import { mintHandoff, type BackendAuthResponse } from "@/lib/handoff";

export async function POST(request: Request) {
  let body: { name?: string; email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }

  const result = await backendFetch<BackendAuthResponse>("/users/create-user", {
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

  // The tokens stop here. Only the code continues to the browser.
  const handoff = await mintHandoff(result.data);
  if (!handoff.ok) {
    return Response.json({ message: handoff.message }, { status: handoff.status });
  }
  return Response.json(handoff.data, { status: 201 });
}
