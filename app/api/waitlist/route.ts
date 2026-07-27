// POST /api/waitlist — lightweight name+email signup (Hero "Join Waitlist").
//
// Proxies the TH-LABS backend POST /v1/wait-list. The backend takes
// { userName, email } and returns the created row { id, name, email, ... } on
// 201, or 409 { message: "Email is already on the wait list" } if that email
// already has a spot. We map that onto the UI contract
// { id: string; alreadyExists: boolean } — treating the 409 as a *successful*
// "already on the list" outcome rather than an error, so the modal shows its
// friendly state instead of a red error. Contract mirrors
// lib/queries/useJoinWaitlistMutation.ts.

import { backendFetch } from "@/lib/backend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type WaitlistEntry = {
  id: number;
  name: string;
  email: string;
};

export async function POST(request: Request) {
  let body: { name?: string; email?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();

  if (name.length < 2) {
    return Response.json({ message: "Name is required." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return Response.json({ message: "A valid email is required." }, { status: 400 });
  }

  const result = await backendFetch<WaitlistEntry>("/wait-list", {
    method: "POST",
    body: JSON.stringify({ userName: name, email }),
  });

  if (result.ok) {
    return Response.json(
      { id: String(result.data.id), alreadyExists: false },
      { status: 201 }
    );
  }

  // Duplicate email isn't an error for us — surface it as "already on the list".
  if (result.status === 409) {
    return Response.json({ id: email, alreadyExists: true }, { status: 200 });
  }

  return Response.json({ message: result.message }, { status: result.status });
}
