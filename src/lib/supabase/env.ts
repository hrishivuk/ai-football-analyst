/** Shared Supabase URL/key parsing for browser, server, and middleware. */

function stripQuotes(value: string): string {
  const t = value.trim();
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    return t.slice(1, -1).trim();
  }
  return t;
}

export function getSupabaseUrl(): string | undefined {
  const raw =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  if (!raw) return undefined;
  let url = stripQuotes(raw);
  if (!url) return undefined;
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  return url;
}

export function getSupabaseAnonKey(): string | undefined {
  const raw =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_ANON_KEY;
  if (!raw) return undefined;
  const key = stripQuotes(raw);
  return key || undefined;
}

export function hasSupabaseEnv(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}
