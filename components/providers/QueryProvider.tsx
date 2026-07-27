"use client";

// FILE MISSION: bootstraps TanStack Query for the whole app. Every hook in
// lib/queries/ needs a QueryClientProvider above it in the tree, so this
// component creates one QueryClient (once, via useState so it survives
// re-renders) and is mounted around {children} in app/layout.tsx.

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 60_000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
