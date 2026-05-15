import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Visit /api/health on Vercel to confirm env vars are visible to the server. */
export async function GET() {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();

  let host = "";
  try {
    if (url) host = new URL(url).hostname;
  } catch {
    host = "invalid-url";
  }

  return NextResponse.json({
    ok: Boolean(url && key),
    supabaseHost: host || null,
    hasAnonKey: Boolean(key),
    hasGroqKey: Boolean(process.env.GROQ_API_KEY),
  });
}
