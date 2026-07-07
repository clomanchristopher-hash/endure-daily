"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, RotateCcw, X } from "lucide-react";
import { primaryNavItems, secondaryNavItems } from "./nav-items";
import { FeedbackButton } from "@/components/FeedbackButton";
import { LegalLinks } from "@/components/legal/LegalLinks";
import { useAppState } from "@/context/AppStateContext";

export function BottomNav() {
  const pathname = usePathname();
  const { resetOnboarding } = useAppState();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreActive = secondaryNavItems.some((item) => item.href === pathname);

  return (
    <>
      {moreOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMoreOpen(false)}
        >
          <div
            className="absolute bottom-[calc(4rem+env(safe-area-inset-bottom))] left-0 right-0 rounded-t-2xl border-t border-border-subtle bg-surface p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between px-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                More
              </p>
              <button
                onClick={() => setMoreOpen(false)}
                aria-label="Close menu"
                className="text-muted"
              >
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium ${
                      active
                        ? "bg-gold/15 text-gold-soft"
                        : "bg-surface-raised text-muted"
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <button
              onClick={() => {
                resetOnboarding();
                setMoreOpen(false);
              }}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-raised hover:text-foreground"
            >
              <RotateCcw size={15} /> Reset Onboarding
            </button>

            <FeedbackButton className="mt-3 border-t border-border-subtle pt-4" />

            <LegalLinks className="mt-3" onNavigate={() => setMoreOpen(false)} />
          </div>
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border-subtle bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <div className="flex h-16 items-stretch">
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium ${
                  active ? "text-gold-soft" : "text-muted"
                }`}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={() => setMoreOpen((v) => !v)}
            className={`flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium ${
              moreActive || moreOpen ? "text-gold-soft" : "text-muted"
            }`}
          >
            <Menu size={20} />
            More
          </button>
        </div>
      </nav>
    </>
  );
}
