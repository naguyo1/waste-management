import { SignJWT, jwtVerify } from 'jose';
import type { Role } from '@prisma/client';
import type { Cookies } from '@sveltejs/kit';

export interface JWTPayload {
  sub: string; email: string; role: Role; name: string;
  iat?: number; exp?: number;
}

const getSecret = () => new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'fallback-dev-secret-min-32-chars-change-in-production!!'
);
const COOKIE = 'wl_session';
const EXPIRES = 7 * 24 * 60 * 60;

export async function createToken(payload: Omit<JWTPayload, 'iat'|'exp'>): Promise<string> {
  return new SignJWT({ ...payload }).setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt().setExpirationTime(`${EXPIRES}s`).sign(getSecret());
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as JWTPayload;
  } catch { return null; }
}

/* export function setSessionCookie(cookies: Cookies, token: string) {
  cookies.set(COOKIE, token, {
    path: '/', httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', maxAge: EXPIRES,
  });
} */

export function setSessionCookie(cookies: Cookies, token: string) {
  cookies.set(COOKIE, token, {
    path: '/',
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'lax',
    maxAge: EXPIRES,
  });
}

export function clearSessionCookie(cookies: Cookies) {
  cookies.delete(COOKIE, { path: '/' });
}

export async function getUser(cookies: Cookies): Promise<JWTPayload | null> {
  const token = cookies.get(COOKIE);
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAuth(cookies: Cookies): Promise<JWTPayload> {
  const user = await getUser(cookies);
  if (!user) throw new Error('Unauthorized');
  return user;
}

export async function requireRole(cookies: Cookies, ...roles: Role[]): Promise<JWTPayload> {
  const user = await requireAuth(cookies);
  if (!roles.includes(user.role)) throw new Error('Forbidden');
  return user;
}
