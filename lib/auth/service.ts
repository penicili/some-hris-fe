import { z } from "zod";
import type { LoginInput, RegisterInput } from "./schema";
import type { AuthServiceResult } from "./types";

/**
 * Calls the backend auth API from the Next.js server.
 *
 * The backend in this project exposes:
 *   POST /api/auth/register -> 201 with the created user
 *   POST /api/auth/login    -> 200 with { token }
 *
 * The token is returned to the Server Action, which stores it in an
 * HTTP-only cookie. It is never returned to the browser component.
 *
 * TODO(auth): Add a getCurrentUser() request for GET /api/auth/me. It should
 * send getAuthHeaders() to the backend and return the user claims on success.
 */

const loginResponseSchema = z.object({
  token: z.string().min(1),
});

const registerResponseSchema = z.object({
  id: z.union([z.string(), z.number()]),
  email: z.string(),
  name: z.string(),
});

type BackendResponse =
  | {
      ok: true;
      data: unknown;
    }
  | {
      ok: false;
      status: number;
      message: string;
      payload: unknown;
    };

export async function loginWithApi(input: LoginInput): Promise<AuthServiceResult> {
  const response = await postJson(
    "/auth/login",
    input,
    "Unable to sign in right now. Please try again.",
  );

  if (!response.ok) {
    if (response.status === 401) {
      return {
        ok: false,
        message: "Invalid email or password.",
      };
    }

    return {
      ok: false,
      message: response.message,
    };
  }

  const parsedResponse = loginResponseSchema.safeParse(response.data);

  if (!parsedResponse.success) {
    return {
      ok: false,
      message: "The authentication service returned an invalid response.",
    };
  }

  return {
    ok: true,
    accessToken: parsedResponse.data.token,
    redirectTo: "/",
  };
}

export async function registerWithApi(
  input: RegisterInput,
): Promise<AuthServiceResult> {
  // The backend register schema accepts only these three fields.
  const response = await postJson(
    "/auth/register",
    {
      name: input.name,
      email: input.email,
      password: input.password,
    },
    "Unable to create your account right now. Please try again.",
  );

  if (!response.ok) {
    if (response.status === 409) {
      return {
        ok: false,
        message: response.message,
        fieldErrors: {
          email: response.message || "An account with this email already exists.",
        },
      };
    }

    return {
      ok: false,
      message: response.message,
    };
  }

  const parsedResponse = registerResponseSchema.safeParse(response.data);

  if (!parsedResponse.success) {
    return {
      ok: false,
      message: "The registration service returned an invalid response.",
    };
  }

  // The backend register endpoint does not return a JWT. Send the new user to
  // login so they can authenticate and receive a token.
  return {
    ok: true,
    redirectTo: "/login",
  };
}

async function postJson(
  path: string,
  body: unknown,
  fallbackMessage: string,
): Promise<BackendResponse> {
  const endpoint = getEndpoint(path);

  if (!endpoint) {
    return {
      ok: false,
      status: 0,
      message: "BACKEND_URL is not configured.",
      payload: null,
    };
  }

  try {
    const response = await fetch(endpoint, {
      body: JSON.stringify(body),
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "POST",
    });
    const payload: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message: getErrorMessage(payload, fallbackMessage),
        payload,
      };
    }

    return {
      ok: true,
      data: payload,
    };
  } catch {
    return {
      ok: false,
      status: 0,
      message: fallbackMessage,
      payload: null,
    };
  }
}

function getEndpoint(path: string): string | null {
  const configuredUrl = process.env.BACKEND_URL?.trim();

  if (!configuredUrl) {
    return null;
  }

  const normalizedUrl = /^https?:\/\//i.test(configuredUrl)
    ? configuredUrl
    : `http://${configuredUrl}`;
  const baseUrl = normalizedUrl.replace(/\/+$/, "");
  const apiBaseUrl = baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;

  return `${apiBaseUrl}${path}`;
}

function getErrorMessage(payload: unknown, fallbackMessage: string): string {
  if (typeof payload === "object" && payload !== null) {
    const record = payload as Record<string, unknown>;

    if (typeof record.message === "string" && record.message.trim()) {
      return record.message;
    }

    if (typeof record.error === "string" && record.error.trim()) {
      return record.error;
    }
  }

  return fallbackMessage;
}
