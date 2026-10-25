"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createEmployeeAction } from "@/app/actions/employees";
import { initialCreateEmployeeState } from "@/lib/employee/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
          defaultValue="active"
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
          {pending ? "Menyimpan..." : "Tambah karyawan"}
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
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {optional ? (
          <span className="text-xs font-normal text-muted-foreground">
            (opsional)
          </span>
        ) : null}
      </Label>

      <Input
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={error ? true : undefined}
        className="h-12"
        id={id}
        name={name}
        placeholder={placeholder}
        required={!optional}
        type={type}
      />

      {error ? (
        <p className="text-xs text-destructive" id={`${id}-error`} role="alert">
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
  defaultValue?: string;
  error?: string;
  optional?: boolean;
};

function SelectField({
  id,
  name,
  label,
  options,
  defaultValue,
  error,
  optional = false,
}: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {optional ? (
          <span className="text-xs font-normal text-muted-foreground">
            (opsional)
          </span>
        ) : null}
      </Label>

      <Select defaultValue={defaultValue} name={name} required={!optional}>
        <SelectTrigger
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={error ? true : undefined}
          className="h-12 w-full data-[size=default]:h-12"
          id={id}
        >
          <SelectValue placeholder="Pilih..." />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error ? (
        <p className="text-xs text-destructive" id={`${id}-error`} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
