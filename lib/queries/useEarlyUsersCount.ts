"use client";

// FILE MISSION: "Get early users count" — powers the "+N supporters"
// counter in Hero with the REAL registered-user count.
//
// Talks to: GET /api/waitlist/count  (a Next.js route that proxies the backend
// GET /v1/users/all-users and maps { usersCount } -> { count }). We go through
// our own origin instead of hitting the backend directly to avoid CORS.
//
// Expected response:
//   { count: number }

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";

export type EarlyUsersCountResponse = {
  count: number;
};

export function useEarlyUsersCount() {
  return useQuery({
    queryKey: ["early-users-count"],
    queryFn: () => apiFetch<EarlyUsersCountResponse>("/api/waitlist/count"),
  });
}
