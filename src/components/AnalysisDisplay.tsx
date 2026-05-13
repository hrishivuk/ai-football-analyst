"use client";

import { TacticalAnalysis } from "@/types";
import {
  IconTactics,
  IconTarget,
  IconFire,
  IconPlay,
  IconAlertTriangle,
  IconRefresh,
  IconCornerKick,
} from "@/components/Icons";

interface AnalysisDisplayProps {
  analysis: TacticalAnalysis;
}

export default function AnalysisDisplay({ analysis }: AnalysisDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Formation"
          value={analysis.suggestedFormation}
          icon={<IconTactics className="w-5 h-5" />}
          color="emerald"
        />
        <StatCard
          label="Tactical Style"
          value={analysis.tacticalStyle}
          icon={<IconTarget className="w-5 h-5" />}
          color="amber"
        />
        <StatCard
          label="Pressing Intensity"
          value={analysis.pressingIntensity}
          icon={<IconFire className="w-5 h-5" />}
          color="red"
        />
      </div>

      {/* Gameplan */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <IconPlay className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="font-(family-name:--font-display) text-sm font-bold text-white uppercase tracking-wider">
            Gameplan
          </h3>
        </div>
        <p className="text-slate-300 leading-relaxed text-[15px]">
          {analysis.gameplan}
        </p>
      </div>

      {/* Two Column: Dangers + Subs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <IconAlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <h3 className="font-(family-name:--font-display) text-sm font-bold text-white uppercase tracking-wider">
              Key Danger Areas
            </h3>
          </div>
          <ul className="space-y-3">
            {analysis.keyDangerAreas.map((area, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-300 text-[15px]">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                {area}
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <IconRefresh className="w-4 h-4 text-blue-400" />
            </div>
            <h3 className="font-(family-name:--font-display) text-sm font-bold text-white uppercase tracking-wider">
              Substitution Strategy
            </h3>
          </div>
          <ul className="space-y-3">
            {analysis.substitutionStrategy.map((sub, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-300 text-[15px]">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                {sub}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Set Pieces */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <IconCornerKick className="w-4 h-4 text-amber-400" />
          </div>
          <h3 className="font-(family-name:--font-display) text-sm font-bold text-white uppercase tracking-wider">
            Set Pieces
          </h3>
        </div>
        <p className="text-slate-300 leading-relaxed text-[15px]">
          {analysis.setPieces}
        </p>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: "emerald" | "amber" | "red";
}) {
  const colorMap = {
    emerald: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-400",
      glow: "shadow-emerald-500/5",
    },
    amber: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      text: "text-amber-400",
      glow: "shadow-amber-500/5",
    },
    red: {
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      text: "text-red-400",
      glow: "shadow-red-500/5",
    },
  };

  const c = colorMap[color];

  return (
    <div className={`glass-card glass-card-hover rounded-2xl p-5 shadow-lg ${c.glow}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-8 h-8 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center ${c.text}`}>
          {icon}
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </span>
      </div>
      <div className={`text-lg font-bold ${c.text} font-(family-name:--font-display)`}>
        {value}
      </div>
    </div>
  );
}
