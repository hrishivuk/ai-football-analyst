import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    redirect("/login");
  }

  const { data: { user } } = await supabase.auth.getUser();
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

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      <div className="mb-10">
        <h1 className="font-(family-name:--font-display) text-3xl font-bold text-white mb-2">
          Welcome, {profile?.display_name || "Coach"}
        </h1>
        <p className="text-slate-500">
          Your tactical command center. Manage your squad and run AI analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="glass-card rounded-2xl p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Team</div>
          <div className="font-(family-name:--font-display) text-xl font-bold text-white">
            {team?.name || "No team yet"}
          </div>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Squad Size</div>
          <div className="font-(family-name:--font-display) text-xl font-bold text-emerald-400">
            {playerCount} players
          </div>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Formation</div>
          <div className="font-(family-name:--font-display) text-xl font-bold text-amber-400">
            {team?.formation || "—"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {!team ? (
          <Link href="/dashboard/team" className="glass-card glass-card-hover rounded-2xl p-6 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <h3 className="font-(family-name:--font-display) font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
              Create Your Team
            </h3>
            <p className="text-sm text-slate-500">
              Set up your team, add players, and store their strengths and weaknesses.
            </p>
          </Link>
        ) : (
          <Link href="/dashboard/team" className="glass-card glass-card-hover rounded-2xl p-6 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87" />
                <path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <h3 className="font-(family-name:--font-display) font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
              Manage Squad
            </h3>
            <p className="text-sm text-slate-500">
              Edit players, update fitness status, and refine your roster.
            </p>
          </Link>
        )}

        <Link
          href="/dashboard/analyze"
          className={`glass-card glass-card-hover rounded-2xl p-6 group ${!team ? "opacity-50 pointer-events-none" : ""}`}
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
            </svg>
          </div>
          <h3 className="font-(family-name:--font-display) font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">
            Run AI Analysis
          </h3>
          <p className="text-sm text-slate-500">
            {team
              ? "Generate context-aware tactics using your squad data."
              : "Create a team first to unlock AI analysis."}
          </p>
        </Link>
      </div>
    </div>
  );
}
