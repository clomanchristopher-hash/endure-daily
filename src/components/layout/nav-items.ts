import {
  BookOpenText,
  Dumbbell,
  Flame,
  Heart,
  Home,
  NotebookPen,
  ShieldCheck,
  UserRound,
} from "lucide-react";

export const primaryNavItems = [
  { href: "/", label: "Today", icon: Home },
  { href: "/library", label: "Library", icon: BookOpenText },
  { href: "/fitness", label: "Fitness", icon: Dumbbell },
  { href: "/plans", label: "Plans", icon: Flame },
];

export const secondaryNavItems = [
  { href: "/journal", label: "Journal", icon: NotebookPen },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/admin", label: "Admin", icon: ShieldCheck },
];

export const allNavItems = [...primaryNavItems, ...secondaryNavItems];
