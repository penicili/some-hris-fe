"use client";

import { useActionState } from "react";
import { register } from "@/app/actions/auth";
import { initialAuthState } from "@/lib/auth/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
    <form action={formAction} className="space-y-4">
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

      {state?.message ? (
        <Alert variant="destructive">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      ) : null}

      <Button
        className="mt-1 h-12 w-full rounded-xl"
        disabled={pending}
        type="submit"
      >
        {pending ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
