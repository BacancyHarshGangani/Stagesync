import { createServer } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req : NextRequest)
{
    const { searchParams, origin } = new URL(req.url)

    const code = searchParams.get("code");

    if(!code){
        return NextResponse.redirect(`${window.location.origin}/login`);
    }

    const supabase = await createServer();

    const { data , error } = await supabase.auth.exchangeCodeForSession(code);

    if(error || !data.user){
        return NextResponse.redirect(`${origin}/login`);
    }

    const user = data.user;
    const session = data.session;

    const { data: existingUser } = await supabase
    .from("Users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

    if(existingUser?.role === "PLANNER"){

        const { data } = await supabase
          .from("Users")
          .update({
            google_access_token: session.provider_token,
            google_refresh_token: session.refresh_token,
            google_cal_status: true,
            onboarding_status: true,
          })
          .eq("id", existingUser.id)
          .select();
    }

    return NextResponse.redirect(`${origin}/dashboard`);
}