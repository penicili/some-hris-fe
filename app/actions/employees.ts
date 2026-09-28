"use server";

import {
  assignUserToEmployee,
  createEmployee,
  updateEmployee,
} from "@/lib/employee/service";
import {
  validateAssignUserInput,
  validateCreateEmployeeInput,
  validateUpdateEmployeeInput,
} from "@/lib/employee/schema";
import type {
  AssignUserState,
  CreateEmployeeState,
  UpdateEmployeeState,
} from "@/lib/employee/types";

/**
 * Assign User Server Action.
 *
 * Thin by design: validate the form, hand the values to the backend, and pass
 * the outcome back to the form. The backend resolves the employee from NIK plus
 * full name, so no lookup happens here.
 */
export async function assignUser(
  _previousState: AssignUserState,
  formData: FormData,
): Promise<AssignUserState> {
  const validation = validateAssignUserInput({
    fullName: readText(formData, "fullName"),
    nik: readText(formData, "nik"),
    userId: readText(formData, "userId"),
  });

  if (!validation.success) {
    return {
      status: "error",
      fieldErrors: validation.fieldErrors,
    };
  }

  const result = await assignUserToEmployee(validation.data);

  if (!result.ok) {
    return { status: "error", message: result.message };
  }

  return {
    status: "success",
    message: `Akun berhasil dihubungkan ke ${validation.data.fullName}.`,
  };
}

/**
 * Create Employee Server Action.
 *
 * Validates the form, sends the payload to the backend, and returns the
 * outcome for useActionState.
 */
export async function createEmployeeAction(
  _previousState: CreateEmployeeState,
  formData: FormData,
): Promise<CreateEmployeeState> {
  const validation = validateCreateEmployeeInput({
    nik: readText(formData, "nik"),
    fullName: readText(formData, "fullName"),
    hireDate: readText(formData, "hireDate"),
    status: readText(formData, "status"),
    salary: readText(formData, "salary"),
    employment: readText(formData, "employment"),
    departmentId: readText(formData, "departmentId"),
    positionId: readText(formData, "positionId"),
  });

  if (!validation.success) {
    return {
      status: "error",
      fieldErrors: validation.fieldErrors,
    };
  }

  const result = await createEmployee(validation.data);

  if (!result.ok) {
    return { status: "error", message: result.message };
  }

  return {
    status: "success",
    message: `Karyawan ${result.employee.fullName} berhasil ditambahkan.`,
  };
}

/**
 * Update Employee Server Action.
 *
 * Validates the form, sends the payload to the backend, and returns the
 * outcome for useActionState.
 */
export async function updateEmployeeAction(
  _previousState: UpdateEmployeeState,
  formData: FormData,
): Promise<UpdateEmployeeState> {
  const validation = validateUpdateEmployeeInput({
    fullName: readText(formData, "fullName"),
    hireDate: readText(formData, "hireDate"),
    status: readText(formData, "status"),
    salary: readText(formData, "salary"),
    employment: readText(formData, "employment"),
    departmentId: readText(formData, "departmentId"),
    positionId: readText(formData, "positionId"),
  });

  if (!validation.success) {
    return {
      status: "error",
      fieldErrors: validation.fieldErrors,
    };
  }

  const id = readText(formData, "id");
  const result = await updateEmployee(Number(id), validation.data);

  if (!result.ok) {
    return { status: "error", message: result.message };
  }

  return {
    status: "success",
    message: `Karyawan ${result.employee.fullName} berhasil diubah.`,
  };
}

function readText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}
