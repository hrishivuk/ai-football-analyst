import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/dashboard/PageHeader";
import ContentCard from "@/components/dashboard/ContentCard";
import SquadRosterGrid from "@/components/dashboard/SquadRosterGrid";
import { Player } from "@/types";

export default async function DashboardPage() {
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    redirect("/login");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: teams } = await supabase
    .from("teams")
    .select("*, players(count)")
    .eq("user_id", user.id);

  const team = teams?.[0];
  const playerCount = team?.players?.[0]?.count ?? 0;

  let players: Player[] = [];
  if (team) {
    const { data } = await supabase
      .from("players")
      .select("*")
      .eq("team_id", team.id)
      .order("number", { ascending: true });
    players = data ?? [];
  }

  return (
    <div className="w-full flex flex-col gap-6 min-h-0">
      <PageHeader
        badge="Dashboard"
        title={`Welcome, ${profile?.display_name || "Coach"}`}
        subtitle="Your tactical command center. Manage your squad and run AI-powered match analysis."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ContentCard>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary mb-1">
            Team
          </p>
          <p className="font-(family-name:--font-display) text-xl font-bold text-primary">
            {team?.name || "No team yet"}
          </p>
        </ContentCard>
        <ContentCard>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary mb-1">
            Squad size
          </p>
          <p className="font-(family-name:--font-display) text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {playerCount} players
          </p>
        </ContentCard>
        <ContentCard>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary mb-1">
            Formation
          </p>
          <p className="font-(family-name:--font-display) text-xl font-bold text-amber-600 dark:text-amber-400">
            {team?.formation || "—"}
          </p>
        </ContentCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Link
          href="/dashboard/team"
          className="content-card flex flex-col justify-between min-h-[180px] hover:shadow-lg transition-shadow group"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
              <svg
                className="w-5 h-5 text-emerald-600 dark:text-emerald-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
            </div>
            <h3 className="font-(family-name:--font-display) text-lg font-bold text-primary mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {team ? "Manage squad" : "Create your team"}
            </h3>
            <p className="text-sm text-secondary leading-relaxed">
              {team
                ? "Edit players, fitness, strengths, and roster details."
                : "Set up your team to unlock AI analysis."}
            </p>
          </div>
          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-4">
            Open squad →
          </span>
        </Link>

        <Link
          href="/dashboard/analyze"
          className={`content-card flex flex-col justify-between min-h-[180px] hover:shadow-lg transition-shadow group ${!team ? "opacity-50 pointer-events-none" : ""}`}
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
              <svg
                className="w-5 h-5 text-amber-600 dark:text-amber-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
              </svg>
            </div>
            <h3 className="font-(family-name:--font-display) text-lg font-bold text-primary mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Run AI analysis
            </h3>
            <p className="text-sm text-secondary leading-relaxed">
              {team
                ? "Context-aware tactics using your full squad data."
                : "Create a team first."}
            </p>
          </div>
          <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 mt-4">
            Analyze match →
          </span>
        </Link>
      </div>

      {team && (
        <ContentCard
          title={`Squad roster (${players.length})`}
          action={
            <Link
              href="/dashboard/team"
              className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              View all
            </Link>
          }
          className="flex-1"
        >
          <SquadRosterGrid players={players} />
        </ContentCard>
      )}

      {!team && (
        <ContentCard className="flex-1 flex items-center justify-center py-12">
          <div className="text-center max-w-md">
            <p className="text-primary font-semibold mb-2">Get started</p>
            <p className="text-sm text-secondary mb-6">
              Create your team and add players to unlock AI-powered match analysis.
            </p>
            <Link
              href="/dashboard/team"
              className="inline-flex px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-400 transition-all text-sm"
            >
              Create team
            </Link>
          </div>
        </ContentCard>
      )}
    </div>
  );
}
