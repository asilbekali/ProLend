"use client";

// Renders the official "Continue with Google" button via Google Identity
// Services and hands the resulting ID token (credential) back to the parent.
// The parent exchanges that credential for a backend session
// (see useGoogleAuthMutation / /api/auth/google).
//
// Requires NEXT_PUBLIC_GOOGLE_CLIENT_ID and this origin registered under the
// client's "Authorized JavaScript origins" in Google Cloud Console. If the
// client id is missing, the component renders nothing.

import { useEffect, useRef, useSyncExternalStore } from "react";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
const GSI_SRC = "https://accounts.google.com/gsi/client";

// Google only honours widths in this range; anything outside is ignored and the
// button falls back to its intrinsic size (which overflows narrow phones).
const MIN_W = 200;
const MAX_W = 400;

type CredentialResponse = { credential?: string };

// Minimal shape of the pieces of google.accounts.id we use.
type GoogleId = {
  initialize: (config: {
    client_id: string;
    callback: (res: CredentialResponse) => void;
  }) => void;
  renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
};

declare global {
  interface Window {
    google?: { accounts?: { id?: GoogleId } };
  }
}

function loadGsiScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) return resolve();
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${GSI_SRC}"]`
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject());
      return;
    }
    const script = document.createElement("script");
    script.src = GSI_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject();
    document.head.appendChild(script);
  });
}

/* The active theme lives on <html data-theme>, i.e. outside React. Read it as
   external state rather than mirroring it into component state from an effect. */
function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getTheme(): "light" | "dark" {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

const getServerTheme = (): "light" | "dark" => "light";

export default function GoogleSignInButton({
  onCredential,
  disabled,
}: {
  onCredential: (credential: string) => void;
  disabled?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Keep the latest callback without re-initializing on every render.
  const cbRef = useRef(onCredential);
  useEffect(() => {
    cbRef.current = onCredential;
  }, [onCredential]);

  // Google bakes the colour scheme into the rendered button, so it has to be
  // re-rendered whenever the site theme flips.
  const theme = useSyncExternalStore(subscribeTheme, getTheme, getServerTheme);

  useEffect(() => {
    if (!CLIENT_ID) return;
    let cancelled = false;

    const render = () => {
      const id = window.google?.accounts?.id;
      const host = containerRef.current;
      if (cancelled || !id || !host) return;

      id.initialize({
        client_id: CLIENT_ID,
        callback: (res) => {
          if (res.credential) cbRef.current(res.credential);
        },
      });

      // Match the button to the space it actually has. The old hard-coded 340px
      // overflowed the modal on small phones, pushing the dialog sideways.
      const available = host.parentElement?.clientWidth ?? host.clientWidth;
      const width = Math.round(
        Math.min(MAX_W, Math.max(MIN_W, available || MIN_W))
      );

      host.innerHTML = "";
      id.renderButton(host, {
        type: "standard",
        // filled_black on a dark page is an invisible slab; outline reads on
        // white, filled_black reads on the dark theme.
        theme: theme === "dark" ? "filled_black" : "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
        logo_alignment: "center",
        width,
      });
    };

    loadGsiScript()
      .then(render)
      .catch(() => {
        // Script blocked / offline — the manual email+password form still works.
      });

    // Re-fit if the dialog is resized (orientation change, desktop resize).
    const onResize = () => render();
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
    };
  }, [theme]);

  // Without a client id Google cannot show an account chooser at all. Render a
  // visibly-disabled branded button rather than nothing, so the control is
  // present in the UI and the reason it can't be used is stated instead of the
  // whole feature silently vanishing.
  if (!CLIENT_ID) {
    return (
      <div className="flex w-full flex-col items-center gap-2">
        <button
          type="button"
          disabled
          aria-describedby="google-unconfigured"
          className="inline-flex h-11 w-full cursor-not-allowed items-center justify-center gap-2.5 rounded-full border border-line bg-surface px-5 text-sm font-medium text-muted"
        >
          <GoogleGlyph className="h-4 w-4 opacity-50" />
          Continue with Google
        </button>
        <p id="google-unconfigured" className="text-center text-[11px] text-muted">
          Google sign-in needs <code className="font-mono">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code>.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`flex w-full justify-center ${
        disabled ? "pointer-events-none opacity-60" : ""
      }`}
    >
      <div ref={containerRef} className="max-w-full overflow-hidden" />
    </div>
  );
}

/** Google's four-colour G, for the fallback button. */
function GoogleGlyph({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.7-2.1 5-4.4 6.600v5.5h7.1c4.2-3.8 6.6-9.5 6.6-16.1Z"
      />
      <path
        fill="#34A853"
        d="M24 46c6 0 11-2 14.6-5.4l-7.1-5.5c-2 1.3-4.5 2.1-7.5 2.1-5.8 0-10.7-3.9-12.4-9.1H4.3v5.7C7.9 41 15.4 46 24 46Z"
      />
      <path
        fill="#FBBC05"
        d="M11.6 28.1c-.4-1.3-.7-2.7-.7-4.1s.3-2.8.7-4.1v-5.7H4.3A22 22 0 0 0 2 24c0 3.6.9 6.9 2.3 9.8l7.3-5.7Z"
      />
      <path
        fill="#EA4335"
        d="M24 10.8c3.3 0 6.2 1.1 8.5 3.3l6.3-6.3C35 4.3 30 2 24 2 15.4 2 7.9 7 4.3 14.2l7.3 5.7c1.7-5.2 6.6-9.1 12.4-9.1Z"
      />
    </svg>
  );
}
