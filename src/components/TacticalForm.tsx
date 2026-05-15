"use client";

import { MatchInput } from "@/types";

interface TacticalFormProps {
  input: MatchInput;
  onChange: (input: MatchInput) => void;
  onSubmit: () => void;
  loading: boolean;
}

const formations = ["4-3-3", "4-4-2", "3-5-2", "4-2-3-1", "5-3-2", "4-1-4-1"];
const matchTypes = ["League", "Cup", "Friendly", "Derby", "Final", "Playoff"];
const weatherOptions = [
  { label: "Clear", icon: "☀️" },
  { label: "Rainy", icon: "🌧️" },
  { label: "Windy", icon: "💨" },
  { label: "Hot", icon: "🔥" },
  { label: "Cold", icon: "❄️" },
  { label: "Snowy", icon: "🌨️" },
];

const inputClass =
  "input-field";
const labelClass =
  "label-field";
const selectClass =
  "select-field";

export default function TacticalForm({
  input,
  onChange,
  onSubmit,
  loading,
}: TacticalFormProps) {
  const update = (field: keyof MatchInput, value: string) => {
    onChange({ ...input, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Opponent info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Opponent</label>
          <input
            type="text"
            value={input.opponentName}
            onChange={(e) => update("opponentName", e.target.value)}
            placeholder="e.g. Manchester City"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Their Formation</label>
          <div className="relative">
            <select
              value={input.opponentFormation}
              onChange={(e) => update("opponentFormation", e.target.value)}
              className={selectClass}
            >
              <option value="">Select formation</option>
              {formations.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>

      {/* Opponent weaknesses */}
      <div>
        <label className={labelClass}>Opponent Weaknesses</label>
        <textarea
          value={input.opponentWeaknesses}
          onChange={(e) => update("opponentWeaknesses", e.target.value)}
          placeholder="e.g. Slow centre-backs, vulnerable on the counter, weak in the air..."
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Context badge */}
      <div className="px-4 py-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="text-xs text-secondary">
          <span className="text-emerald-400 font-semibold">Your team data is loaded.</span>{" "}
          Player strengths, weaknesses, and fitness status will be included automatically in the AI analysis.
        </p>
      </div>

      {/* Match context — chip selectors */}
      <div>
        <label className={labelClass}>Match Type</label>
        <div className="flex flex-wrap gap-2">
          {matchTypes.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => update("matchType", input.matchType === t ? "" : t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                input.matchType === t
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                  : "bg-surface-raised border-border text-secondary hover:border-border-light hover:text-body"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>Weather</label>
        <div className="flex flex-wrap gap-2">
          {weatherOptions.map((w) => (
            <button
              key={w.label}
              type="button"
              onClick={() =>
                update("weather", input.weather === w.label ? "" : w.label)
              }
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all flex items-center gap-1.5 ${
                input.weather === w.label
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                  : "bg-surface-raised border-border text-secondary hover:border-border-light hover:text-body"
              }`}
            >
              <span className="text-base leading-none">{w.icon}</span>
              {w.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={onSubmit}
        disabled={loading}
        className="w-full py-4 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2.5 text-sm"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4.5 w-4.5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Analyzing Match Intel...
          </>
        ) : (
          <>
            <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
            </svg>
            Generate Tactical Analysis
          </>
        )}
      </button>
    </div>
  );
}
