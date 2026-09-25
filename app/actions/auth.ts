"use server";

import { redirect } from "next/navigation";
import { validateLoginInput, validateRegisterInput } from "@/lib/auth/schema";
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

  // TODO: Set the secure session cookie here if your auth provider does not
  // do it inside loginWithApi.
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
    acceptedTerms: formData.get("terms") === "on",
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

  // TODO: Set the session or redirect the new user to onboarding here.
  if (result.redirectTo) {
    redirect(result.redirectTo);
  }

  return { status: "success" };
}

function readText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}
