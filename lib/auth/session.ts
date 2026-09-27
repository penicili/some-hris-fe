import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { z } from "zod";
import { getEndpoint } from "@/lib/auth/service";
import type { AuthUser } from "@/lib/auth/types";

/**
 * Server-side helpers for the JWT issued by the backend.
 *
 * The token is kept in an HTTP-only cookie so browser JavaScript cannot read
 * or modify it. The backend remains the token issuer/verifier; this frontend
 * only stores the token and forwards it to protected backend endpoints.
 */

export const AUTH_COOKIE_NAME = "hris_access_token";
const defaultAuthCookieMaxAge = 60 * 60 * 24;
const configuredAuthCookieMaxAge = Number(process.env.AUTH_COOKIE_MAX_AGE);

export const AUTH_COOKIE_MAX_AGE =
  Number.isSafeInteger(configuredAuthCookieMaxAge) &&
  configuredAuthCookieMaxAge > 0
    ? configuredAuthCookieMaxAge
    : defaultAuthCookieMaxAge;

const currentUserSchema = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  role: z.string(),
});

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

export async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getAuthToken();

  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

/**
 * Ask the backend to validate the JWT and return the current user.
 *
 * Wrapped in React's `cache` so a layout and a page that both need the user
 * share one request per render pass instead of calling /auth/me twice.
 */
export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  const headers = await getAuthHeaders();

  if (!headers.Authorization) {
    return null;
  }

  const endpoint = getEndpoint("/auth/me");

  if (!endpoint) {
    return null;
  }

  try {
    const response = await fetch(endpoint, {
      cache: "no-store",
      headers,
    });

    if (!response.ok) {
      return null;
    }

    const payload: unknown = await response.json().catch(() => null);
    const parsedUser = currentUserSchema.safeParse(payload);

    return parsedUser.success ? parsedUser.data : null;
  } catch {
    return null;
  }
});

/** Require a backend-validated user before rendering a protected page. */
export async function requireUser(): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
