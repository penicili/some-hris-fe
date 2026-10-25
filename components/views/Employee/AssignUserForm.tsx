"use client";

import Link from "next/link";
import { useActionState } from "react";
import { assignUser } from "@/app/actions/employees";
import { initialAssignUserState } from "@/lib/employee/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Client-side part of the assign-user form.
 *
 * Only browser behaviour lives here: pending state and field-level feedback.
 * The mutation itself runs in the Server Action.
 */
export default function AssignUserForm() {
  const [state, formAction, pending] = useActionState(
    assignUser,
    initialAssignUserState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <Field
        error={state?.fieldErrors?.nik}
        id="nik"
        label="NIK karyawan"
        name="nik"
        placeholder="3273010000000001"
        type="number"
      />

      <Field
        error={state?.fieldErrors?.fullName}
        hint="Harus sama persis dengan nama pada data karyawan."
        id="fullName"
        label="Nama lengkap"
        name="fullName"
        placeholder="Fajar Hidayat"
      />

      <Field
        error={state?.fieldErrors?.userId}
        hint="Id akun pengguna yang akan dihubungkan."
        id="userId"
        label="Id akun pengguna"
        name="userId"
        placeholder="24"
        type="number"
      />

      {state?.message ? (
        <Alert
          className={
            state.status === "success"
              ? "border-primary/30 bg-primary-soft text-primary"
              : undefined
          }
          variant={state.status === "success" ? "default" : "destructive"}
        >
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <Button className="h-12 rounded-xl px-5" disabled={pending} type="submit">
          {pending ? "Menghubungkan..." : "Hubungkan akun"}
        </Button>

        {state.status === "success" ? (
          <Button asChild className="h-auto p-0" variant="link">
            <Link href="/karyawan/daftar">Lihat daftar karyawan</Link>
          </Button>
        ) : null}
      </div>
    </form>
  );
}

type FieldProps = {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  hint?: string;
  error?: string;
  type?: "text" | "number";
};

function Field({
  id,
  name,
  label,
  placeholder,
  hint,
  error,
  type = "text",
}: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      <Input
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        aria-invalid={error ? true : undefined}
        className="h-12"
        id={id}
        name={name}
        placeholder={placeholder}
        required
        type={type}
      />

      {error ? (
        <p className="text-xs text-destructive" id={`${id}-error`} role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
