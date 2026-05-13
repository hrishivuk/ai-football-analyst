"use client";

import { FORMATIONS, FormationPosition } from "@/types";

interface TacticalBoardProps {
  formation: string;
}

export default function TacticalBoard({ formation }: TacticalBoardProps) {
  const positions: FormationPosition[] =
    FORMATIONS[formation] || FORMATIONS["4-3-3"];

  return (
    <div className="relative w-full aspect-68/105 max-w-sm mx-auto rounded-2xl overflow-hidden border border-emerald-800/40 shadow-2xl shadow-emerald-900/20">
      {/* Pitch background with stripes */}
      <div className="absolute inset-0 pitch-surface" />
      <div className="absolute inset-0 pitch-stripes" />

      {/* Pitch markings */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 150"
        preserveAspectRatio="none"
      >
        {/* Outer border */}
        <rect x="5" y="5" width="90" height="140" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.4" />
        {/* Halfway line */}
        <line x1="5" y1="75" x2="95" y2="75" stroke="rgba(255,255,255,0.25)" strokeWidth="0.4" />
        {/* Center circle */}
        <circle cx="50" cy="75" r="12" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.4" />
        <circle cx="50" cy="75" r="0.7" fill="rgba(255,255,255,0.3)" />
        {/* Penalty area top */}
        <rect x="25" y="5" width="50" height="22" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.4" />
        {/* Goal area top */}
        <rect x="35" y="5" width="30" height="8" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.4" />
        {/* Penalty arc top */}
        <path d="M 38 27 A 8 8 0 0 0 62 27" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
        {/* Penalty area bottom */}
        <rect x="25" y="123" width="50" height="22" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.4" />
        {/* Goal area bottom */}
        <rect x="35" y="137" width="30" height="8" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.4" />
        {/* Penalty arc bottom */}
        <path d="M 38 123 A 8 8 0 0 1 62 123" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
        {/* Corner arcs */}
        <path d="M 5 8 A 3 3 0 0 0 8 5" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
        <path d="M 92 5 A 3 3 0 0 0 95 8" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
        <path d="M 5 142 A 3 3 0 0 1 8 145" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
        <path d="M 92 145 A 3 3 0 0 1 95 142" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
        {/* Penalty spots */}
        <circle cx="50" cy="19" r="0.5" fill="rgba(255,255,255,0.3)" />
        <circle cx="50" cy="131" r="0.5" fill="rgba(255,255,255,0.3)" />
      </svg>

      {/* Player positions */}
      {positions.map((pos, i) => (
        <div
          key={i}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5 transition-all duration-700 ease-out"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
          }}
        >
          <div className="player-dot w-7 h-7 md:w-8 md:h-8 rounded-full bg-white border-2 border-white/80 flex items-center justify-center text-[10px] md:text-[11px] font-bold text-emerald-900">
            {i + 1}
          </div>
          <span className="text-[8px] md:text-[9px] font-semibold text-white/80 bg-black/50 backdrop-blur-sm px-1.5 py-px rounded-full leading-tight">
            {pos.role}
          </span>
        </div>
      ))}

      {/* Formation badge */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/10">
        <span className="text-[11px] font-bold text-white tracking-wider">{formation}</span>
      </div>

      {/* Subtle vignette */}
      <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_40px_rgba(0,0,0,0.3)] pointer-events-none" />
    </div>
  );
}
