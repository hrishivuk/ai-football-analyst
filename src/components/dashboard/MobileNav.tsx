"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconSparkles, IconUsers } from "@/components/Icons";

const items = [
  { href: "/dashboard", label: "Home", exact: true },
  { href: "/dashboard/team", label: "Squad", icon: IconUsers },
  { href: "/dashboard/analyze", label: "AI", icon: IconSparkles },
];

function NavIcon({ href, exact }: { href: string; exact?: boolean }) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);

  if (href === "/dashboard") {
    return (
      <Link
        href={href}
        className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl text-[10px] font-medium ${
          active ? "text-white" : "text-zinc-500"
        }`}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
        </svg>
        Home
      </Link>
    );
  }

  const item = items.find((i) => i.href === href)!;
  const Icon = item.icon!;
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl text-[10px] font-medium ${
        active ? "text-white" : "text-zinc-500"
      }`}
    >
      <Icon className="w-5 h-5" />
      {item.label}
    </Link>
  );
}

export default function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-900 border-t border-white/10 px-2 py-2">
      <div className="flex items-center justify-around max-w-md mx-auto">
        <NavIcon href="/dashboard" exact />
        <NavIcon href="/dashboard/team" />
        <NavIcon href="/dashboard/analyze" />
      </div>
    </nav>
  );
}
