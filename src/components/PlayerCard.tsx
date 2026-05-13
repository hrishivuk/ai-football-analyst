"use client";

import { Player } from "@/types";

interface PlayerCardProps {
  player: Player;
  onEdit: () => void;
  onDelete: () => void;
}

const fitnessColors: Record<string, string> = {
  fit: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  doubtful: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  injured: "bg-red-500/15 text-red-400 border-red-500/30",
  suspended: "bg-purple-500/15 text-purple-400 border-purple-500/30",
};

export default function PlayerCard({ player, onEdit, onDelete }: PlayerCardProps) {
  return (
    <div className="glass-card glass-card-hover rounded-2xl p-5 relative group">
      {/* Actions */}
      <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onEdit}
          className="w-7 h-7 rounded-lg bg-surface-raised border border-border flex items-center justify-center text-slate-500 hover:text-white hover:border-border-light transition-all cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          onClick={onDelete}
          className="w-7 h-7 rounded-lg bg-surface-raised border border-border flex items-center justify-center text-slate-500 hover:text-red-400 hover:border-red-500/30 transition-all cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-sm font-bold text-emerald-400 font-(family-name:--font-display)">
          {player.number ?? "—"}
        </div>
        <div>
          <h3 className="font-(family-name:--font-display) font-bold text-white text-sm leading-tight">
            {player.name}
          </h3>
          <span className="text-xs text-slate-500">{player.position}</span>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${fitnessColors[player.fitness_status]}`}>
          {player.fitness_status}
        </span>
        {player.preferred_foot && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-surface-raised border-border text-slate-400">
            {player.preferred_foot} foot
          </span>
        )}
        {player.age && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-surface-raised border-border text-slate-400">
            Age {player.age}
          </span>
        )}
      </div>

      {/* Strengths & Weaknesses */}
      {player.strengths && (
        <div className="mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500">Strengths</span>
          <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{player.strengths}</p>
        </div>
      )}
      {player.weaknesses && (
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-red-400">Weaknesses</span>
          <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{player.weaknesses}</p>
        </div>
      )}
    </div>
  );
}
