"use client";

import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import Wordmark from "./wordmark";
import Dither from "./dither";
import { useJoinWaitlistMutation } from "@/lib/queries/useJoinWaitlistMutation";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const alreadyOn = mutation.data?.alreadyExists;

  return (
    <section id="waitlist" className="relative overflow-hidden border-y border-white/[0.08]">
      <Dither edge="right" className="text-white/[0.12]" />

      {/* Wordmark watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
      >
        <Wordmark className="whitespace-nowrap text-[22vw] text-white opacity-[0.04]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-col items-center px-5 py-24 text-center sm:px-8 md:py-36 lg:px-12"
      >
        <h2 className="max-w-2xl text-[clamp(2rem,6vw,4.5rem)] font-medium leading-[1.03] tracking-tight text-white">
          Put your work in{" "}
          <span className="font-normal italic text-white/45">every language.</span>
        </h2>
        <p className="mt-5 max-w-md font-sans text-white/60">
          Join the waitlist for early access and early-access pricing. No spam, ever.
        </p>

        {done ? (
          <p
            role="status"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 font-mono text-sm text-white"
          >
            <span className="text-accent">✓</span>
            {alreadyOn ? "You're already on the list — see you soon." : "You're on the list. We'll be in touch."}
          </p>
        ) : (
          <form onSubmit={onSubmit} noValidate className="mt-8 flex w-full max-w-md flex-col gap-3">
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
                  className="h-12 w-full rounded-full border border-white/12 bg-white/[0.03] px-5 font-mono text-sm text-white outline-none placeholder:text-white/30 focus-visible:border-white/40 focus-visible:ring-2 focus-visible:ring-white/30"
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
                  className="h-12 w-full rounded-full border border-white/12 bg-white/[0.03] px-5 font-mono text-sm text-white outline-none placeholder:text-white/30 focus-visible:border-white/40 focus-visible:ring-2 focus-visible:ring-white/30"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-white px-7 font-mono text-sm font-medium text-black outline-none transition-shadow hover:shadow-[0_0_28px_rgba(139,92,246,0.5)] focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-60"
            >
              {mutation.isPending ? "Joining…" : "Join Waitlist"}
            </button>
          </form>
        )}

        <div className="mt-3 h-5" aria-live="polite">
          {error && (
            <p id="cta-email-error" role="alert" className="font-mono text-xs text-live">
              {error}
            </p>
          )}
          {mutation.isError && !error && (
            <p role="alert" className="font-mono text-xs text-live">
              Something went wrong. Please try again.
            </p>
          )}
        </div>
      </motion.div>
    </section>
  );
}
