import { NextResponse, userAgent } from "next/server";
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

  if (
    pathname.startsWith("/api") ||
    pathname === "/auth/callback" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register")
  ) {
    return res;
  }
  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const { data: profile, error } = await supabase
    .from("Users")
    .select("onboarding_status, role, vendor_onboarding_status")
    .eq("id", user.id)
    .maybeSingle();

  console.log(profile);

  const isOnboarded = profile?.onboarding_status;
  const vendorOnboarded = profile?.vendor_onboarding_status;
  const role = profile?.role;

  if (role === "ADMIN" && pathname !== "/admin")
    return NextResponse.redirect(new URL("/admin", req.url));

  if (isOnboarded) {
    if (
      pathname.startsWith("/login") ||
      pathname.startsWith("/register") ||
      pathname === "/onboarding"
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  if (vendorOnboarded) {
    if (
      pathname.startsWith("/login") ||
      pathname.startsWith("/register") ||
      pathname === "/vendor/onboarding"
    ) {
      return NextResponse.redirect(new URL("/vendor/dashboard", req.url));
    }
  }

  if (!isOnboarded && pathname !== "/onboarding" && role === "PLANNER") {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  if (
    !vendorOnboarded &&
    pathname !== "/vendor/onboarding" &&
    role === "VENDOR"
  ) {
    return NextResponse.redirect(new URL("/vendor/onboarding", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/",
    "/onboarding",
    "/login",
    "/register",
    "/vendor/:path*",
    "/admin",
    "/events/:path*",
  ],
};