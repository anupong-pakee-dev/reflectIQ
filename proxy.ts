import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

const AUTH_PATHS = [
  "/login",
  "/register",
  "/register-success",
  "/forgot-password",
  "/reset-password",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthPath = AUTH_PATHS.some((p) => pathname.startsWith(p));

  // Read JWT from cookie
  const token = request.cookies.get("reflectiq_token")?.value;
  const session = token ? await verifyToken(token) : null;

  // ── Unauthenticated user ─────────────────────────────────
  if (!session) {
    if (isAuthPath) return NextResponse.next();
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ── Authenticated user on auth pages → redirect away ────
  if (isAuthPath && pathname !== "/register-success") {
    if (session.role === "PENDING") {
      return NextResponse.redirect(new URL("/pending", request.url));
    }
    if (session.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ── PENDING user ─────────────────────────────────────────
  if (session.role === "PENDING" && pathname !== "/pending") {
    return NextResponse.redirect(new URL("/pending", request.url));
  }

  // ── REJECTED user ────────────────────────────────────────
  if (session.role === "REJECTED" && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ── Non-admin accessing /admin ───────────────────────────
  if (pathname.startsWith("/admin") && session.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ── ADMIN accessing student dashboard ───────────────────
  if (pathname === "/" && session.role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
