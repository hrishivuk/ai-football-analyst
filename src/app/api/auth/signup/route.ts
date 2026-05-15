import {
  createRouteHandlerClient,
  jsonWithAuthCookies,
} from "@/lib/supabase/route-handler";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { email, password, displayName } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const { supabase, pendingCookies } = createRouteHandlerClient(request);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName || email },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return jsonWithAuthCookies({ success: true }, 200, pendingCookies());
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sign up failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
