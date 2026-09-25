"use client";

import { useActionState } from "react";
import { register } from "@/app/actions/auth";
import { initialAuthState } from "@/lib/auth/types";
import AuthField from "./AuthField";

/**
 * Client-side part of the registration form.
 *
 * Add interactive UI here when needed. Do not make authorization decisions or
 * trust this component for validation; the Server Action and schema remain
 * responsible for both.
 */
export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    register,
    initialAuthState,
  );

  return (
    <form action={formAction} className="space-y-3">
      <AuthField
        autoComplete="name"
        error={state?.fieldErrors?.name}
        id="name"
        icon="name"
        label="Full name"
        name="name"
        placeholder="Your full name"
      />
      <AuthField
        autoComplete="email"
        error={state?.fieldErrors?.email}
        id="email"
        icon="email"
        label="Work email"
        name="email"
        placeholder="you@company.com"
        type="email"
      />
      <AuthField
        autoComplete="new-password"
        error={state?.fieldErrors?.password}
        id="password"
        icon="lock"
        label="Password"
        name="password"
        placeholder="Create a password"
        type="password"
      />

      <div className="pt-1">
        <div className="flex items-start gap-3">
          <input
            aria-describedby={state?.fieldErrors?.terms ? "terms-error" : undefined}
            aria-invalid={state?.fieldErrors?.terms ? true : undefined}
            className="mt-0.5 size-4 shrink-0 rounded border-border accent-primary"
            id="terms"
            name="terms"
            required
            type="checkbox"
          />
          <label
            className="cursor-pointer text-xs leading-5 text-muted-foreground"
            htmlFor="terms"
          >
            I agree to the Terms of Service and Privacy Policy.
          </label>
        </div>
        {state?.fieldErrors?.terms && (
          <p
            className="mt-2 text-xs text-red-700"
            id="terms-error"
            role="alert"
          >
            {state.fieldErrors.terms}
          </p>
        )}
      </div>

      {state?.message && (
        <p
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
          role="alert"
        >
          {state.message}
        </p>
      )}

      <button
        className="mt-1 flex h-12 w-full items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/25 focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={pending}
        type="submit"
      >
        {pending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
