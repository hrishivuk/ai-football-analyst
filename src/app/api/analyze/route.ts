import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import { MatchInput, Player } from "@/types";

function buildPlayerContext(players: Player[]): string {
  if (!players.length) return "No player data available.";

  return players.map((p) => {
    const parts = [`${p.name} (#${p.number ?? "?"}) — ${p.position}`];
    if (p.fitness_status !== "fit") parts.push(`[${p.fitness_status.toUpperCase()}]`);
    if (p.strengths) parts.push(`Strengths: ${p.strengths}`);
    if (p.weaknesses) parts.push(`Weaknesses: ${p.weaknesses}`);
    if (p.preferred_foot) parts.push(`Foot: ${p.preferred_foot}`);
    if (p.age) parts.push(`Age: ${p.age}`);
    return parts.join(" | ");
  }).join("\n");
}

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GROQ_API_KEY not configured" },
      { status: 500 }
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const groq = new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
  });

  try {
    const input: MatchInput = await req.json();

    const { data: team } = await supabase
      .from("teams")
      .select("*")
      .eq("id", input.teamId)
      .single();

    const { data: players } = await supabase
      .from("players")
      .select("*")
      .eq("team_id", input.teamId);

    const fitPlayers = (players || []).filter((p: Player) => p.fitness_status === "fit" || p.fitness_status === "doubtful");
    const unavailable = (players || []).filter((p: Player) => p.fitness_status === "injured" || p.fitness_status === "suspended");

    const prompt = `You are an elite football tactical analyst. Analyze the following match and provide tactical recommendations personalized to this team's specific players.

OUR TEAM: ${team?.name || "Unknown"}
Default Formation: ${team?.formation || "4-3-3"}
Play Style: ${team?.play_style || "Not specified"}

OUR AVAILABLE SQUAD:
${buildPlayerContext(fitPlayers)}

UNAVAILABLE PLAYERS:
${unavailable.length ? unavailable.map((p: Player) => `${p.name} (${p.position}) — ${p.fitness_status}`).join("\n") : "None"}

OPPONENT: ${input.opponentName}
Opponent Formation: ${input.opponentFormation}
Opponent Weaknesses: ${input.opponentWeaknesses}
Match Type: ${input.matchType}
Weather: ${input.weather}

Respond with ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "suggestedFormation": "e.g. 4-3-3",
  "tacticalStyle": "e.g. High Press Counter-Attack",
  "pressingIntensity": "e.g. High / Medium / Low",
  "keyDangerAreas": ["area 1", "area 2", "area 3"],
  "substitutionStrategy": ["sub plan 1 — reference specific players", "sub plan 2", "sub plan 3"],
  "gameplan": "2-3 sentence tactical approach referencing specific players by name",
  "setPieces": "Set piece recommendations referencing players with relevant strengths"
}

IMPORTANT: The suggestedFormation MUST be one of: 4-3-3, 4-4-2, 3-5-2, 4-2-3-1, 5-3-2.
CRITICAL: Reference SPECIFIC player names and their attributes in your analysis. For example, if a player has pace, suggest using them against slow defenders. This should feel like real coaching, not generic advice.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1200,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    const analysis = JSON.parse(content);
    return NextResponse.json(analysis);
  } catch (error: unknown) {
    console.error("Analysis error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate analysis";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
