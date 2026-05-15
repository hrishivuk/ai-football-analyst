"use client";

import Link from "next/link";
import { Player } from "@/types";
import { playerInitials } from "@/lib/positions";

const fitnessStyles: Record<string, string> = {
  fit: "text-emerald-600 dark:text-emerald-400",
  doubtful: "text-amber-600 dark:text-amber-400",
  injured: "text-red-500 dark:text-red-400",
  suspended: "text-purple-500 dark:text-purple-400",
};

export default function SquadRosterGrid({
  players,
  linkPrefix = "/dashboard/team?player=",
}: {
  players: Player[];
  linkPrefix?: string;
}) {
  if (players.length === 0) {
    return (
      <p className="text-sm text-secondary py-8 text-center">
        No players in your squad yet.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-raised/80">
            <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-wider text-secondary">
              Player
            </th>
            <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-wider text-secondary hidden sm:table-cell">
              Position
            </th>
            <th className="text-center py-3 px-4 text-[10px] font-semibold uppercase tracking-wider text-secondary w-16">
              #
            </th>
            <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-wider text-secondary hidden md:table-cell">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr
              key={player.id}
              className="border-b border-border/60 last:border-0 hover:bg-surface-raised/50 transition-colors"
            >
              <td className="py-3 px-4">
                <Link
                  href={`${linkPrefix}${player.id}`}
                  className="flex items-center gap-3 font-medium text-primary hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  <span className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                    {playerInitials(player.name)}
                  </span>
                  {player.name}
                </Link>
              </td>
              <td className="py-3 px-4 text-secondary hidden sm:table-cell">
                {player.position}
              </td>
              <td className="py-3 px-4 text-center text-secondary font-(family-name:--font-display) font-semibold">
                {player.number ?? "—"}
              </td>
              <td className={`py-3 px-4 capitalize hidden md:table-cell ${fitnessStyles[player.fitness_status]}`}>
                {player.fitness_status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
