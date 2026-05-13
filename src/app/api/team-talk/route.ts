import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import { MatchInput, Player } from "@/types";

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response("GROQ_API_KEY not configured", { status: 500 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
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

    const fitPlayers = (players || []).filter((p: Player) => p.fitness_status === "fit");
    const playerNames = fitPlayers.map((p: Player) => p.name).join(", ");

    const prompt = `You are a legendary football manager giving a passionate pre-match team talk to ${team?.name || "your team"}.

The match is against ${input.opponentName} (playing ${input.opponentFormation}).

Your squad for today: ${playerNames || "the lads"}

Context:
- Match type: ${input.matchType}
- Weather: ${input.weather}
- Their weaknesses: ${input.opponentWeaknesses}
- Our play style: ${team?.play_style || "attacking football"}

Write a powerful, emotional 3-4 paragraph pre-match speech. Be dramatic, motivational, and tactical. Reference SPECIFIC player names from the squad — call them out, tell them what you expect from them today. Reference the opposition's weaknesses and how your team will exploit them.

Make it feel like a real dressing room moment. Channel the intensity of coaches like Ferguson, Mourinho, Klopp, or Guardiola.

Write ONLY the speech text. No quotes, no labels, no markdown. Just raw speech.`;

    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
      max_tokens: 600,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || "";
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: unknown) {
    console.error("Team talk error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate team talk";
    return new Response(message, { status: 500 });
  }
}
