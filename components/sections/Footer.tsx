const LINK_GROUPS = [
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Featured", href: "#" },
      { label: "Case Studies", href: "#" }
    ]
  },
  {
    heading: "Connect",
    links: [
      { label: "Email", href: "#" },
      { label: "Twitter", href: "#" },
      { label: "LinkedIn", href: "#" }
    ]
  }
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-border px-6 py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 sm:flex-row sm:justify-between">
        <span className="font-pixel text-sm tracking-widest text-foreground">
          TH-LABS
        </span>
        <div className="flex flex-1 flex-col gap-10 sm:flex-row sm:justify-end sm:gap-20">
          {LINK_GROUPS.map(group => (
            <div key={group.heading} className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-widest text-muted">{group.heading}</span>
              {group.links.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-foreground/80 transition-colors hover:text-accent"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <p className="mx-auto mt-12 w-full max-w-6xl text-xs text-muted">
        © {new Date().getFullYear()} TH-LABS. All rights reserved.
      </p>
    </footer>
  );
}
