"use client";

import { useState } from "react";
import ShinyText from "@/components/reactbits/ShinyText/ShinyText";
import JoinModal from "@/components/JoinModal";

export default function ClosingCta() {
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <section id="get-started" className="mx-auto w-full max-w-4xl px-6 py-24 text-center sm:py-32">
      <ShinyText
        text="TH-LABS is building the future of global communication — where every voice can be understood, every story can be shared, and every idea can reach the world, regardless of language."
        speed={4}
        color="#9a99a6"
        shineColor="#ffffff"
        className="font-pixel text-lg leading-relaxed sm:text-2xl sm:leading-relaxed"
      />
      <div className="mt-10">
        <button
          type="button"
          onClick={() => setRegisterOpen(true)}
          className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-8 text-sm font-medium text-white transition-colors hover:bg-accent-strong"
        >
          Get Started
        </button>
      </div>

      <JoinModal
        kind="register"
        accent="purple"
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
      />
    </section>
  );
}
