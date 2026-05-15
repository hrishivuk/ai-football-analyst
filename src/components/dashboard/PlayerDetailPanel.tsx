"use client";

import { Player } from "@/types";
import { playerInitials } from "@/lib/positions";
import ContentCard from "./ContentCard";

const fitnessColors: Record<string, string> = {
  fit: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  doubtful: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  injured: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
  suspended: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
};

export default function PlayerDetailPanel({
  player,
  onEdit,
  onDelete,
}: {
  player: Player;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center text-lg font-bold text-emerald-600 dark:text-emerald-400 font-(family-name:--font-display)">
            {playerInitials(player.name)}
          </div>
          <div>
            <h1 className="font-(family-name:--font-display) text-2xl font-bold text-primary">
              {player.name}
            </h1>
            <p className="text-secondary text-sm mt-0.5">
              #{player.number ?? "—"} · {player.position}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onDelete}
            className="px-4 py-2 rounded-xl border border-border text-sm font-medium text-secondary hover:text-red-500 hover:border-red-500/30 transition-all cursor-pointer"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="px-4 py-2 rounded-xl bg-primary text-[var(--content-bg)] text-sm font-semibold hover:opacity-90 transition-all cursor-pointer dark:bg-white dark:text-zinc-900"
          >
            Edit player
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ContentCard title="Player information">
          <dl className="space-y-4">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-secondary mb-1">
                Position
              </dt>
              <dd className="text-primary font-medium">{player.position}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-secondary mb-1">
                Squad number
              </dt>
              <dd className="text-primary font-medium">{player.number ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-secondary mb-1">
                Preferred foot
              </dt>
              <dd className="text-primary font-medium capitalize">
                {player.preferred_foot}
              </dd>
            </div>
            {player.age && (
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-secondary mb-1">
                  Age
                </dt>
                <dd className="text-primary font-medium">{player.age}</dd>
              </div>
            )}
          </dl>
        </ContentCard>

        <ContentCard title="Availability">
          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full border ${fitnessColors[player.fitness_status]}`}
            >
              {player.fitness_status}
            </span>
          </div>
          <p className="text-sm text-secondary leading-relaxed">
            Fitness status is used by MatchAI when generating lineups and substitution
            advice for your next match.
          </p>
        </ContentCard>

        {player.strengths && (
          <ContentCard title="Strengths" className="lg:col-span-2">
            <p className="text-body text-sm leading-relaxed">{player.strengths}</p>
          </ContentCard>
        )}

        {player.weaknesses && (
          <ContentCard title="Weaknesses" className="lg:col-span-2">
            <p className="text-body text-sm leading-relaxed">{player.weaknesses}</p>
          </ContentCard>
        )}
      </div>
    </div>
  );
}
