"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Player } from "@/types";

interface PlayerFormModalProps {
  teamId: string;
  player: Player | null;
  onClose: () => void;
  onSaved: () => void;
}

const positions = [
  "GK", "CB", "LB", "RB", "LWB", "RWB",
  "CDM", "CM", "CAM", "LM", "RM",
  "LW", "RW", "CF", "ST",
];

export default function PlayerFormModal({
  teamId,
  player,
  onClose,
  onSaved,
}: PlayerFormModalProps) {
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState(player?.name || "");
  const [position, setPosition] = useState(player?.position || "");
  const [number, setNumber] = useState<string>(player?.number?.toString() || "");
  const [strengths, setStrengths] = useState(player?.strengths || "");
  const [weaknesses, setWeaknesses] = useState(player?.weaknesses || "");
  const [fitnessStatus, setFitnessStatus] = useState(player?.fitness_status || "fit");
  const [preferredFoot, setPreferredFoot] = useState(player?.preferred_foot || "right");
  const [age, setAge] = useState<string>(player?.age?.toString() || "");

  const inputClass =
    "input-field";
  const labelClass =
    "label-field";

  const handleSave = async () => {
    if (!name || !position) return;
    setSaving(true);

    const supabase = createClient();
    const payload = {
      team_id: teamId,
      name,
      position,
      number: number ? parseInt(number) : null,
      strengths: strengths || null,
      weaknesses: weaknesses || null,
      fitness_status: fitnessStatus,
      preferred_foot: preferredFoot,
      age: age ? parseInt(age) : null,
    };

    if (player) {
      await supabase.from("players").update(payload).eq("id", player.id);
    } else {
      await supabase.from("players").insert(payload);
    }

    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="glass-card rounded-2xl p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-(family-name:--font-display) text-lg font-bold text-primary">
            {player ? "Edit Player" : "Add Player"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-raised border border-border flex items-center justify-center text-secondary hover:text-primary transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Player Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Marcus Rashford"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Shirt Number</label>
              <input
                type="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="e.g. 10"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Position</label>
            <div className="flex flex-wrap gap-1.5">
              {positions.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPosition(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                    position === p
                      ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                      : "bg-surface-raised border-border text-secondary hover:text-body"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 24"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Foot</label>
              <div className="flex gap-1.5">
                {(["left", "right", "both"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setPreferredFoot(f)}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-medium border transition-all cursor-pointer capitalize ${
                      preferredFoot === f
                        ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                        : "bg-surface-raised border-border text-secondary"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>Fitness</label>
              <div className="flex flex-wrap gap-1.5">
                {(["fit", "doubtful", "injured", "suspended"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFitnessStatus(s)}
                    className={`flex-1 py-2.5 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer capitalize ${
                      fitnessStatus === s
                        ? s === "fit"
                          ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                          : s === "doubtful"
                          ? "bg-amber-500/15 border-amber-500/40 text-amber-400"
                          : s === "injured"
                          ? "bg-red-500/15 border-red-500/40 text-red-400"
                          : "bg-purple-500/15 border-purple-500/40 text-purple-400"
                        : "bg-surface-raised border-border text-secondary"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Strengths</label>
            <textarea
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              placeholder="e.g. Pace, dribbling, clinical finishing, strong in 1v1..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label className={labelClass}>Weaknesses</label>
            <textarea
              value={weaknesses}
              onChange={(e) => setWeaknesses(e.target.value)}
              placeholder="e.g. Aerial duels, tracking back, inconsistent crossing..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-border rounded-xl text-secondary font-medium text-sm hover:bg-surface-raised transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !name || !position}
              className="flex-1 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20 cursor-pointer text-sm"
            >
              {saving ? "Saving..." : player ? "Update Player" : "Add Player"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
