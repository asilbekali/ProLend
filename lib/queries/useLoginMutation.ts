"use client";

// FILE MISSION: "Log In" — authenticate an existing user by email + password.
// Backs the "Login" tab of JoinModal's register/login flavor.
//
// Talks to: POST /api/auth/login  (proxies the backend POST /v1/auth/login)
//
// Request body:
//   { email: string; password: string }
//
// Response (the shape login, register and google all return):
//   { user: { id, email, name, role, createdAt }, code, expiresIn }
//
// Note what is NOT in that response: the access and refresh tokens. They are
// issued to the route handler and stay there — the browser gets a single-use
// handoff code instead, which lib/session.ts turns into a redirect. See
// lib/handoff.ts for the reasoning.

import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";

export type AuthUser = {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
};

export type AuthHandoff = {
  user: AuthUser;
  /** Single-use, ~60s. Redeemed by the Studio, never stored by this origin. */
  code: string;
  expiresIn: number;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginPayload) =>
      apiFetch<AuthHandoff>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  });
}
