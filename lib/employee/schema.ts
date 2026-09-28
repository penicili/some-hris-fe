import { z } from "zod";
import type {
  AssignUserFieldErrors,
  CreateEmployeeField,
  CreateEmployeeFieldErrors,
  UpdateEmployeeField,
  UpdateEmployeeFieldErrors,
} from "./types";

/**
 * Mirrors the backend `Employee` model (prisma/schema.prisma).
 *
 * `GET /api/employee` runs a plain `findMany()`, so the payload only contains
 * scalar columns. `department` and `position` objects are not included, only
 * their ids.
 */

export const employeeSchema = z.object({
  id: z.number(),
  nik: z.string(),
  fullName: z.string(),
  hireDate: z.string(),
  status: z.enum(["active", "on_leave", "resigned"]),
  salary: z.number(),
  employment: z.enum(["permanent", "contract", "probation", "intern"]).nullish(),
  userId: z.number().nullish(),
  departmentId: z.number().nullish(),
  positionId: z.number(),
});

export const employeeListSchema = z.object({
  message: z.string(),
  data: z.array(employeeSchema),
});

export const employeeDetailSchema = z.object({
  message: z.string(),
  data: employeeSchema,
});

/**
 * `GET /api/employee/my` answers without a message field and returns null for
 * both halves when the account is not linked to an employee record yet.
 */
export const myEmployeeSchema = z.object({
  data: z
    .object({
      id: z.number(),
      email: z.string(),
      name: z.string(),
      role: z.string(),
    })
    .nullish(),
  employeeData: employeeSchema.nullish(),
});

/**
 * Form input for the assign-user action.
 *
 * The backend looks the employee up by NIK plus full name, so the frontend
 * sends those straight through and does no lookup of its own. Both ids arrive
 * as numbers on the wire, so they are coerced from the form strings here.
 */
export const assignUserSchema = z.object({
  nik: z.coerce
    .number({ error: "Masukkan NIK berupa angka." })
    .int("NIK harus berupa bilangan bulat.")
    .positive("NIK harus lebih besar dari 0."),
  fullName: z
    .string()
    .trim()
    .min(1, { error: "Masukkan nama lengkap karyawan." }),
  userId: z.coerce
    .number({ error: "Masukkan id akun berupa angka." })
    .int("Id akun harus berupa bilangan bulat.")
    .positive("Id akun harus lebih besar dari 0."),
});

export type AssignUserInput = {
  nik: number;
  fullName: string;
  userId: number;
};

export type AssignUserValidationResult =
  | {
      success: true;
      data: AssignUserInput;
    }
  | {
      success: false;
      fieldErrors: AssignUserFieldErrors;
    };

/** Parse and normalize the assign-user form, still validated in the action. */
export function validateAssignUserInput(input: {
  nik: string;
  fullName: string;
  userId: string;
}): AssignUserValidationResult {
  const result = assignUserSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      fieldErrors: toFieldErrors(result.error),
    };
  }

  return { success: true, data: result.data };
}

function toFieldErrors(error: z.ZodError): AssignUserFieldErrors {
  const fieldErrors: AssignUserFieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (field === "nik" || field === "fullName" || field === "userId") {
      fieldErrors[field] ??= issue.message;
    }
  }

  return fieldErrors;
}

/**
 * Form input for the create-employee action.
 *
 * All values arrive as strings from FormData; numbers are coerced here.
 * `employment` and `departmentId` are optional — an empty string means "not set".
 */
export const createEmployeeSchema = z.object({
  nik: z.string().trim().min(1, { error: "Masukkan NIK karyawan." }),
  fullName: z
    .string()
    .trim()
    .min(1, { error: "Masukkan nama lengkap karyawan." }),
  hireDate: z.string().min(1, { error: "Masukkan tanggal bergabung." }),
  status: z.enum(["active", "on_leave", "resigned"], {
    error: "Pilih status karyawan.",
  }),
  salary: z.coerce
    .number({ error: "Masukkan gaji berupa angka." })
    .int("Gaji harus berupa bilangan bulat.")
    .positive("Gaji harus lebih besar dari 0."),
  employment: z
    .enum(["permanent", "contract", "probation", "intern"])
    .optional(),
  departmentId: z.coerce
    .number({ error: "Masukkan id departemen berupa angka." })
    .int("Id departemen harus berupa bilangan bulat.")
    .positive("Id departemen harus lebih besar dari 0.")
    .optional(),
  positionId: z.coerce
    .number({ error: "Masukkan id jabatan berupa angka." })
    .int("Id jabatan harus berupa bilangan bulat.")
    .positive("Id jabatan harus lebih besar dari 0."),
});

export type CreateEmployeeInput = {
  nik: string;
  fullName: string;
  hireDate: string;
  status: "active" | "on_leave" | "resigned";
  salary: number;
  employment?: "permanent" | "contract" | "probation" | "intern";
  departmentId?: number;
  positionId: number;
};

export type CreateEmployeeValidationResult =
  | { success: true; data: CreateEmployeeInput }
  | { success: false; fieldErrors: CreateEmployeeFieldErrors };

export function validateCreateEmployeeInput(input: {
  nik: string;
  fullName: string;
  hireDate: string;
  status: string;
  salary: string;
  employment?: string;
  departmentId?: string;
  positionId: string;
}): CreateEmployeeValidationResult {
  const result = createEmployeeSchema.safeParse({
    nik: input.nik,
    fullName: input.fullName,
    hireDate: input.hireDate,
    status: input.status,
    salary: input.salary,
    employment: input.employment || undefined,
    departmentId: input.departmentId || undefined,
    positionId: input.positionId,
  });

  if (!result.success) {
    return {
      success: false,
      fieldErrors: toCreateEmployeeFieldErrors(result.error),
    };
  }

  return { success: true, data: result.data };
}

/**
 * Form input for the update-employee action.
 *
 * Every field is optional — the backend only changes what it receives.
 * `employment` and `departmentId` use nullish so an empty string clears them.
 */
export const updateEmployeeSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, { error: "Masukkan nama lengkap karyawan." })
    .optional(),
  hireDate: z.string().min(1, { error: "Masukkan tanggal bergabung." }).optional(),
  status: z
    .enum(["active", "on_leave", "resigned"], {
      error: "Pilih status karyawan.",
    })
    .optional(),
  salary: z.coerce
    .number({ error: "Masukkan gaji berupa angka." })
    .int("Gaji harus berupa bilangan bulat.")
    .positive("Gaji harus lebih besar dari 0.")
    .optional(),
  employment: z
    .enum(["permanent", "contract", "probation", "intern"])
    .nullish(),
  departmentId: z.coerce
    .number({ error: "Masukkan id departemen berupa angka." })
    .int("Id departemen harus berupa bilangan bulat.")
    .positive("Id departemen harus lebih besar dari 0.")
    .nullish(),
  positionId: z.coerce
    .number({ error: "Masukkan id jabatan berupa angka." })
    .int("Id jabatan harus berupa bilangan bulat.")
    .positive("Id jabatan harus lebih besar dari 0.")
    .optional(),
});

export type UpdateEmployeeInput = {
  fullName?: string;
  hireDate?: string;
  status?: "active" | "on_leave" | "resigned";
  salary?: number;
  employment?: "permanent" | "contract" | "probation" | "intern" | null;
  departmentId?: number | null;
  positionId?: number;
};

export type UpdateEmployeeValidationResult =
  | { success: true; data: UpdateEmployeeInput }
  | { success: false; fieldErrors: UpdateEmployeeFieldErrors };

export function validateUpdateEmployeeInput(input: {
  fullName: string;
  hireDate: string;
  status: string;
  salary: string;
  employment?: string;
  departmentId?: string;
  positionId: string;
}): UpdateEmployeeValidationResult {
  const result = updateEmployeeSchema.safeParse({
    fullName: input.fullName || undefined,
    hireDate: input.hireDate || undefined,
    status: input.status || undefined,
    salary: input.salary || undefined,
    employment: input.employment || undefined,
    departmentId: input.departmentId || undefined,
    positionId: input.positionId || undefined,
  });

  if (!result.success) {
    return {
      success: false,
      fieldErrors: toUpdateEmployeeFieldErrors(result.error),
    };
  }

  return { success: true, data: result.data };
}

function toCreateEmployeeFieldErrors(
  error: z.ZodError,
): CreateEmployeeFieldErrors {
  const fields = [
    "nik",
    "fullName",
    "hireDate",
    "status",
    "salary",
    "employment",
    "departmentId",
    "positionId",
  ] as const;
  const fieldErrors: CreateEmployeeFieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (fields.includes(field as (typeof fields)[number])) {
      fieldErrors[field as CreateEmployeeField] ??= issue.message;
    }
  }

  return fieldErrors;
}

function toUpdateEmployeeFieldErrors(
  error: z.ZodError,
): UpdateEmployeeFieldErrors {
  const fields = [
    "fullName",
    "hireDate",
    "status",
    "salary",
    "employment",
    "departmentId",
    "positionId",
  ] as const;
  const fieldErrors: UpdateEmployeeFieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (fields.includes(field as (typeof fields)[number])) {
      fieldErrors[field as UpdateEmployeeField] ??= issue.message;
    }
  }

  return fieldErrors;
}

