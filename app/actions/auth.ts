"use server";

import { redirect } from "next/navigation";
import { validateLoginInput, validateRegisterInput } from "@/lib/auth/schema";
import { clearAuthCookie, setAuthCookie } from "@/lib/auth/session";
import { loginWithApi, registerWithApi } from "@/lib/auth/service";
import type { AuthState } from "@/lib/auth/types";

/**
 * Login Server Action.
 *
 * Server Actions are the right place to read FormData, validate it, call the
 * auth service, and establish a secure session. The Client Component only
 * submits the form and displays the returned state.
 */
export async function login(
  _previousState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const validation = validateLoginInput({
    email: readText(formData, "email"),
    password: readText(formData, "password"),
  });

  if (!validation.success) {
    return {
      status: "error",
      fieldErrors: validation.fieldErrors,
    };
  }

  const result = await loginWithApi(validation.data);

  if (!result.ok) {
    return {
      status: "error",
      message: result.message,
      fieldErrors: result.fieldErrors,
    };
  }

  if (!result.accessToken) {
    return {
      status: "error",
      message: "The authentication service did not return a token.",
    };
  }

  await setAuthCookie(result.accessToken);

  if (result.redirectTo) {
    redirect(result.redirectTo);
  }

  return { status: "success" };
}

/** Register Server Action. Keep registration rules in schema.ts. */
export async function register(
  _previousState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const validation = validateRegisterInput({
    name: readText(formData, "name"),
    email: readText(formData, "email"),
    password: readText(formData, "password"),
  });

  if (!validation.success) {
    return {
      status: "error",
      fieldErrors: validation.fieldErrors,
    };
  }

  const result = await registerWithApi(validation.data);

  if (!result.ok) {
    return {
      status: "error",
      message: result.message,
      fieldErrors: result.fieldErrors,
    };
  }

  // The backend register endpoint does not issue a JWT, so send the new user
  // to login to authenticate and receive their token.
  if (result.redirectTo) {
    redirect(result.redirectTo);
  }

  return { status: "success" };
}

/** Clear the local JWT cookie when the user logs out. */
export async function logout(): Promise<void> {
  await clearAuthCookie();
  redirect("/login");
}

function readText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}
