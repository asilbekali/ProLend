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
// sign in) and, on success, redirects to the Studio carrying a one-time
// handoff code. No token is ever exposed here — see lib/session.ts.
// "community" = lightweight, one-shot name/email signup, no login concept
// (the "Join Community" CTAs). Still posts to the existing /api/waitlist
// endpoint — only the user-facing framing changed.
export type JoinModalKind = "register" | "community";
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
      "Create your TH-Labs account — name, email and a password (8+ characters). We'll take you straight into the app.",
    submitLabel: "Create account",
  },
  login: {
    eyebrow: "Welcome Back",
    title: "Log In",
    description:
      "Log in to your TH-Labs account with your email and password to pick up where you left off.",
    submitLabel: "Log in",
  },
};

const COMMUNITY_COPY = {
  eyebrow: "Community",
  title: "Join the Community",
  description:
    "Get early access to TH-Labs, plus build updates and language drops as they ship. Drop your name and email — one spot per person.",
  submitLabel: "Join Community",
  successTitle: "Welcome in",
  successBody:
    "You're part of the TH-Labs community. We'll email you as soon as your access opens up.",
};

// Shown instead of the normal success message when the backend reports this
// email is already a member (JoinWaitlistResponse.alreadyExists).
const ALREADY_A_MEMBER = {
  title: "You're Already In",
  body: "This email is already part of the community — no need to sign up twice.",
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
      : "bg-text hover:bg-text/90 text-bg";

  const [mode, setMode] = useState<AuthMode>("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const registerMutation = useRegisterMutation();
  const loginMutation = useLoginMutation();
  const googleMutation = useGoogleAuthMutation();
  const communityMutation = useJoinWaitlistMutation();

  const authMutation = mode === "register" ? registerMutation : loginMutation;
  const activeMutation = isAuth ? authMutation : communityMutation;

  // Google handles register-or-login in one shot; hand its result to the same
  // handoff redirect the manual form uses.
  function handleGoogleCredential(credential: string) {
    setValidationError("");
    googleMutation.mutate(credential, { onSuccess: completeAuthAndRedirect });
  }

  const copy = isAuth ? AUTH_COPY[mode] : COMMUNITY_COPY;

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
      // On success, redirect to the Studio carrying a one-time handoff code.
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

    // Community flavor: name + email only.
    if (!name.trim()) {
      setValidationError("Enter your name.");
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setValidationError("Enter a valid email.");
      return;
    }
    setValidationError("");
    communityMutation.mutate({ name: name.trim(), email: email.trim() });
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
  const communitySucceeded = !isAuth && communityMutation.isSuccess;
  const errorMessage =
    validationError ||
    activeMutation.error?.message ||
    (isAuth ? googleMutation.error?.message : undefined);

  // Community-only: backend says this email already had a spot.
  const alreadyAMember =
    !isAuth && communityMutation.data?.alreadyExists === true;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="join-modal-title"
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.97 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`relative z-10 w-full max-w-md rounded-3xl border border-line bg-bg p-8 text-foreground shadow-[0_40px_100px_-30px_rgba(11,11,12,0.35)] ${newsreader.className}`}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-text"
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
            <Check className={`h-6 w-6 ${accent === "purple" ? "text-white" : "text-bg"}`} />
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
            Taking you to TH-Labs…
          </p>
        </div>
      ) : communitySucceeded ? (
        <div className="flex flex-col items-center py-6 text-center">
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={`mb-5 flex h-14 w-14 items-center justify-center rounded-full ${
              alreadyAMember ? "bg-surface-2" : accentClasses
            }`}
          >
            {alreadyAMember ? (
              <UserCheck className="h-6 w-6 text-foreground" />
            ) : (
              <Check
                className={`h-6 w-6 ${accent === "purple" ? "text-white" : "text-bg"}`}
              />
            )}
          </motion.div>
          <h2
            className={`${pressStart2P.className} uppercase text-foreground`}
            style={{ fontSize: "clamp(16px, 3vw, 20px)" }}
          >
            {alreadyAMember ? ALREADY_A_MEMBER.title : COMMUNITY_COPY.successTitle}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {alreadyAMember ? ALREADY_A_MEMBER.body : COMMUNITY_COPY.successBody}
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

          {/* Mode first, so "Register" vs "Login" is chosen before either the
              Google route or the email form is offered. Google itself handles
              both cases in one click — first sign-in creates the account, every
              one after logs in. */}
          {isAuth && (
            <div className="mt-6 flex rounded-full border border-line bg-surface p-1">
              {(["register", "login"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => switchMode(m)}
                  className={`h-9 flex-1 rounded-full text-sm font-medium transition-colors ${
                    mode === m
                      ? "bg-bg text-text shadow-sm"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {m === "register" ? "Register" : "Login"}
                </button>
              ))}
            </div>
          )}

          {isAuth && (
            <>
              <div className="mt-5">
                <GoogleSignInButton
                  onCredential={handleGoogleCredential}
                  disabled={isPending}
                />
              </div>
              <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-line" />
                <span className="text-xs uppercase tracking-[0.2em] text-muted">
                  or
                </span>
                <span className="h-px flex-1 bg-line" />
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {(!isAuth || mode === "register") && (
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 rounded-full border border-line bg-bg px-5 text-sm text-foreground placeholder:text-text-3 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
              />
            )}
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-full border border-line bg-bg px-5 text-sm text-foreground placeholder:text-text-3 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
            />
            {isAuth && (
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "register" ? "new-password" : "current-password"}
                className="h-12 rounded-full border border-line bg-bg px-5 text-sm text-foreground placeholder:text-text-3 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
              />
            )}
            {errorMessage && (
              <span className="px-1 text-xs text-live">{errorMessage}</span>
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
            className="absolute inset-0 bg-text/25 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <JoinModalCard kind={kind} accent={accent} onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
