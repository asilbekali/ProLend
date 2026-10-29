"use client";

import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, Mail, Send, X } from "lucide-react";
import { CONTACT } from "./contact";
import { Roll } from "./primitives";

const noop = () => () => {};
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * "Contact sales" — opens a small chooser: message us on Telegram or write an
 * email. Styled as the orange pill unless told otherwise.
 */
export default function ContactButton({
  children = "Contact sales",
  tone = "orange",
  className = "",
}: {
  children?: ReactNode;
  tone?: "orange" | "dark";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be blocked; the mailto link is still right there.
    }
  };

  const option =
    "panel group/opt flex w-full items-center gap-3 rounded-2xl p-3.5 text-left outline-none transition-colors hover:border-white/25 focus-visible:ring-2 focus-visible:ring-white/40";

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className={`group/btn inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium outline-none transition-[filter,transform] hover:brightness-110 focus-visible:ring-2 focus-visible:ring-white/50 active:scale-[0.98] ${
          tone === "orange" ? "pill-orange" : "pill-dark btn-ring"
        } ${className}`}
      >
        <Roll>{children}</Roll>
      </button>

      {mounted
        ? createPortal(
            <div data-theme="dark" className="landing">
              <AnimatePresence>
                {open ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[100] flex items-end justify-center p-3 sm:items-center sm:p-4"
                  >
                    <div
                      aria-hidden="true"
                      onClick={() => setOpen(false)}
                      className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    />
                    <motion.div
                      role="dialog"
                      aria-modal="true"
                      aria-labelledby="contact-title"
                      initial={{ opacity: 0, y: 24, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 16, scale: 0.98 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="panel relative w-full max-w-md rounded-3xl p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-white shadow-[0_40px_120px_-30px_rgba(255,120,30,0.45)] sm:p-6"
                    >
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        aria-label="Close"
                        className="pill-dark absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/40">
                        Contact
                      </p>
                      <h2 id="contact-title" className="mt-2 text-2xl text-white">
                        How would you like to reach us?
                      </h2>
                      <p className="mt-1 text-[13px] text-white/50">
                        Pick whichever is easier — we answer both.
                      </p>

                      <div className="mt-5 flex flex-col gap-2.5">
                        <a
                          href={CONTACT.telegram}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => setOpen(false)}
                          className={option}
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#229ED9]/20 text-[#5cc2f0]">
                            <Send className="h-4 w-4" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[14px] font-medium">Telegram</span>
                            <span className="block text-[12px] text-white/50">
                              {CONTACT.telegramHandle}
                            </span>
                          </span>
                          <span className="text-white/30 transition-transform group-hover/opt:translate-x-0.5">
                            →
                          </span>
                        </a>

                        <div className={`${option} !p-0`}>
                          <a
                            href={`mailto:${CONTACT.email}`}
                            onClick={() => setOpen(false)}
                            className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl p-3.5 outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                          >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--orange)]/20 text-[var(--orange)]">
                              <Mail className="h-4 w-4" />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-[14px] font-medium">Email</span>
                              <span className="block truncate text-[12px] text-white/50">
                                {CONTACT.email}
                              </span>
                            </span>
                          </a>
                          <button
                            type="button"
                            onClick={copy}
                            aria-label="Copy email address"
                            className="mr-3 flex h-8 shrink-0 items-center gap-1 rounded-full bg-white/[0.07] px-2.5 text-[11px] text-white/70 hover:text-white"
                          >
                            {copied ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-[var(--green)]" /> Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" /> Copy
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
