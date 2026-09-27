"use client";

import Link from "next/link";
import { useActionState } from "react";
import { assignUser } from "@/app/actions/employees";
import { initialAssignUserState } from "@/lib/employee/types";

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
        <p
          className={`rounded-lg px-3 py-2 text-sm ${
            state.status === "success"
              ? "bg-primary-soft text-primary"
              : "bg-red-50 text-red-700"
          }`}
          role="alert"
        >
          {state.message}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button
          className="flex h-12 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={pending}
          type="submit"
        >
          {pending ? "Menghubungkan..." : "Hubungkan akun"}
        </button>

        {state.status === "success" ? (
          <Link
            className="text-sm font-medium text-primary transition-colors hover:text-primary-hover"
            href="/karyawan/daftar"
          >
            Lihat daftar karyawan
          </Link>
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
    <div>
      <label className="text-sm font-medium text-foreground" htmlFor={id}>
        {label}
      </label>

      <input
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        aria-invalid={error ? true : undefined}
        className="mt-2 h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/10"
        id={id}
        name={name}
        placeholder={placeholder}
        required
        type={type}
      />

      {error ? (
        <p
          className="mt-2 text-xs text-red-700"
          id={`${id}-error`}
          role="alert"
        >
          {error}
        </p>
      ) : hint ? (
        <p className="mt-2 text-xs text-muted-foreground" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
