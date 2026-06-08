/**
 * Pure JWT utilities — edge-runtime compatible.
 * Import from proxy.ts (proxy file) safely.
 * Do NOT import next/headers here.
 */
import { SignJWT, jwtVerify } from "jose";

export interface SessionPayload {
  userId: string;
  email: string;
  role: string; // PENDING | STUDENT | ADMIN
  studentId: string | null;
}

function getSecret() {
  const key = process.env.JWT_SECRET ?? "reflectiq-dev-secret-change-in-production";
  return new TextEncoder().encode(key);
}

export async function signToken(
  payload: SessionPayload,
  expiresIn: string = "7d"
): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
