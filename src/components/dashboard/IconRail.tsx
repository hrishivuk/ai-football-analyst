"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconSparkles, IconUsers } from "@/components/Icons";
import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
  { href: "/dashboard/team", label: "Squad", icon: IconUsers },
  { href: "/dashboard/analyze", label: "Analyze", icon: IconSparkles },
];

export default function IconRail({ onSignOut }: { onSignOut: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="icon-rail hidden lg:flex flex-col items-center py-5 px-2 min-h-0">
      <Link
        href="/dashboard"
        className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg mb-6 transition-all ${
          pathname === "/dashboard"
            ? "bg-white text-zinc-900"
            : "pitch-surface text-white hover:opacity-90"
        }`}
        title="Dashboard"
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
        </svg>
      </Link>

      <nav className="flex-1 flex flex-col items-center gap-2 w-full">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                active
                  ? "bg-white text-zinc-900 shadow-md"
                  : "text-zinc-500 hover:text-white hover:bg-white/10"
              }`}
            >
              <item.icon className="w-5 h-5" />
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col items-center gap-3 mt-auto">
        <ThemeToggle className="!border-white/10 !bg-white/5 !text-zinc-400 hover:!text-white" />
        <button
          type="button"
          onClick={onSignOut}
          title="Sign out"
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-white/10 transition-all cursor-pointer"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
