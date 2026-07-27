"use client";

// FILE MISSION: "Join Waitlist" — creates a waitlist lead from just a name
// + email, no auth, no login. This is the hook behind JoinModal's
// "waitlist" flavor (the Hero "Join Waitlist" CTA) — a lighter-weight,
// one-shot signup that's separate from the full register-or-login flow in
// useRegisterMutation.ts.
//
// Talks to: POST /api/waitlist  (not implemented yet on the backend)
//
// One email = one waitlist spot. The backend should look up the email
// first: if it's new, create the entry and return `alreadyExists: false`;
// if it's already on the list, DO NOT create a duplicate and DO NOT treat
// it as an error — respond 200 with `alreadyExists: true` instead. The
// UI uses that flag to show a friendly "you're already on the list"
// state instead of a generic success or error message.
//
// Request body:
//   { name: string; email: string }
//
// Expected response:
//   { id: string; alreadyExists: boolean }

import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";

export type JoinWaitlistPayload = {
  name: string;
  email: string;
};

export type JoinWaitlistResponse = {
  id: string;
  alreadyExists: boolean;
};

export function useJoinWaitlistMutation() {
  return useMutation({
    mutationFn: (payload: JoinWaitlistPayload) =>
      apiFetch<JoinWaitlistResponse>("/api/waitlist", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  });
}
