import { z } from "zod";
import type { AuthFieldErrors } from "./types";

/**
 * Keep authentication rules in this module so the same validation can be
 * reused by Server Actions, tests, and any future client-side validation.
 * The Server Action remains the source of truth; browser attributes are only
 * an early usability layer.
 */

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Enter a valid email address."));

const registrationPasswordSchema = z
  .string()
  .min(8, { error: "Password must be at least 8 characters." })
  .max(128, { error: "Password must be 128 characters or fewer." })
  .regex(/[A-Za-z]/, {
    error: "Password must contain at least one letter.",
  })
  .regex(/[0-9]/, {
    error: "Password must contain at least one number.",
  });

export const loginSchema = z.object({
  email: emailSchema,
  // Do not apply registration rules when signing in. Existing users may have
  // passwords created under an older policy.
  password: z.string().min(1, { error: "Enter your password." }),
});

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "Name must be at least 2 characters." })
    .max(100, { error: "Name must be 100 characters or fewer." }),
  email: emailSchema,
  password: registrationPasswordSchema,
  acceptedTerms: z.literal(true, {
    error: "You must accept the Terms of Service and Privacy Policy.",
  }),
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

/** Parse and normalize registration data received from FormData. */
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

    if (
      field === "name" ||
      field === "email" ||
      field === "password" ||
      field === "acceptedTerms"
    ) {
      const key = field === "acceptedTerms" ? "terms" : field;
      fieldErrors[key] ??= issue.message;
    }
  }

  return fieldErrors;
}
