/**
 * Shared types for the authentication flow.
 *
 * These types are intentionally serializable because they are returned from
 * Server Actions and read by Client Components through useActionState.
 */

export type AuthField = "name" | "email" | "password";

export type AuthUser = {
  id: number;
  email: string;
  name: string;
  role: string;
};

export type AuthFieldErrors = Partial<Record<AuthField, string>>;

export type AuthState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: AuthFieldErrors;
};

export const initialAuthState: AuthState = {
  status: "idle",
};

export type AuthServiceResult =
  | {
      ok: true;
      accessToken?: string;
      redirectTo?: string;
    }
  | {
      ok: false;
      message: string;
      fieldErrors?: AuthFieldErrors;
    };
