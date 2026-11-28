"use client";

// Counts this visit for the admin panel's Agent City: one beat per page view,
// then one every 20s while the tab is visible, so the office screen can show
// how many people are on th-labs.uz right now. Anonymous — the id is a random
// value in localStorage, never tied to a person here.

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const BEAT_MS = 20_000;
const VISITOR_KEY = "th:visitor-id";

function visitorId(): string {
  try {
    const kept = window.localStorage.getItem(VISITOR_KEY);
    if (kept) return kept;
    const fresh = `v_${crypto.randomUUID().replace(/-/g, "")}`;
    window.localStorage.setItem(VISITOR_KEY, fresh);
    return fresh;
  } catch {
    return `v_${Math.random().toString(36).slice(2, 14)}`;
  }
}

function send(path: string, pageview: boolean) {
  void fetch("/api/presence", {
    method: "POST",
    keepalive: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ visitorId: visitorId(), path, pageview }),
  }).catch(() => {});
}

export default function PresenceBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    send(pathname, true);
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") send(pathname, false);
    }, BEAT_MS);
    return () => clearInterval(timer);
  }, [pathname]);

  return null;
}
