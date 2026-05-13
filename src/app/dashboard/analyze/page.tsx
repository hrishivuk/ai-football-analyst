"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import TacticalForm from "@/components/TacticalForm";
import TacticalBoard from "@/components/TacticalBoard";
import AnalysisDisplay from "@/components/AnalysisDisplay";
import TeamTalk from "@/components/TeamTalk";
import { MatchInput, TacticalAnalysis, Team } from "@/types";
import { IconSparkles } from "@/components/Icons";
import Link from "next/link";

export default function AnalyzePage() {
  const supabase = createClient();
  const [team, setTeam] = useState<Team | null>(null);
  const [playerCount, setPlayerCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [input, setInput] = useState<MatchInput>({
    opponentName: "",
    opponentFormation: "",
    opponentWeaknesses: "",
    matchType: "",
    weather: "",
    teamId: "",
  });

  const [analysis, setAnalysis] = useState<TacticalAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<"analysis" | "teamtalk">("analysis");
  const [error, setError] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  const fetchTeam = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: teams } = await supabase
      .from("teams")
      .select("*")
      .eq("user_id", user.id);

    const t = teams?.[0] || null;
    setTeam(t);

    if (t) {
      setInput((prev) => ({ ...prev, teamId: t.id }));
      const { count } = await supabase
        .from("players")
        .select("*", { count: "exact", head: true })
        .eq("team_id", t.id);
      setPlayerCount(count || 0);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const handleAnalyze = async () => {
    if (!input.opponentName || !input.opponentFormation) {
      setError("Please fill in at least the opponent name and formation.");
      return;
    }

    setAnalyzing(true);
    setError("");
    setAnalysis(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Analysis failed");
      }

      const data = await res.json();
      setAnalysis(data);
      setActiveTab("analysis");
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-surface-raised rounded-xl w-64" />
          <div className="h-60 bg-surface-raised rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="p-6 lg:p-10 max-w-2xl">
        <div className="glass-card rounded-2xl p-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
            <IconSparkles className="w-7 h-7 text-amber-400" />
          </div>
          <h2 className="font-(family-name:--font-display) text-xl font-bold text-white mb-2">
            Create a Team First
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            You need to set up your team and add players before running AI analysis.
            The AI uses your squad data to give personalized tactical recommendations.
          </p>
          <Link
            href="/dashboard/team"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 text-sm"
          >
            Set Up Team
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl">
      <div className="mb-8">
        <h1 className="font-(family-name:--font-display) text-3xl font-bold text-white mb-2">
          AI Match Analysis
        </h1>
        <p className="text-slate-500">
          Analyzing for <span className="text-emerald-400 font-medium">{team.name}</span> ({playerCount} players loaded)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <IconSparkles className="w-4.5 h-4.5 text-emerald-400" />
              </div>
              <div>
                <h2 className="font-(family-name:--font-display) text-base font-bold text-white">
                  Opposition Intel
                </h2>
                <p className="text-xs text-slate-500">
                  Tell us about the opponent — your squad data is already loaded
                </p>
              </div>
            </div>

            <TacticalForm
              input={input}
              onChange={setInput}
              onSubmit={handleAnalyze}
              loading={analyzing}
            />

            {error && (
              <div className="mt-4 px-4 py-3 bg-red-500/8 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl p-6 lg:sticky lg:top-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <svg className="w-4.5 h-4.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="3" width="20" height="18" rx="2" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <h2 className="font-(family-name:--font-display) text-base font-bold text-white">
                  Formation
                </h2>
              </div>
              {analysis && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  AI Suggested
                </span>
              )}
            </div>
            <TacticalBoard
              formation={analysis?.suggestedFormation || team.formation || "4-3-3"}
            />
          </div>
        </div>
      </div>

      {analysis && (
        <div ref={resultsRef} className="mt-10">
          <div className="section-divider mb-10" />

          <div className="flex items-center gap-6 mb-8">
            <button
              onClick={() => setActiveTab("analysis")}
              className={`relative pb-2 text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === "analysis" ? "text-emerald-400" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Tactical Analysis
              {activeTab === "analysis" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("teamtalk")}
              className={`relative pb-2 text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === "teamtalk" ? "text-emerald-400" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Pre-Match Team Talk
              {activeTab === "teamtalk" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
              )}
            </button>
          </div>

          {activeTab === "analysis" ? (
            <AnalysisDisplay analysis={analysis} />
          ) : (
            <TeamTalk input={input} />
          )}
        </div>
      )}
    </div>
  );
}
