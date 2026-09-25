import type { LoginInput, RegisterInput } from "./schema";
import type { AuthServiceResult } from "./types";

/**
 * Server-side authentication service.
 *
 * Keep API/database calls here instead of in the form components. This keeps
 * private API URLs, API keys, and provider-specific code on the server.
 *
 * TODO: Replace the placeholder results with calls to your auth API or
 * database. A successful login/register should return { ok: true } and may
 * include a redirectTo path.
 */
export async function loginWithApi(
  _input: LoginInput,
): Promise<AuthServiceResult> {
  void _input;

  return {
    ok: false,
    message: "Connect the login service in lib/auth/service.ts.",
  };
}

/** See loginWithApi above; implement the registration API call here. */
export async function registerWithApi(
  _input: RegisterInput,
): Promise<AuthServiceResult> {
  void _input;

  return {
    ok: false,
    message: "Connect the registration service in lib/auth/service.ts.",
  };
}
