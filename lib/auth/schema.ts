import { z } from "zod";
import type { AuthFieldErrors } from "./types";

/**
 * Frontend validation mirrors the backend auth contract.
 *
 * These schemas are still validated on the server inside the Server Action;
 * the browser only uses required/type attributes for immediate feedback.
 */

export const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, { error: "Enter your password." }),
});

export const registerSchema = z.object({
  name: z.string().min(1, { error: "Enter your name." }),
  email: z.email("Enter a valid email address."),
  password: z.string().min(8, { error: "Password must be at least 8 characters." }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

export type ValidationResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      fieldErrors: AuthFieldErrors;
    };

/** Parse and normalize login data received from FormData. */
export function validateLoginInput(input: unknown): ValidationResult<LoginInput> {
  const result = loginSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      fieldErrors: toFieldErrors(result.error),
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

/** Parse registration data received from FormData. */
export function validateRegisterInput(
  input: unknown,
): ValidationResult<RegisterInput> {
  const result = registerSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      fieldErrors: toFieldErrors(result.error),
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

/** Convert Zod's array of issues into the shape used by AuthField. */
function toFieldErrors(error: z.ZodError): AuthFieldErrors {
  const fieldErrors: AuthFieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (field === "name" || field === "email" || field === "password") {
      fieldErrors[field] ??= issue.message;
    }
  }

  return fieldErrors;
}
