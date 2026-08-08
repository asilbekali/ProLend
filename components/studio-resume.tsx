"use client";

// FILE MISSION: hand a returning Studio user a fresh handoff code without
// making them sign in again.
//
// The Studio lives on *.modal.run and holds its session through the account
// API's refresh cookie. From that origin the cookie is third-party — Safari
// blocks those outright and Chrome is winding them down — so the Studio can
// find itself unable to refresh even though the user is perfectly signed in.
//
// When that happens it sends them here with ?studio=1. This origin IS
// first-party to that cookie, so a plain same-origin call to /v1/auth/refresh
// still works. If it does, we mint a new code and bounce straight back, and
// the user sees a flicker rather than a login form.
//
// If it fails they really are signed out: we strip the param and let the
// normal landing page render so they can sign in. The Studio sets a one-shot
// flag before sending anyone here, so a failure cannot ping-pong them.

import { useEffect, useState } from "react";
import { studioUrlWithCode } from "@/lib/session";

// Same-origin: Caddy proxies /v1/* to the account API on this host, which is
// the whole point — the refresh cookie is scoped to /v1/auth on this domain
// and rides along automatically.
const ACCOUNT_API = "/v1";

async function resume(): Promise<string | null> {
  try {
    // The cookie is the credential; no Authorization header exists to send.
    const refreshed = await fetch(`${ACCOUNT_API}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!refreshed.ok) return null;

    const { accessToken } = (await refreshed.json()) as { accessToken?: string };
    if (!accessToken) return null;

    const minted = await fetch(`${ACCOUNT_API}/auth/handoff`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!minted.ok) return null;

    const { code } = (await minted.json()) as { code?: string };
    return code ?? null;
  } catch {
    return null; // network — treat as signed out
  }
}

export default function StudioResume() {
  const [attempting, setAttempting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("studio") !== "1") return;

    setAttempting(true);

    // Drop ?studio=1 immediately so a reload, or a failure below, does not
    // re-enter this path.
    params.delete("studio");
    const query = params.toString();
    window.history.replaceState(
      {},
      "",
      window.location.pathname + (query ? `?${query}` : "") + window.location.hash
    );

    let cancelled = false;
    resume().then((code) => {
      if (cancelled) return;
      if (code) {
        window.location.replace(studioUrlWithCode(code));
        return; // page is unloading; leave the overlay up
      }
      // Signed out — reveal the landing page so they can sign in.
      setAttempting(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!attempting) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="z-overlay fixed inset-0 flex flex-col items-center justify-center gap-4 bg-bg"
    >
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-accent" />
      <p className="font-mono text-sm text-text-2">Returning you to the Studio…</p>
    </div>
  );
}
