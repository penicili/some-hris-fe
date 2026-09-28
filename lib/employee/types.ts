import type { z } from "zod";
import type { employeeSchema } from "./schema";

/** Serializable types for the employee list, safe to pass into components. */

export type Employee = z.infer<typeof employeeSchema>;

export type EmployeeStatus = Employee["status"];

export type EmploymentStatus = NonNullable<Employee["employment"]>;

export type EmployeeListResult =
  | {
      ok: true;
      employees: Employee[];
    }
  | {
      ok: false;
      status: number;
      message: string;
    };

export type EmployeeDetailResult =
  | {
      ok: true;
      employee: Employee;
    }
  | {
      ok: false;
      status: number;
      message: string;
    };

/** The signed-in account plus the employee record linked to it, if any. */
export type MyEmployeeResult =
  | {
      ok: true;
      account: {
        id: number;
        email: string;
        name: string;
        role: string;
      } | null;
      employee: Employee | null;
    }
  | {
      ok: false;
      status: number;
      message: string;
    };

export type AssignUserMutationResult =
  | { ok: true }
  | {
      ok: false;
      status: number;
      message: string;
    };

export type AssignUserField = "nik" | "fullName" | "userId";

export type AssignUserFieldErrors = Partial<Record<AssignUserField, string>>;

/** State returned by the assign-user Server Action, read via useActionState. */
export type AssignUserState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: AssignUserFieldErrors;
};

export const initialAssignUserState: AssignUserState = {
  status: "idle",
};

export type CreateEmployeeField =
  | "nik"
  | "fullName"
  | "hireDate"
  | "status"
  | "salary"
  | "employment"
  | "departmentId"
  | "positionId";

export type UpdateEmployeeField =
  | "fullName"
  | "hireDate"
  | "status"
  | "salary"
  | "employment"
  | "departmentId"
  | "positionId";

export type CreateEmployeeFieldErrors = Partial<Record<CreateEmployeeField, string>>;
export type UpdateEmployeeFieldErrors = Partial<Record<UpdateEmployeeField, string>>;

export type CreateEmployeeState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: CreateEmployeeFieldErrors;
};

export type UpdateEmployeeState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: UpdateEmployeeFieldErrors;
};

export const initialCreateEmployeeState: CreateEmployeeState = {
  status: "idle",
};

export const initialUpdateEmployeeState: UpdateEmployeeState = {
  status: "idle",
};

export type CreateEmployeeResult =
  | { ok: true; employee: Employee }
  | { ok: false; status: number; message: string };

export type UpdateEmployeeResult =
  | { ok: true; employee: Employee }
  | { ok: false; status: number; message: string };
