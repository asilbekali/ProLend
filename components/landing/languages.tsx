import { SceneHead } from "./primitives";

// A sample of what is live today — the full list runs past forty-two and grows
// every month, so the wall ends on an open line rather than a total.
const LANGUAGES = [
  "O'zbek",
  "English",
  "Русский",
  "Türkçe",
  "Қазақша",
  "Azərbaycanca",
  "Кыргызча",
  "Türkmençe",
  "Español",
  "Français",
  "Deutsch",
  "Português",
  "العربية",
  "हिन्दी",
  "中文",
  "日本語",
  "한국어",
];

export default function Languages() {
  return (
    <section id="languages" className="relative scroll-mt-20 py-24 sm:py-32">
      <SceneHead
        title={
          <>
            <span className="font-num">42</span>+ languages. And counting.
          </>
        }
        sub="Turkic languages first — and we keep adding more every month."
      />
      <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-x-5 gap-y-3 px-6 sm:mt-14 sm:gap-x-7">
        {LANGUAGES.map((l, i) => (
          <li
            key={l}
            className={`font-serif text-[clamp(1.15rem,2.6vw,1.75rem)] leading-tight ${
              i < 8 ? "text-white" : "text-white/40"
            }`}
          >
            {l}
          </li>
        ))}
        <li className="font-serif text-[clamp(1.15rem,2.6vw,1.75rem)] leading-tight text-[var(--chip-fg)]">
          + more every month
        </li>
      </ul>
    </section>
  );
}
