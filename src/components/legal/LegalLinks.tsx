import Link from "next/link";

const links = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/support", label: "Support" },
];

// Compact "Privacy · Terms · Support" row used in the More sheet, sidebar, and
// Profile so the legal/support pages are easy to reach (App Store requirement).
export function LegalLinks({
  className = "",
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-muted ${className}`}
    >
      {links.map((l, i) => (
        <span key={l.href} className="flex items-center gap-2">
          <Link href={l.href} onClick={onNavigate} className="hover:text-foreground">
            {l.label}
          </Link>
          {i < links.length - 1 && <span aria-hidden className="text-border-subtle">·</span>}
        </span>
      ))}
    </div>
  );
}
