"use client";

import Link from "next/link";
import { useState } from "react";
import { LogIn, LogOut, Mail, UserPlus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function AccountSection() {
  const { configured, loading, user, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    await signOut();
    setSigningOut(false);
  }

  if (loading) {
    return (
      <Card className="mt-4">
        <div className="h-5 w-32 animate-pulse rounded bg-surface-raised" />
      </Card>
    );
  }

  // Signed in — show email + sign out.
  if (user) {
    return (
      <Card className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Account</p>
        <div className="mt-2 flex items-center gap-2 text-sm text-foreground">
          <Mail size={16} className="text-gold-soft" />
          <span className="truncate">{user.email}</span>
        </div>
        <Button
          variant="outline"
          className="mt-3 w-full"
          onClick={handleSignOut}
          disabled={signingOut}
        >
          <LogOut size={15} />
          {signingOut ? "Signing out..." : "Sign Out"}
        </Button>
      </Card>
    );
  }

  // Signed out — offer sign in / sign up (or an offline note if not configured).
  return (
    <Card className="mt-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">Account</p>
      <p className="mt-2 text-sm text-muted">
        {configured
          ? "Sign in to sync your streak, favorites, and reflections across devices."
          : "Running in offline mode — your progress is saved on this device."}
      </p>
      {configured && (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Link href="/login" className="flex-1">
            <Button variant="primary" className="w-full">
              <LogIn size={15} /> Log In
            </Button>
          </Link>
          <Link href="/signup" className="flex-1">
            <Button variant="secondary" className="w-full">
              <UserPlus size={15} /> Create Account
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
}
