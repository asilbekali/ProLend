// POST /api/presence — the landing page's visitor beat, for the admin panel's
// Agent City (see components/presence-beacon.tsx).
//
// Proxies the TH-Labs backend POST /v1/presence, which validates the body
// itself; this only refuses what is obviously not a beat, and answers 204
// whatever happens upstream. A visitor counter must never surface an error
// in someone's console on the marketing site.

import { after } from "next/server";
import { backendFetch } from "@/lib/backend";

// A beat is resent every 20s anyway, so a slow backend is given up on fast.
const PRESENCE_TIMEOUT_MS = 3000;

export async function POST(request: Request) {
  let body: { visitorId?: unknown; path?: unknown; pageview?: unknown };
  try {
    body = await request.json();
  } catch {
    return new Response(null, { status: 400 });
  }
  if (typeof body.visitorId !== "string" || typeof body.path !== "string") {
    return new Response(null, { status: 400 });
  }

  const beat = JSON.stringify({
    visitorId: body.visitorId,
    site: "landing",
    path: body.path,
    pageview: body.pageview === true,
  });

  // Answered at once; the beat goes upstream after the response. Awaiting it
  // here held every visitor's request ~10s whenever the backend was down
  // (the connect timeout), and a counter is never worth that wait.
  after(() =>
    backendFetch("/presence", {
      method: "POST",
      body: beat,
      signal: AbortSignal.timeout(PRESENCE_TIMEOUT_MS),
    }),
  );

  return new Response(null, { status: 204 });
}
