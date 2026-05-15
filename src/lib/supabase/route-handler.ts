import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

type CookieToSet = { name: string; value: string; options: CookieOptions };

/** Supabase client for Route Handlers — sets auth cookies on the response (required on Vercel). */
export function createRouteHandlerClient(request: NextRequest) {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) {
    throw new Error(
      "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel."
    );
  }

  let pendingCookies: CookieToSet[] = [];

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        pendingCookies = cookiesToSet;
      },
    },
  });

  return { supabase, pendingCookies: () => pendingCookies };
}

export function jsonWithAuthCookies(
  body: object,
  status: number,
  cookiesToSet: CookieToSet[]
) {
  const json = NextResponse.json(body, { status });
  cookiesToSet.forEach(({ name, value, options }) =>
    json.cookies.set(name, value, options)
  );
  return json;
}
