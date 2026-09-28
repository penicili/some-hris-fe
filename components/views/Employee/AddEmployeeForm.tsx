"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createEmployeeAction } from "@/app/actions/employees";
import { initialCreateEmployeeState } from "@/lib/employee/types";

const statusOptions = [
  { value: "active", label: "Aktif" },
  { value: "on_leave", label: "Cuti" },
  { value: "resigned", label: "Resign" },
];

const employmentOptions = [
  { value: "permanent", label: "Permanen" },
  { value: "contract", label: "Kontrak" },
  { value: "probation", label: "Probasi" },
  { value: "intern", label: "Magang" },
];

export default function AddEmployeeForm() {
  const [state, formAction, pending] = useActionState(
    createEmployeeAction,
    initialCreateEmployeeState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          error={state?.fieldErrors?.nik}
          id="nik"
          label="NIK karyawan"
          name="nik"
          placeholder="3273010000000001"
        />

        <Field
          error={state?.fieldErrors?.fullName}
          id="fullName"
          label="Nama lengkap"
          name="fullName"
          placeholder="Fajar Hidayat"
        />

        <Field
          error={state?.fieldErrors?.hireDate}
          id="hireDate"
          label="Tanggal bergabung"
          name="hireDate"
          type="date"
        />

        <SelectField
          error={state?.fieldErrors?.status}
          id="status"
          label="Status"
          name="status"
          options={statusOptions}
        />

        <Field
          error={state?.fieldErrors?.salary}
          id="salary"
          label="Gaji"
          name="salary"
          placeholder="5000000"
          type="number"
        />

        <SelectField
          error={state?.fieldErrors?.employment}
          id="employment"
          label="Jenis kontrak"
          name="employment"
          options={employmentOptions}
          optional
        />

        <Field
          error={state?.fieldErrors?.departmentId}
          id="departmentId"
          label="ID departemen"
          name="departmentId"
          placeholder="1"
          type="number"
          optional
        />

        <Field
          error={state?.fieldErrors?.positionId}
          id="positionId"
          label="ID jabatan"
          name="positionId"
          placeholder="1"
          type="number"
        />
      </div>

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
          {pending ? "Menyimpan..." : "Tambah karyawan"}
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
  placeholder?: string;
  error?: string;
  type?: "text" | "number" | "date";
  optional?: boolean;
};

function Field({
  id,
  name,
  label,
  placeholder,
  error,
  type = "text",
  optional = false,
}: FieldProps) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground" htmlFor={id}>
        {label}
        {optional ? (
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            (opsional)
          </span>
        ) : null}
      </label>

      <input
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={error ? true : undefined}
        className="mt-2 h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/10"
        id={id}
        name={name}
        placeholder={placeholder}
        required={!optional}
        type={type}
      />

      {error ? (
        <p className="mt-2 text-xs text-red-700" id={`${id}-error`} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type SelectFieldProps = {
  id: string;
  name: string;
  label: string;
  options: { value: string; label: string }[];
  error?: string;
  optional?: boolean;
};

function SelectField({
  id,
  name,
  label,
  options,
  error,
  optional = false,
}: SelectFieldProps) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground" htmlFor={id}>
        {label}
        {optional ? (
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            (opsional)
          </span>
        ) : null}
      </label>

      <select
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={error ? true : undefined}
        className="mt-2 h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
        id={id}
        name={name}
        required={!optional}
      >
        {optional ? <option value="">Pilih...</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error ? (
        <p className="mt-2 text-xs text-red-700" id={`${id}-error`} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
