"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import { initialAuthState } from "@/lib/auth/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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

      <div className="flex items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-2">
          <Checkbox id="remember" name="remember" />
          <Label
            className="text-sm font-normal text-muted-foreground"
            htmlFor="remember"
          >
            Remember me
          </Label>
        </div>
        <Button asChild className="h-auto p-0 text-sm" variant="link">
          <Link href="#">Forgot password?</Link>
        </Button>
      </div>

      {state?.message ? (
        <Alert variant="destructive">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      ) : null}

      <Button className="h-12 w-full rounded-xl" disabled={pending} type="submit">
        {pending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
