"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2, UserCheck, X } from "lucide-react";
import { Press_Start_2P, Newsreader } from "next/font/google";
import { useJoinWaitlistMutation } from "@/lib/queries/useJoinWaitlistMutation";
import { useRegisterMutation } from "@/lib/queries/useRegisterMutation";
import { useLoginMutation } from "@/lib/queries/useLoginMutation";
import { useGoogleAuthMutation } from "@/lib/queries/useGoogleAuthMutation";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { completeAuthAndRedirect } from "@/lib/session";

const GOOGLE_ENABLED = !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

const pressStart2P = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pixel",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-newsreader",
});

// "register" = full account auth against the backend. The card shows a
// Register / Login toggle (name+email+password to create, email+password to
// sign in) and, on success, hands the access token to the main app.
// "waitlist" = lightweight, one-shot name/email signup, no login concept
// (the Hero "Join Waitlist" CTA — backed by a stub until its API ships).
export type JoinModalKind = "register" | "waitlist";
export type JoinModalAccent = "white" | "purple";

type AuthMode = "register" | "login";

const AUTH_COPY: Record<
  AuthMode,
  { eyebrow: string; title: string; description: string; submitLabel: string }
> = {
  register: {
    eyebrow: "Get Started",
    title: "Create Account",
    description:
      "Create your TH-LABS account — name, email and a password (8+ characters). We'll take you straight into the app.",
    submitLabel: "Create account",
  },
  login: {
    eyebrow: "Welcome Back",
    title: "Log In",
    description:
      "Log in to your TH-LABS account with your email and password to pick up where you left off.",
    submitLabel: "Log in",
  },
};

const WAITLIST_COPY = {
  eyebrow: "Early Access",
  title: "Join the Waitlist",
  description:
    "Be first in line for TH-LABS. Drop your name and email — one spot per person, we'll reach out when yours opens.",
  submitLabel: "Join Waitlist",
  successTitle: "You're on the list",
  successBody:
    "Thanks for joining early. We'll email you as soon as your spot is ready.",
};

// Shown instead of the normal waitlist success message when the backend
// reports this email already has a spot (JoinWaitlistResponse.alreadyExists).
const ALREADY_ON_WAITLIST = {
  title: "You're Already In",
  body: "This email already has a spot on the waitlist — no need to sign up twice.",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function JoinModalCard({
  kind,
  accent,
  onClose,
}: {
  kind: JoinModalKind;
  accent: JoinModalAccent;
  onClose: () => void;
}) {
  const isAuth = kind === "register";
  const accentClasses =
    accent === "purple"
      ? "bg-accent hover:bg-accent-strong text-white"
      : "bg-white hover:bg-white/90 text-black";

  const [mode, setMode] = useState<AuthMode>("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const registerMutation = useRegisterMutation();
  const loginMutation = useLoginMutation();
  const googleMutation = useGoogleAuthMutation();
  const waitlistMutation = useJoinWaitlistMutation();

  const authMutation = mode === "register" ? registerMutation : loginMutation;
  const activeMutation = isAuth ? authMutation : waitlistMutation;

  // Google handles register-or-login in one shot; hand its result to the same
  // token redirect the manual form uses.
  function handleGoogleCredential(credential: string) {
    setValidationError("");
    googleMutation.mutate(credential, { onSuccess: completeAuthAndRedirect });
  }

  const copy = isAuth ? AUTH_COPY[mode] : WAITLIST_COPY;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (isAuth) {
      if (mode === "register" && name.trim().length < 2) {
        setValidationError("Enter your name (at least 2 characters).");
        return;
      }
      if (!EMAIL_RE.test(email)) {
        setValidationError("Enter a valid email.");
        return;
      }
      if (password.length < 8) {
        setValidationError("Password must be at least 8 characters.");
        return;
      }
      setValidationError("");
      // On success, hand the tokens to the main app and redirect there.
      if (mode === "register") {
        registerMutation.mutate(
          { name: name.trim(), email: email.trim(), password },
          { onSuccess: completeAuthAndRedirect }
        );
      } else {
        loginMutation.mutate(
          { email: email.trim(), password },
          { onSuccess: completeAuthAndRedirect }
        );
      }
      return;
    }

    // Waitlist flavor: name + email only.
    if (!name.trim()) {
      setValidationError("Enter your name.");
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setValidationError("Enter a valid email.");
      return;
    }
    setValidationError("");
    waitlistMutation.mutate({ name: name.trim(), email: email.trim() });
  }

  function switchMode(next: AuthMode) {
    setMode(next);
    setValidationError("");
    registerMutation.reset();
    loginMutation.reset();
    googleMutation.reset();
  }

  const isPending =
    activeMutation.isPending || (isAuth && googleMutation.isPending);
  // Auth success navigates away — keep the card in a "redirecting" state so the
  // form doesn't flash back before the browser leaves.
  const authSucceeded =
    isAuth && (authMutation.isSuccess || googleMutation.isSuccess);
  const waitlistSucceeded = !isAuth && waitlistMutation.isSuccess;
  const errorMessage =
    validationError ||
    activeMutation.error?.message ||
    (isAuth ? googleMutation.error?.message : undefined);

  // Waitlist-only: backend says this email already had a spot.
  const alreadyOnWaitlist =
    !isAuth && waitlistMutation.data?.alreadyExists === true;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="join-modal-title"
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.97 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`relative z-10 w-full max-w-md rounded-3xl border border-border bg-surface p-8 text-foreground shadow-2xl ${newsreader.className}`}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-white/10 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>

      {authSucceeded ? (
        // Brief handoff state while window.location redirects to the main app.
        <div className="flex flex-col items-center py-10 text-center">
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={`mb-5 flex h-14 w-14 items-center justify-center rounded-full ${accentClasses}`}
          >
            <Check className={`h-6 w-6 ${accent === "purple" ? "text-white" : "text-black"}`} />
          </motion.div>
          <h2
            className={`${pressStart2P.className} uppercase text-foreground`}
            style={{ fontSize: "clamp(16px, 3vw, 20px)" }}
          >
            {googleMutation.isSuccess
              ? "You're In"
              : mode === "register"
                ? "Account Ready"
                : "Logged In"}
          </h2>
          <p className="mt-3 flex items-center gap-2 text-sm leading-relaxed text-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            Taking you to TH-LABS…
          </p>
        </div>
      ) : waitlistSucceeded ? (
        <div className="flex flex-col items-center py-6 text-center">
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={`mb-5 flex h-14 w-14 items-center justify-center rounded-full ${
              alreadyOnWaitlist ? "bg-white/10" : accentClasses
            }`}
          >
            {alreadyOnWaitlist ? (
              <UserCheck className="h-6 w-6 text-foreground" />
            ) : (
              <Check
                className={`h-6 w-6 ${accent === "purple" ? "text-white" : "text-black"}`}
              />
            )}
          </motion.div>
          <h2
            className={`${pressStart2P.className} uppercase text-foreground`}
            style={{ fontSize: "clamp(16px, 3vw, 20px)" }}
          >
            {alreadyOnWaitlist ? ALREADY_ON_WAITLIST.title : WAITLIST_COPY.successTitle}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {alreadyOnWaitlist ? ALREADY_ON_WAITLIST.body : WAITLIST_COPY.successBody}
          </p>
          <button
            type="button"
            onClick={onClose}
            className={`mt-6 flex h-11 items-center justify-center rounded-full px-8 text-sm font-medium ${accentClasses}`}
          >
            Done
          </button>
        </div>
      ) : (
        <>
          <span className="text-xs uppercase tracking-[0.3em] text-muted">
            {copy.eyebrow}
          </span>
          <h2
            id="join-modal-title"
            className={`${pressStart2P.className} mt-3 text-balance uppercase leading-relaxed text-foreground`}
            style={{ fontSize: "clamp(16px, 3vw, 20px)" }}
          >
            {copy.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {copy.description}
          </p>

          {isAuth && GOOGLE_ENABLED && (
            <>
              <div className="mt-6">
                <GoogleSignInButton
                  onCredential={handleGoogleCredential}
                  disabled={isPending}
                />
              </div>
              <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-white/10" />
                <span className="text-xs uppercase tracking-[0.2em] text-muted">
                  or
                </span>
                <span className="h-px flex-1 bg-white/10" />
              </div>
            </>
          )}

          {isAuth && (
            <div className="mt-6 flex rounded-full border border-white/10 bg-white/5 p-1">
              {(["register", "login"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => switchMode(m)}
                  className={`h-9 flex-1 rounded-full text-sm font-medium transition-colors ${
                    mode === m
                      ? "bg-white text-black"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {m === "register" ? "Register" : "Login"}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
            {(!isAuth || mode === "register") && (
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 rounded-full border border-white/15 bg-transparent px-5 text-sm text-foreground placeholder:text-muted focus:border-white/40 focus:outline-none"
              />
            )}
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-full border border-white/15 bg-transparent px-5 text-sm text-foreground placeholder:text-muted focus:border-white/40 focus:outline-none"
            />
            {isAuth && (
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "register" ? "new-password" : "current-password"}
                className="h-12 rounded-full border border-white/15 bg-transparent px-5 text-sm text-foreground placeholder:text-muted focus:border-white/40 focus:outline-none"
              />
            )}
            {errorMessage && (
              <span className="px-1 text-xs text-red-400">{errorMessage}</span>
            )}
            <button
              type="submit"
              disabled={isPending}
              className={`mt-1 flex h-12 w-full items-center justify-center rounded-full text-sm font-medium transition-transform hover:-translate-y-0.5 disabled:opacity-60 ${accentClasses}`}
            >
              {isPending ? "Submitting…" : copy.submitLabel}
            </button>
          </form>
        </>
      )}
    </motion.div>
  );
}

export default function JoinModal({
  kind,
  accent = "white",
  open,
  onClose,
}: {
  kind: JoinModalKind;
  accent?: JoinModalAccent;
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <JoinModalCard kind={kind} accent={accent} onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
