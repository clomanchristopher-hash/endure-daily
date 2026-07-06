import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Shared layout for the Privacy, Terms, and Support pages. Earth-tone, readable,
// mobile-first. Server component — static content, no client hooks.
export function LegalShell({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:px-8">
      <Link
        href="/profile"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={15} /> Back to Profile
      </Link>

      <h1 className="mt-4 font-serif text-2xl font-bold text-foreground">{title}</h1>
      <p className="mt-1 text-xs text-muted">Last updated: {updated}</p>

      <div className="mt-6 flex flex-col gap-6">{children}</div>
    </div>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-serif text-base font-semibold text-foreground">{heading}</h2>
      <div className="mt-2 flex flex-col gap-2 text-sm leading-relaxed text-muted">{children}</div>
    </section>
  );
}
