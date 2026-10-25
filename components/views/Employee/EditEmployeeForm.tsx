"use client";

import Link from "next/link";
import { useActionState } from "react";
import { updateEmployeeAction } from "@/app/actions/employees";
import { initialUpdateEmployeeState } from "@/lib/employee/types";
import type { Employee } from "@/lib/employee/types";
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

type EditEmployeeFormProps = {
  employee: Employee;
};

export default function EditEmployeeForm({ employee }: EditEmployeeFormProps) {
  const [state, formAction, pending] = useActionState(
    updateEmployeeAction,
    initialUpdateEmployeeState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <input name="id" type="hidden" value={employee.id} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          defaultValue={employee.fullName}
          error={state?.fieldErrors?.fullName}
          id="fullName"
          label="Nama lengkap"
          name="fullName"
        />

        <Field
          defaultValue={formatDateForInput(employee.hireDate)}
          error={state?.fieldErrors?.hireDate}
          id="hireDate"
          label="Tanggal bergabung"
          name="hireDate"
          type="date"
        />

        <SelectField
          defaultValue={employee.status}
          error={state?.fieldErrors?.status}
          id="status"
          label="Status"
          name="status"
          options={statusOptions}
        />

        <Field
          defaultValue={employee.salary}
          error={state?.fieldErrors?.salary}
          id="salary"
          label="Gaji"
          name="salary"
          type="number"
        />

        <SelectField
          defaultValue={employee.employment ?? undefined}
          error={state?.fieldErrors?.employment}
          id="employment"
          label="Jenis kontrak"
          name="employment"
          options={employmentOptions}
          optional
        />

        <Field
          defaultValue={employee.departmentId ?? ""}
          error={state?.fieldErrors?.departmentId}
          id="departmentId"
          label="ID departemen"
          name="departmentId"
          type="number"
          optional
        />

        <Field
          defaultValue={employee.positionId}
          error={state?.fieldErrors?.positionId}
          id="positionId"
          label="ID jabatan"
          name="positionId"
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
          {pending ? "Menyimpan..." : "Simpan perubahan"}
        </Button>

        {state.status === "success" ? (
          <Button asChild className="h-auto p-0" variant="link">
            <Link href={`/karyawan/${employee.id}`}>Lihat detail karyawan</Link>
          </Button>
        ) : null}
      </div>
    </form>
  );
}

function formatDateForInput(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
}

type FieldProps = {
  id: string;
  name: string;
  label: string;
  defaultValue: string | number;
  error?: string;
  type?: "text" | "number" | "date";
  optional?: boolean;
};

function Field({
  id,
  name,
  label,
  defaultValue,
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
        defaultValue={defaultValue}
        id={id}
        name={name}
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
