"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface QuickAddPlayersProps {
  teamId: string;
  onDone: () => void;
}

const positions = [
  "GK", "CB", "LB", "RB", "LWB", "RWB",
  "CDM", "CM", "CAM", "LM", "RM",
  "LW", "RW", "CF", "ST",
];

export default function QuickAddPlayers({ teamId, onDone }: QuickAddPlayersProps) {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [number, setNumber] = useState("");
  const [saving, setSaving] = useState(false);
  const [addedCount, setAddedCount] = useState(0);
  const [showPositionPicker, setShowPositionPicker] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const numberRef = useRef<HTMLInputElement>(null);
  const positionRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const canSave = name.trim() && position;

  const saveRow = async () => {
    if (!canSave || saving) return;
    setSaving(true);

    const supabase = createClient();
    await supabase.from("players").insert({
      team_id: teamId,
      name: name.trim(),
      position,
      number: number ? parseInt(number) : null,
      fitness_status: "fit",
      preferred_foot: "right",
    });

    setAddedCount((c) => c + 1);
    setName("");
    setPosition("");
    setNumber("");
    setSaving(false);
    nameRef.current?.focus();
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && name.trim()) {
      e.preventDefault();
      positionRef.current?.click();
    }
  };

  const handlePositionSelect = (pos: string) => {
    setPosition(pos);
    setShowPositionPicker(false);
    numberRef.current?.focus();
  };

  const handleNumberKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveRow();
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-primary">Quick Add</h3>
            <p className="text-[11px] text-secondary">Name, position, number — Enter to save, repeat</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {addedCount > 0 && (
            <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              {addedCount} added
            </span>
          )}
          <button
            onClick={onDone}
            className="px-4 py-2 text-sm font-medium text-secondary hover:text-primary border border-border rounded-xl hover:bg-surface-raised transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>

      {/* Input row */}
      <div className="flex gap-2 items-start">
        {/* Name */}
        <div className="flex-1 min-w-0">
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted mb-1.5">Name</label>
          <input
            ref={nameRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleNameKeyDown}
            placeholder="Player name"
            className="w-full px-3 py-2.5 bg-surface-raised border border-border rounded-lg text-primary text-sm placeholder:text-muted focus:outline-none focus:border-emerald-500/50 transition-all focus:shadow-[0_0_0_3px_rgba(16,185,129,0.15)]"
          />
        </div>

        {/* Position */}
        <div className="w-28 relative">
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted mb-1.5">Pos</label>
          <button
            ref={positionRef}
            type="button"
            onClick={() => setShowPositionPicker(!showPositionPicker)}
            className={`w-full px-3 py-2.5 rounded-lg text-sm font-medium border transition-all text-left cursor-pointer ${
              position
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-surface-raised border-border text-secondary"
            }`}
          >
            {position || "Select"}
          </button>

          {showPositionPicker && (
            <div className="absolute top-full left-0 mt-1 z-20 bg-surface-overlay border border-border rounded-xl p-2 shadow-2xl w-56 grid grid-cols-3 gap-1">
              {positions.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePositionSelect(p)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                    position === p
                      ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                      : "bg-surface-raised border-border text-secondary hover:text-primary hover:border-border-light"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Number */}
        <div className="w-20">
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted mb-1.5">#</label>
          <input
            ref={numberRef}
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            onKeyDown={handleNumberKeyDown}
            placeholder="10"
            className="w-full px-3 py-2.5 bg-surface-raised border border-border rounded-lg text-primary text-sm placeholder:text-muted focus:outline-none focus:border-emerald-500/50 transition-all focus:shadow-[0_0_0_3px_rgba(16,185,129,0.15)]"
          />
        </div>

        {/* Save button */}
        <div className="pt-5">
          <button
            onClick={saveRow}
            disabled={!canSave || saving}
            className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center text-white hover:bg-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
          >
            {saving ? (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Recently added preview */}
      {addedCount > 0 && (
        <p className="text-[11px] text-muted mt-3">
          Press Enter after the shirt number to save and add the next player. Click Done when finished.
        </p>
      )}
    </div>
  );
}
