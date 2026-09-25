"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import { initialAuthState } from "@/lib/auth/types";
import AuthField from "./AuthField";

/**
 * Client-side part of the login form.
 *
 * Keep browser-only behavior here: pending state, field-level feedback, and
 * interaction such as showing a password. Validation and authentication are
 * handled by the Server Action in app/actions/auth.ts.
 */
export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialAuthState);

  return (
    <>
      <form action={formAction} className="space-y-5">
        <AuthField
          autoComplete="email"
          error={state?.fieldErrors?.email}
          id="email"
          icon="email"
          label="Email address"
          name="email"
          placeholder="you@company.com"
          type="email"
        />
        <AuthField
          autoComplete="current-password"
          error={state?.fieldErrors?.password}
          id="password"
          icon="lock"
          label="Password"
          name="password"
          placeholder="Enter your password"
          type="password"
        />

        <div className="flex items-center justify-between gap-4 pt-1 text-sm">
          <label
            className="inline-flex cursor-pointer items-center gap-2 text-muted-foreground"
            htmlFor="remember"
          >
            <input
              className="size-4 rounded border-border accent-primary"
              id="remember"
              name="remember"
              type="checkbox"
            />
            Remember me
          </label>
          <Link
            className="font-medium text-primary transition-colors hover:text-primary-hover"
            href="#"
          >
            Forgot password?
          </Link>
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
          className="flex h-12 w-full items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/25 focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={pending}
          type="submit"
        >
          {pending ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </>
  );
}
