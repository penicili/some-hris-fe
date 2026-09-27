import { z } from "zod";
import type { AssignUserFieldErrors } from "./types";

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

