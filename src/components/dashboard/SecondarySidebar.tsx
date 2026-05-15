"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useDashboard } from "@/contexts/DashboardContext";
import { groupPlayersByPosition, playerInitials } from "@/lib/positions";
import { Player } from "@/types";

export default function SecondarySidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { team, players, profile, loading } = useDashboard();
  const [search, setSearch] = useState("");

  const selectedId = searchParams.get("player");
  const isTeamRoute = pathname.startsWith("/dashboard/team");

  const filteredGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = q
      ? players.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.position.toLowerCase().includes(q)
        )
      : players;
    return groupPlayersByPosition(list);
  }, [players, search]);

  const selectPlayer = (player: Player) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("player", player.id);
    router.push(`/dashboard/team?${params.toString()}`);
  };

  return (
    <aside className="panel-sidebar hidden lg:flex flex-col min-h-0 w-[280px] shrink-0">
      <div className="p-5 border-b border-white/5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">
          Your team
        </p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-sm font-bold text-emerald-400 shrink-0">
            {team?.name?.slice(0, 2).toUpperCase() ?? "—"}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-white text-sm truncate">
              {loading ? "Loading…" : team?.name ?? "No team yet"}
            </p>
            <p className="text-xs text-zinc-500 truncate">
              {profile?.display_name ?? "Coach"}
            </p>
          </div>
        </div>
      </div>

      {isTeamRoute && (
        <>
          <div className="px-4 pt-4">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search players…"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/15 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4 min-h-0">
            {!team ? (
              <p className="text-xs text-zinc-500 px-3 py-2 leading-relaxed">
                Create your team in the main panel to add players.
              </p>
            ) : players.length === 0 ? (
              <p className="text-xs text-zinc-600 px-3 py-2">No players yet</p>
            ) : (
              Object.entries(filteredGroups).map(([group, groupPlayers]) => (
                <div key={group} className="mb-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600 px-3 mb-1.5">
                    {group}
                  </p>
                  <ul className="space-y-0.5">
                    {groupPlayers.map((player) => {
                      const active = selectedId === player.id;
                      return (
                        <li key={player.id}>
                          <button
                            type="button"
                            onClick={() => selectPlayer(player)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-sm transition-all cursor-pointer ${
                              active
                                ? "bg-white text-zinc-900 font-medium"
                                : "text-zinc-300 hover:bg-white/5"
                            }`}
                          >
                            <span
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                active
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-white/10 text-zinc-400"
                              }`}
                            >
                              {playerInitials(player.name)}
                            </span>
                            <span className="truncate">{player.name}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {!isTeamRoute && (
        <div className="flex-1 px-5 py-6">
          <p className="text-xs text-zinc-500 leading-relaxed">
            Use the icons on the left to open Squad or AI Analysis.
          </p>
        </div>
      )}
    </aside>
  );
}
