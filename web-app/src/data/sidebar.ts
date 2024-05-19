import { type User } from "next-auth";

import {
  Blocks,
  Book,
  Grid2X2,
  PiggyBank,
  ShieldPlus,
  type LucideIcon,
} from "lucide-react";

const basicProfileData = [
  {
    title: "Dashboard",
    hasChildren: false,
    icon: Grid2X2,
    activeIcon: Blocks,
    href: "/",
    color: "text-sky-500",
  },
  {
    title: "Budgets",
    icon: PiggyBank,
    href: "/budgets",
    color: "text-pink-500",
    hasChildren: false,
  },
  {
    title: "Expenses",
    icon: Book,
    href: "/expenses",
    color: "text-teal-500",
    hasChildren: false,
  },
  {
    title: "Upgrade",
    icon: ShieldPlus,
    href: "/upgrade",
    color: "text-orange-500",
    hasChildren: false,
  },
];

type DataReturnType = Array<{
  title: string;
  hasChildren: boolean;
  icon: LucideIcon;
  activeIcon?: LucideIcon;
  href: string;
  color: string;
  children?: Array<{
    title: string;
    icon: LucideIcon;
    activeIcon?: LucideIcon;
    href: string;
    color: string;
  }>;
}>;

export function getSideNavData(user: User): DataReturnType {
  if (!user) {
    throw new Error("User not found");
  }
  return basicProfileData;
}
