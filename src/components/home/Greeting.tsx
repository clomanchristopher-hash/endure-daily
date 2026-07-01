"use client";

import { useAppState } from "@/context/AppStateContext";

function timeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

export function Greeting() {
  const { ready, profile } = useAppState();
  // Show just the first name — "Good Morning, Chris" rather than the full name.
  const firstName = profile.display_name.trim().split(/\s+/)[0] || "Friend";
  // Time- and profile-based content is client-only; before hydration we show a
  // neutral heading so server and client markup match.
  const greeting = ready ? `${timeGreeting()}, ${firstName}` : "Welcome";

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-foreground">{greeting}</h1>
      <p className="mt-1 text-muted">
        Today is another opportunity to grow in faith.
      </p>
    </div>
  );
}
