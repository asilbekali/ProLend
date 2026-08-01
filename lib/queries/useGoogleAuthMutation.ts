"use client";

// FILE MISSION: "Continue with Google" — exchanges a Google ID token
// (credential) for a backend session. Backs the Google button in JoinModal's
// register/login flavor; the same call handles both register (first time) and
// login (every time after).
//
// Talks to: POST /api/auth/google  (verifies the token, then bridges to the
// backend create-user / login endpoints)
//
// Request body:  { credential: string }   // Google Identity Services ID token
// Response:      { user, code, expiresIn }   // same shape as login

import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { AuthHandoff } from "@/lib/queries/useLoginMutation";

export function useGoogleAuthMutation() {
  return useMutation({
    mutationFn: (credential: string) =>
      apiFetch<AuthHandoff>("/api/auth/google", {
        method: "POST",
        body: JSON.stringify({ credential }),
      }),
  });
}
