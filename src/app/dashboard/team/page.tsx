"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useDashboard } from "@/contexts/DashboardContext";
import PageHeader from "@/components/dashboard/PageHeader";
import ContentCard from "@/components/dashboard/ContentCard";
import PlayerDetailPanel from "@/components/dashboard/PlayerDetailPanel";
import SquadRosterGrid from "@/components/dashboard/SquadRosterGrid";
import PlayerFormModal from "@/components/PlayerFormModal";
import QuickAddPlayers from "@/components/QuickAddPlayers";
import { IconUsers } from "@/components/Icons";

const formations = ["4-3-3", "4-4-2", "3-5-2", "4-2-3-1", "5-3-2", "4-1-4-1"];

function TeamPageContent() {
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("player");
  const { team, players, loading, refresh } = useDashboard();

  const [teamName, setTeamName] = useState("");
  const [teamFormation, setTeamFormation] = useState("4-3-3");
  const [playStyle, setPlayStyle] = useState("");
  const [saving, setSaving] = useState(false);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(
    null as import("@/types").Player | null
  );
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  useEffect(() => {
    if (team) {
      setTeamName(team.name);
      setTeamFormation(team.formation);
      setPlayStyle(team.play_style || "");
    }
  }, [team]);

  const selectedPlayer = players.find((p) => p.id === selectedId) ?? null;

  const saveTeam = async () => {
    const supabase = createClient();
    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    if (team) {
      await supabase
        .from("teams")
        .update({ name: teamName, formation: teamFormation, play_style: playStyle })
        .eq("id", team.id);
    } else {
      await supabase.from("teams").insert({
        user_id: user.id,
        name: teamName,
        formation: teamFormation,
        play_style: playStyle,
      });
    }
    setSaving(false);
    await refresh();
  };

  const deletePlayer = async (id: string) => {
    const supabase = createClient();
    await supabase.from("players").delete().eq("id", id);
    await refresh();
  };

  if (loading) {
    return (
      <div className="w-full animate-pulse space-y-4">
        <div className="h-10 bg-surface-raised rounded-xl w-64" />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="h-72 content-card" />
          <div className="h-72 content-card" />
        </div>
      </div>
    );
  }

  if (selectedPlayer && team) {
    return (
      <div className="w-full">
        <PlayerDetailPanel
          player={selectedPlayer}
          onEdit={() => {
            setEditingPlayer(selectedPlayer);
            setShowPlayerModal(true);
          }}
          onDelete={() => deletePlayer(selectedPlayer.id)}
        />
        {showPlayerModal && (
          <PlayerFormModal
            teamId={team.id}
            player={editingPlayer}
            onClose={() => {
              setShowPlayerModal(false);
              setEditingPlayer(null);
            }}
            onSaved={() => {
              setShowPlayerModal(false);
              setEditingPlayer(null);
              refresh();
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <PageHeader
        badge="Squad"
        title={team ? "Team & roster" : "Create your team"}
        subtitle={
          team
            ? "Update team settings and manage your full squad below."
            : "Set up your club profile to unlock AI-powered analysis."
        }
        actions={
          team ? (
            <>
              <button
                type="button"
                onClick={() => setShowQuickAdd(!showQuickAdd)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                  showQuickAdd
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
                    : "border-border text-secondary hover:text-primary"
                }`}
              >
                Quick add
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingPlayer(null);
                  setShowPlayerModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-primary text-[var(--content-bg)] text-sm font-semibold hover:opacity-90 cursor-pointer dark:bg-white dark:text-zinc-900"
              >
                Add player
              </button>
            </>
          ) : undefined
        }
      />

      {showQuickAdd && team && (
        <QuickAddPlayers
          teamId={team.id}
          onDone={() => {
            setShowQuickAdd(false);
            refresh();
          }}
        />
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full items-start">
        <ContentCard title="Team details" className="w-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <IconUsers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-sm text-secondary">
              Used by MatchAI for formation and style recommendations.
            </p>
          </div>

          <div className="space-y-4 mb-4">
            <div>
              <label className="label-field">Team name</label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. Manchester City"
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field">Default formation</label>
              <div className="flex flex-wrap gap-2">
                {formations.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setTeamFormation(f)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all cursor-pointer ${
                      teamFormation === f
                        ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                        : "bg-surface-raised border-border text-secondary hover:border-border-light"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label-field">Play style</label>
              <input
                type="text"
                value={playStyle}
                onChange={(e) => setPlayStyle(e.target.value)}
                placeholder="e.g. Possession-based, high press"
                className="input-field"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={saveTeam}
            disabled={saving || !teamName}
            className="px-6 py-2.5 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20 cursor-pointer text-sm"
          >
            {saving ? "Saving…" : team ? "Save changes" : "Create team"}
          </button>
        </ContentCard>

        {team ? (
          <ContentCard title={`Roster (${players.length})`} className="w-full min-h-[320px]">
            <p className="text-sm text-secondary mb-4">
              Click a player to view details, or use the sidebar on large screens.
            </p>
            <SquadRosterGrid players={players} />
          </ContentCard>
        ) : (
          <ContentCard className="w-full flex items-center justify-center min-h-[320px]">
            <p className="text-sm text-secondary text-center px-4">
              Save your team first, then add players here.
            </p>
          </ContentCard>
        )}
      </div>

      {showPlayerModal && team && (
        <PlayerFormModal
          teamId={team.id}
          player={editingPlayer}
          onClose={() => {
            setShowPlayerModal(false);
            setEditingPlayer(null);
          }}
          onSaved={() => {
            setShowPlayerModal(false);
            setEditingPlayer(null);
            refresh();
          }}
        />
      )}
    </div>
  );
}

export default function TeamPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full animate-pulse grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="h-72 content-card" />
          <div className="h-72 content-card" />
        </div>
      }
    >
      <TeamPageContent />
    </Suspense>
  );
}
