import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api") || pathname === "/auth/callback" ||   pathname.startsWith("/login") ||
  pathname.startsWith("/register") ) {
    return res;
  }
  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const { data: profile } = await supabase
    .from("Users")
    .select("onboarding_status")
    .eq("id", user.id)
    .single();

  const isOnboarded = profile?.onboarding_status;

  if (isOnboarded) {
    if (
      pathname.startsWith("/login") ||
      pathname.startsWith("/register") ||
      pathname === "/onboarding"
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  if (!isOnboarded && pathname !== "/onboarding") {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding", "/login", "/register"],
};