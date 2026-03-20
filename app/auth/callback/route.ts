import { createServer } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  // console.log(searchParams)
  const code = searchParams.get("code");
  const rolefromurl = searchParams.get("role");
  const stateRaw = searchParams.get("state");

  let state: any = null;
  try {
    state = stateRaw ? JSON.parse(stateRaw) : null;
  } catch {
    state = null;
  }
  // console.log(searchParams)
  // console.log(role)

  if (code) {
    // return NextResponse.redirect(`${origin}/login`);
    const supabase = await createServer();

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    // console.log("data :", data);
    // console.log("session :", data.session)
    // console.log("user :",data.user)

    if (error || !data.user) {
      return NextResponse.redirect(`${origin}/login`);
    }

    const user = data.user;
     const session = data.session;

    await supabase
      .from("users")
      .update({ google_cal_status: true })
      .eq("id", user.id);

    // check if user exists
    const { data: existingUser } = await supabase
      .from("Users")
      .select("*")
      .eq("id", user.id)
      .single();

        if (state?.action === "connect_calendar") {
          if (existingUser?.role === "PLANNER") {
            const accessToken = session.provider_token;
            const refreshToken = session.provider_refresh_token;

            await supabase
              .from("Users")
              .update({
                google_access_token: accessToken,
                google_refresh_token: refreshToken,
                google_cal_status: true,
              })
              .eq("id", user.id);
          }

          return NextResponse.redirect(
            `${origin}${state?.redirect_to || "/dashboard"}`,
          );
        }

    // console.log(existingUser)

    let role = rolefromurl;

    if (!existingUser) {
      // console.log("Creating new user");
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

    // role based redirect
    if (role === "ADMIN") {
      return NextResponse.redirect(`${origin}/admin`);
    }

    if (role === "VENDOR") {
      return NextResponse.redirect(`${origin}/vendor/dashboard`);
    }

    if (role === "CLIENT") {
      return NextResponse.redirect(`${origin}/events`);
    }

    return NextResponse.redirect(`${origin}/onboarding`);
  }
}
