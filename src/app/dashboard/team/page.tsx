"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Team, Player } from "@/types";
import { IconUsers } from "@/components/Icons";
import PlayerCard from "@/components/PlayerCard";
import PlayerFormModal from "@/components/PlayerFormModal";
import QuickAddPlayers from "@/components/QuickAddPlayers";

const formations = ["4-3-3", "4-4-2", "3-5-2", "4-2-3-1", "5-3-2", "4-1-4-1"];

export default function TeamPage() {
  const supabase = createClient();
  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [teamName, setTeamName] = useState("");
  const [teamFormation, setTeamFormation] = useState("4-3-3");
  const [playStyle, setPlayStyle] = useState("");

  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const fetchData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: teams } = await supabase
      .from("teams")
      .select("*")
      .eq("user_id", user.id);

    const t = teams?.[0] || null;
    setTeam(t);
    if (t) {
      setTeamName(t.name);
      setTeamFormation(t.formation);
      setPlayStyle(t.play_style || "");

      const { data: playerData } = await supabase
        .from("players")
        .select("*")
        .eq("team_id", t.id)
        .order("number", { ascending: true });

      setPlayers(playerData || []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const saveTeam = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (team) {
      await supabase
        .from("teams")
        .update({ name: teamName, formation: teamFormation, play_style: playStyle })
        .eq("id", team.id);
    } else {
      const { data } = await supabase
        .from("teams")
        .insert({ user_id: user.id, name: teamName, formation: teamFormation, play_style: playStyle })
        .select()
        .single();
      setTeam(data);
    }
    setSaving(false);
  };

  const deletePlayer = async (id: string) => {
    await supabase.from("players").delete().eq("id", id);
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const handlePlayerSaved = () => {
    setShowPlayerModal(false);
    setEditingPlayer(null);
    fetchData();
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-10 max-w-5xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-surface-raised rounded-xl w-48" />
          <div className="h-40 bg-surface-raised rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      <h1 className="font-(family-name:--font-display) text-3xl font-bold text-white mb-2">
        {team ? "Manage Team" : "Create Your Team"}
      </h1>
      <p className="text-slate-500 mb-8">
        {team
          ? "Update your squad details and manage your player roster."
          : "Set up your team to unlock context-aware AI analysis."}
      </p>

      {/* Team Settings */}
      <div className="glass-card rounded-2xl p-6 mb-8">
        <h2 className="font-(family-name:--font-display) text-base font-bold text-white mb-5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <IconUsers className="w-4 h-4 text-emerald-400" />
          </div>
          Team Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Team Name
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. FC Barcelona"
              className="w-full px-4 py-3 bg-surface-raised border border-border rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 input-glow transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Default Formation
            </label>
            <div className="flex flex-wrap gap-2">
              {formations.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setTeamFormation(f)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all cursor-pointer ${
                    teamFormation === f
                      ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                      : "bg-surface-raised border-border text-slate-400 hover:border-border-light hover:text-slate-300"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Play Style
          </label>
          <input
            type="text"
            value={playStyle}
            onChange={(e) => setPlayStyle(e.target.value)}
            placeholder="e.g. Possession-based, high press, tiki-taka"
            className="w-full px-4 py-3 bg-surface-raised border border-border rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 input-glow transition-all"
          />
        </div>

        <button
          onClick={saveTeam}
          disabled={saving || !teamName}
          className="px-6 py-2.5 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20 cursor-pointer text-sm"
        >
          {saving ? "Saving..." : team ? "Save Changes" : "Create Team"}
        </button>
      </div>

      {/* Players Roster */}
      {team && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-(family-name:--font-display) text-xl font-bold text-white">
              Player Roster ({players.length})
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowQuickAdd(!showQuickAdd)}
                className={`flex items-center gap-2 px-4 py-2.5 font-bold rounded-xl transition-all cursor-pointer text-sm border ${
                  showQuickAdd
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                    : "border-border text-slate-400 hover:text-white hover:border-border-light"
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                Quick Add
              </button>
              <button
                onClick={() => {
                  setEditingPlayer(null);
                  setShowPlayerModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer text-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Player
              </button>
            </div>
          </div>

          {showQuickAdd && (
            <QuickAddPlayers
              teamId={team.id}
              onDone={() => {
                setShowQuickAdd(false);
                fetchData();
              }}
            />
          )}

          {players.length === 0 && !showQuickAdd ? (
            <div className="glass-card rounded-2xl p-10 text-center">
              <p className="text-slate-500 mb-1">No players yet</p>
              <p className="text-xs text-slate-600">
                Add players with their strengths and weaknesses for smarter AI analysis
              </p>
            </div>
          ) : players.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {players.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  onEdit={() => {
                    setEditingPlayer(player);
                    setShowPlayerModal(true);
                  }}
                  onDelete={() => deletePlayer(player.id)}
                />
              ))}
            </div>
          ) : null}
        </div>
      )}

      {showPlayerModal && team && (
        <PlayerFormModal
          teamId={team.id}
          player={editingPlayer}
          onClose={() => {
            setShowPlayerModal(false);
            setEditingPlayer(null);
          }}
          onSaved={handlePlayerSaved}
        />
      )}
    </div>
  );
}
