/**
 * Server-side session management — uses next/headers.
 * Import from Server Components and Server Actions only.
 * Do NOT import from proxy.ts (use lib/jwt.ts there instead).
 */
import { cookies } from "next/headers";
import { signToken, verifyToken } from "./jwt";
import type { SessionPayload } from "./jwt";

export type { SessionPayload };

const COOKIE_NAME = "reflectiq_token";

export async function createSession(
  payload: SessionPayload,
  rememberMe = false
): Promise<void> {
  const expiresIn = rememberMe ? "30d" : "7d";
  const maxAge = rememberMe ? 30 * 24 * 3600 : 7 * 24 * 3600;
  const token = await signToken(payload, expiresIn);

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}
