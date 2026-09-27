/**
 * Brand marks, plus the one canonical list of where TH-Labs actually is.
 *
 * lucide-react v1 removed its brand icon set, so the social glyphs live here as
 * plain paths. All of them inherit `currentColor` and size from `className`.
 *
 * The link list lives here too, beside the glyphs, because it was previously
 * duplicated in the footer and the closing CTA band and the two drifted — one
 * got the real URLs, the other kept dead `#` hrefs. One array, both consumers.
 */

type IconProps = { className?: string };

export function LinkedinIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.64h.05A4.17 4.17 0 0 1 17.6 8.7c4 0 4.74 2.6 4.74 6V21h-4v-5.5c0-1.31-.02-3-1.85-3-1.86 0-2.14 1.44-2.14 2.9V21h-4V9Z" />
    </svg>
  );
}

export function YoutubeIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23 7.5a4 4 0 0 0-2.8-2.9C18.2 4 12 4 12 4s-6.2 0-8.2.6A4 4 0 0 0 1 7.5 42 42 0 0 0 .5 12 42 42 0 0 0 1 16.5a4 4 0 0 0 2.8 2.9c2 .6 8.2.6 8.2.6s6.2 0 8.2-.6a4 4 0 0 0 2.8-2.9A42 42 0 0 0 23.5 12 42 42 0 0 0 23 7.5ZM9.8 15.3V8.7l6 3.3-6 3.3Z" />
    </svg>
  );
}

export function InstagramIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 3.68a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32Zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z" />
    </svg>
  );
}

export function TelegramIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M21.94 4.3 19 20.1c-.22 1-.82 1.24-1.66.77l-4.6-3.39-2.22 2.14c-.25.24-.45.45-.92.45l.33-4.68 8.52-7.7c.37-.33-.08-.51-.57-.18l-10.53 6.63-4.53-1.42c-.99-.3-1-.98.2-1.45L20.68 2.9c.82-.3 1.54.2 1.26 1.4Z" />
    </svg>
  );
}

export type SocialLink = {
  label: string;
  href: string;
  Icon: (props: IconProps) => React.ReactElement;
};

/** The accounts that actually exist. Rendered everywhere socials appear. */
export const SOCIAL_LINKS: SocialLink[] = [
  { label: "Instagram", href: "https://instagram.com/th_labs.io", Icon: InstagramIcon },
  { label: "Telegram", href: "https://t.me/thlabsio", Icon: TelegramIcon },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/thlabsio/",
    Icon: LinkedinIcon,
  },
];

/**
 * There is no YouTube channel yet, so this returns to the top of the page
 * rather than going nowhere. It belongs in the footer's brand row, which is a
 * presence strip — never in the "join the community" band, where a link that
 * does not reach a community is worse than an absent one.
 */
export const YOUTUBE_LINK: SocialLink = {
  label: "YouTube",
  href: "#top",
  Icon: YoutubeIcon,
};

/** Off-site links open a tab; in-page jumps must not. */
export const isExternal = (href: string) => href.startsWith("http");
