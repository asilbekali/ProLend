"use client";

// FILE MISSION: "Log In" — authenticate an existing user by email + password.
// Backs the "Login" tab of JoinModal's register/login flavor.
//
// Talks to: POST /api/auth/login  (proxies the backend POST /v1/auth/login)
//
// Request body:
//   { email: string; password: string }
//
// Response (the shape both login and register return):
//   { accessToken, refreshToken, user: { id, email, name, role, createdAt } }

import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";

export type AuthUser = {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginPayload) =>
      apiFetch<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  });
}
