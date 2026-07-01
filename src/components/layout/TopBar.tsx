import { Cross } from "lucide-react";
import Link from "next/link";
import { StreakBadge } from "@/components/ui/StreakBadge";

export function TopBar() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border-subtle bg-background/90 px-4 py-3 backdrop-blur md:px-8">
      <Link href="/" className="flex items-center gap-2 md:hidden">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/15 text-gold">
          <Cross size={18} strokeWidth={2.25} />
        </span>
        <span className="font-serif text-base font-semibold tracking-tight">Endure Daily</span>
      </Link>
      <span className="hidden font-serif text-sm text-muted md:inline">
        Train your body. Anchor your soul.
      </span>
      <StreakBadge />
    </header>
  );
}
