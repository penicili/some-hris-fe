import { cookies } from "next/headers";

/**
 * Server-side helpers for the JWT issued by the backend.
 *
 * The token is kept in an HTTP-only cookie so browser JavaScript cannot read
 * or modify it. The backend remains the token issuer/verifier; this frontend
 * only stores the token and can forward it to protected backend endpoints.
 */

export const AUTH_COOKIE_NAME = "hris_access_token";
const defaultAuthCookieMaxAge = 60 * 60 * 24;
const configuredAuthCookieMaxAge = Number(process.env.AUTH_COOKIE_MAX_AGE);

export const AUTH_COOKIE_MAX_AGE =
  Number.isSafeInteger(configuredAuthCookieMaxAge) &&
  configuredAuthCookieMaxAge > 0
    ? configuredAuthCookieMaxAge
    : defaultAuthCookieMaxAge;

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    maxAge: AUTH_COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value;
}

export async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await getAuthToken();

  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}
