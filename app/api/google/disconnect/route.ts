import { NextRequest, NextResponse } from "next/server";
import { createServer } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await supabase
    .from("Users")
    .update({
      google_access_token: null,
      google_refresh_token: null,
      google_cal_status: false,
    })
    .eq("id", user.id);

  return NextResponse.json({ success: true });
}
