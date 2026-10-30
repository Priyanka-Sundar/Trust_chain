"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  ListOrdered,
  Signal,
  GitCompare,
  Network,
  BarChart3,
  BookOpen,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analyze", label: "Review Analysis", icon: Search },
  { href: "/cases", label: "Case Queue", icon: ListOrdered },
  { href: "/signals", label: "Signals Reference", icon: Signal },
  { href: "/compare", label: "Compare Cases", icon: GitCompare },
  { href: "/network", label: "Reviewer Network", icon: Network },
  { href: "/insights", label: "Model Insights", icon: BarChart3 },
  { href: "/about", label: "Methodology", icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-ink-900 flex flex-col">
      <div className="p-6 border-b border-ink-900/60">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-terracotta-400 to-gold-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-serif text-lg leading-none">Trust Chain</h1>
            <p className="text-cream-300 text-[11px] mt-1">Complaint Intelligence</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <p className="px-4 py-2 text-[10px] uppercase tracking-wider text-cream-400 font-semibold">
          Investigation
        </p>
        {navItems.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("nav-link", isActive ? "nav-link-active" : "nav-link-inactive")}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <p className="px-4 py-2 mt-4 text-[10px] uppercase tracking-wider text-cream-400 font-semibold">
          Analytics
        </p>
        {navItems.slice(5).map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("nav-link", isActive ? "nav-link-active" : "nav-link-inactive")}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-ink-900/60">
        <div className="bg-ink-950 rounded-xl p-3">
          <p className="text-cream-300 text-[10px] uppercase tracking-wider font-semibold">Team</p>
          <p className="text-white text-xs mt-1.5 font-medium">Priyanka S</p>
          <p className="text-cream-300 text-[10px]">23MIA1032</p>
          <p className="text-white text-xs mt-1.5 font-medium">Kavya N</p>
          <p className="text-cream-300 text-[10px]">23MIA1125</p>
          <p className="text-cream-400 text-[10px] mt-2">SWE1017 · NLP · Fall 2026-27</p>
        </div>
      </div>
    </aside>
  );
}
