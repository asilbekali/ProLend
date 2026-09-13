"use client";

import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  TelegramIcon,
} from "./social-icons";
import Frame, { Inner } from "./frame";
import { useJoinWaitlistMutation } from "@/lib/queries/useJoinWaitlistMutation";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Where the community actually lives, alongside the email signup.
const CHANNELS = [
  {
    label: "Instagram",
    href: "https://instagram.com/th_labs.io",
    icon: <InstagramIcon className="h-3.5 w-3.5" />,
  },
  { label: "Telegram", href: "#", icon: <TelegramIcon className="h-3.5 w-3.5" /> },
  { label: "GitHub", href: "#", icon: <GithubIcon className="h-3.5 w-3.5" /> },
  { label: "LinkedIn", href: "#", icon: <LinkedinIcon className="h-3.5 w-3.5" /> },
];

export default function CtaBand() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const mutation = useJoinWaitlistMutation();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    if (cleanName.length < 2) {
      setError("Enter your name.");
      return;
    }
    if (!EMAIL_RE.test(cleanEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    setError(null);
    mutation.mutate({ name: cleanName, email: cleanEmail });
  };

  const done = mutation.isSuccess;
  const alreadyIn = mutation.data?.alreadyExists;

  return (
    <Frame as="section" bleed id="community" className="relative overflow-hidden border-b border-line">
      {/* The pastel wash from the hero, brought back as a bookend. */}
      <div
        aria-hidden="true"
        className="z-base field-mesh absolute inset-0"
      />
      <div
        aria-hidden="true"
        className="z-grid field-dots absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)]"
      />

      <Inner className="relative z-content">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto flex max-w-xl flex-col items-center py-16 text-center md:py-20"
        >
          <h2 className="text-[clamp(1.9rem,4.6vw,3.2rem)] font-medium leading-[1.06]">
            <span className="block text-balance text-text">Put your work in every language.</span>
            <span className="mt-1 block text-text-3">Join the community.</span>
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-text-2">
            Early access, build updates, and new language drops as they ship. No spam,
            ever.
          </p>

          {done ? (
            <p
              role="status"
              className="mt-8 inline-flex items-center gap-2 rounded-lg border border-line bg-bg px-5 py-3 text-sm text-text shadow-sm"
            >
              <Check className="h-4 w-4 text-accent" />
              {alreadyIn
                ? "You're already in — see you in there."
                : "You're in. We'll be in touch."}
            </p>
          ) : (
            <form
              onSubmit={onSubmit}
              noValidate
              className="mt-8 flex w-full max-w-md flex-col gap-3"
            >
              <div className="flex flex-col gap-3 text-left sm:flex-row">
                <div className="flex-1">
                  <label htmlFor="cta-name" className="sr-only">
                    Your name
                  </label>
                  <input
                    id="cta-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (error) setError(null);
                    }}
                    aria-invalid={!!error}
                    className="h-11 w-full rounded-lg border border-line bg-bg px-4 text-sm text-text shadow-sm outline-none placeholder:text-text-3 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/25"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="cta-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="cta-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@studio.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    aria-invalid={!!error}
                    aria-describedby={error ? "cta-email-error" : undefined}
                    className="h-11 w-full rounded-lg border border-line bg-bg px-4 text-sm text-text shadow-sm outline-none placeholder:text-text-3 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/25"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-accent px-7 text-sm font-medium text-white shadow-[0_8px_24px_-10px_rgba(109,40,217,0.8)] outline-none transition-colors hover:bg-accent-strong focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 disabled:opacity-60"
              >
                {mutation.isPending ? "Joining…" : "Join Community"}
              </button>
            </form>
          )}

          <div className="mt-3 h-5" aria-live="polite">
            {error && (
              <p id="cta-email-error" role="alert" className="text-xs text-live">
                {error}
              </p>
            )}
            {mutation.isError && !error && (
              <p role="alert" className="text-xs text-live">
                Something went wrong. Please try again.
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {CHANNELS.map((c) => (
              <a
                key={c.label}
                href={c.href}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-bg/80 px-3 py-2 text-xs text-text-2 shadow-sm backdrop-blur outline-none transition-colors hover:text-text focus-visible:ring-2 focus-visible:ring-accent/40"
              >
                {c.icon}
                {c.label}
              </a>
            ))}
          </div>
        </motion.div>
      </Inner>
    </Frame>
  );
}
