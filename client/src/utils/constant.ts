import {
  HomeIcon,
  CreditCardIcon,
  ChartBarIcon,
  LightBulbIcon,
  UserIcon,
  CogIcon,
} from "@heroicons/react/24/outline";
import { SidebarLink } from "./types";

export const links: SidebarLink[] = [
  { name: "Dashboard", icon: HomeIcon, href: "/home/dashboard" },
  { name: "Transactions", icon: CreditCardIcon, href: "/home/transactions" },
  { name: "Analytics", icon: ChartBarIcon, href: "/home/analytics" },
  { name: "AI Insights", icon: LightBulbIcon, href: "/home/ai-insights" },
  { name: "Profile", icon: UserIcon, href: "/home/profile" },
  { name: "Settings", icon: CogIcon, href: "/home/settings" },
];

export const transactionTypeFilter = ["All", "Income", "Expense"];


export const durationOptions = [
    { label: "Past 24 Hours", value: "24h" },
    { label: "Past Week", value: "7d" },
    { label: "Past Month", value: "1m" },
    { label: "Past 6 Months", value: "6m" },
    { label: "Past Year", value: "1y" },
    { label: "Custom Range", value: "custom" },
]