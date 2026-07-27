import {
  PlayCircle,
  Video,
  Clapperboard,
  Podcast,
  GraduationCap,
  MonitorPlay,
  Tv,
  Film,
  Newspaper,
  Megaphone,
  Gamepad2,
  Building2
} from "lucide-react";
import LogoLoop from "@/components/reactbits/LogoLoop/LogoLoop";

const USE_CASES = [
  { label: "YouTube", Icon: PlayCircle },
  { label: "Zoom Meetings", Icon: Video },
  { label: "Movies", Icon: Clapperboard },
  { label: "Podcasts", Icon: Podcast },
  { label: "Online Courses", Icon: GraduationCap },
  { label: "Webinars", Icon: MonitorPlay },
  { label: "TV Series", Icon: Tv },
  { label: "Documentaries", Icon: Film },
  { label: "News", Icon: Newspaper },
  { label: "Ads & Marketing", Icon: Megaphone },
  { label: "Gaming", Icon: Gamepad2 },
  { label: "Corporate Training", Icon: Building2 }
];

const USE_CASE_LOGOS = USE_CASES.map(({ label, Icon }) => ({
  node: (
    <span className="inline-flex items-center gap-2.5 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent/60">
      <Icon className="h-4 w-4 text-accent" aria-hidden />
      {label}
    </span>
  ),
  ariaLabel: label
}));

export default function TechStrip() {
  return (
    <section id="technology" className="w-full py-24 sm:py-32">
      <p className="mb-10 text-center text-xs uppercase tracking-widest text-muted">
        Bringing content to every language across:
      </p>
      <LogoLoop logos={USE_CASE_LOGOS} speed={60} gap={24} logoHeight={44} fadeOut fadeOutColor="#0a0a0f" pauseOnHover />
    </section>
  );
}
