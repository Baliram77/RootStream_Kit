import type { ComponentType } from "react";
import { IconClock, IconDashboard, IconPlus, IconStreams, IconWallet } from "@/components/ui/Icons";

export type NavIcon = ComponentType<{ className?: string }>;

export const NAV_ITEMS: readonly { href: string; label: string; icon: NavIcon }[] = [
  { href: "/", label: "Dashboard", icon: IconDashboard },
  { href: "/create", label: "Create Stream", icon: IconPlus },
  { href: "/streams", label: "Streams", icon: IconStreams },
  { href: "/history", label: "History", icon: IconClock },
  { href: "/funds", label: "Funds", icon: IconWallet },
] as const;
