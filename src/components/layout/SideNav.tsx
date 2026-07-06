"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cross } from "lucide-react";
import { primaryNavItems, secondaryNavItems } from "./nav-items";
import { FeedbackButton } from "@/components/FeedbackButton";
import { LegalLinks } from "@/components/legal/LegalLinks";

export function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border-subtle bg-surface/60 px-4 py-6 md:flex">
      <Link href="/" className="mb-8 flex items-center gap-2 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/15 text-gold">
          <Cross size={20} strokeWidth={2.25} />
        </span>
        <span className="font-serif text-lg font-semibold tracking-tight text-foreground">
          Endure Daily
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wider text-muted">
          Grow
        </p>
        {primaryNavItems.map((item) => (
          <NavLink key={item.href} item={item} active={pathname === item.href} />
        ))}
        {secondaryNavItems.slice(0, 2).map((item) => (
          <NavLink key={item.href} item={item} active={pathname === item.href} />
        ))}

        <p className="px-2 pb-1 pt-5 text-xs font-semibold uppercase tracking-wider text-muted">
          Account
        </p>
        {secondaryNavItems.slice(2).map((item) => (
          <NavLink key={item.href} item={item} active={pathname === item.href} />
        ))}
      </nav>

      <FeedbackButton className="mb-3" />

      <div className="rounded-xl border border-border-subtle bg-surface-raised p-3 text-xs text-muted">
        <p className="font-semibold text-gold-soft">Endure Daily</p>
        <p className="mt-1">Train your body. Anchor your soul.</p>
      </div>

      <LegalLinks className="mt-3" />
    </aside>
  );
}

function NavLink({
  item,
  active,
}: {
  item: { href: string; label: string; icon: React.ComponentType<{ size?: number }> };
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-gold/15 text-gold-soft"
          : "text-muted hover:bg-surface-raised hover:text-foreground"
      }`}
    >
      <Icon size={18} />
      {item.label}
    </Link>
  );
}
