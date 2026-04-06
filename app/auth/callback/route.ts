import { createServer } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);

  const code = searchParams.get("code");
  const rolefromurl = searchParams.get("role");

  if (code) {

    const supabase = await createServer();

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.user) {
      return NextResponse.redirect(`${origin}/login`);
    }

    const user = data.user;

    const { data: existingUser } = await supabase
      .from("Users")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    let role = rolefromurl;

    if (!existingUser) {
      const { data, error } = await supabase
        .from("Users")
        .insert({
          id: user.id,
          email: user.email,
          name: user.user_metadata.full_name,
          role: rolefromurl,
        })
        .select();
    } else {
      role = existingUser.role;
    }

    if (role === "ADMIN") {
      return NextResponse.redirect(`${origin}/admin`);
    }

    if (role === "VENDOR") {
      return NextResponse.redirect(`${origin}/vendor/onboarding`);
    }

    if (role === "CLIENT") {
      return NextResponse.redirect(`${origin}/events`);
    }

    return NextResponse.redirect(`${origin}/onboarding`);
  }
}
