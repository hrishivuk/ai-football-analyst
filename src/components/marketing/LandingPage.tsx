import Link from "next/link";
import MarketingHeader from "./MarketingHeader";

const features = [
  {
    title: "Squad-aware AI",
    description:
      "Analysis uses your real players — fitness, strengths, and positions — not generic advice.",
  },
  {
    title: "Match preparation",
    description:
      "Opposition intel, suggested formation, gameplan, set pieces, and substitution ideas.",
  },
  {
    title: "Pre-match team talk",
    description:
      "Generate a motivational speech that names your squad and targets the opponent.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MarketingHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-6xl mx-auto px-5 pt-20 pb-24 sm:pt-28 sm:pb-32 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-4">
              For coaches & analysts
            </p>
            <h1 className="font-(family-name:--font-display) text-4xl sm:text-5xl lg:text-6xl font-bold text-primary tracking-tight max-w-3xl mx-auto leading-[1.1]">
              Your tactical command center, powered by AI
            </h1>
            <p className="text-secondary text-lg sm:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
              Build your squad, run context-aware match analysis, and walk into
              kickoff with a clear plan.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-8 py-3.5 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/25 text-sm"
              >
                Create free account
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-3.5 border border-border rounded-xl text-primary font-semibold hover:bg-surface-raised transition-all text-sm"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-5 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="content-card">
                <h3 className="font-(family-name:--font-display) font-bold text-primary mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-secondary leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-border bg-surface-raised/50">
          <div className="max-w-6xl mx-auto px-5 py-16 text-center">
            <h2 className="font-(family-name:--font-display) text-2xl font-bold text-primary mb-3">
              Ready for match day?
            </h2>
            <p className="text-secondary text-sm mb-8 max-w-md mx-auto">
              Set up your team in minutes and generate your first tactical brief.
            </p>
            <Link
              href="/signup"
              className="inline-flex px-8 py-3.5 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 text-sm"
            >
              Get started — it&apos;s free
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
          <span>© {new Date().getFullYear()} MatchAI</span>
          <div className="flex gap-6">
            <Link href="/login" className="hover:text-primary transition-colors">
              Sign in
            </Link>
            <Link href="/signup" className="hover:text-primary transition-colors">
              Create account
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
