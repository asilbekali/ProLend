"use client";

// FILE MISSION: "Register" — create a new TH-LABS account with name + email +
// password. Backs the "Register" tab of JoinModal's register/login flavor.
//
// Talks to: POST /api/auth/register  (proxies the backend
// POST /v1/users/create-user)
//
// Request body:
//   { name: string; email: string; password: string }
//
// Response (same shape login returns — see useLoginMutation.ts):
//   { accessToken, refreshToken, user }

import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { AuthResponse } from "@/lib/queries/useLoginMutation";

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) =>
      apiFetch<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  });
}
