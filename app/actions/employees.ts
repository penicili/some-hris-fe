"use server";

import { assignUserToEmployee } from "@/lib/employee/service";
import { validateAssignUserInput } from "@/lib/employee/schema";
import type { AssignUserState } from "@/lib/employee/types";

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

function readText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}
