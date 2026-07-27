"use client";

// Renders the official "Continue with Google" button via Google Identity
// Services and hands the resulting ID token (credential) back to the parent.
// The parent exchanges that credential for a backend session
// (see useGoogleAuthMutation / /api/auth/google).
//
// Requires NEXT_PUBLIC_GOOGLE_CLIENT_ID and this origin registered under the
// client's "Authorized JavaScript origins" in Google Cloud Console. If the
// client id is missing, the component renders nothing.

import { useEffect, useRef } from "react";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
const GSI_SRC = "https://accounts.google.com/gsi/client";

type CredentialResponse = { credential?: string };

// Minimal shape of the pieces of google.accounts.id we use.
type GoogleId = {
  initialize: (config: {
    client_id: string;
    callback: (res: CredentialResponse) => void;
  }) => void;
  renderButton: (
    parent: HTMLElement,
    options: Record<string, unknown>
  ) => void;
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

  useEffect(() => {
    if (!CLIENT_ID) return;
    let cancelled = false;

    loadGsiScript()
      .then(() => {
        const id = window.google?.accounts?.id;
        if (cancelled || !id || !containerRef.current) return;
        id.initialize({
          client_id: CLIENT_ID,
          callback: (res) => {
            if (res.credential) cbRef.current(res.credential);
          },
        });
        containerRef.current.innerHTML = "";
        id.renderButton(containerRef.current, {
          type: "standard",
          theme: "filled_black",
          size: "large",
          text: "continue_with",
          shape: "pill",
          logo_alignment: "center",
          width: 340,
        });
      })
      .catch(() => {
        // Script blocked / offline — the manual email+password form still works.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!CLIENT_ID) return null;

  return (
    <div
      className={`flex justify-center ${disabled ? "pointer-events-none opacity-60" : ""}`}
    >
      <div ref={containerRef} />
    </div>
  );
}
