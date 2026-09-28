import { getEndpoint } from "@/lib/auth/service";
import { getAuthHeaders } from "@/lib/auth/session";
import {
  employeeDetailSchema,
  employeeListSchema,
  myEmployeeSchema,
} from "./schema";
import type {
  AssignUserMutationResult,
  CreateEmployeeResult,
  EmployeeDetailResult,
  EmployeeListResult,
  MyEmployeeResult,
  UpdateEmployeeResult,
} from "./types";
import type { CreateEmployeeInput, UpdateEmployeeInput } from "./schema";


export async function getEmployees(): Promise<EmployeeListResult> {
  const endpoint = getEndpoint("/employee");

  if (!endpoint) {
    return {
      ok: false,
      status: 0,
      message: "BACKEND_URL belum dikonfigurasi.",
    };
  }

  const headers = await getAuthHeaders();

  try {
    const response = await fetch(endpoint, {
      cache: "no-store",
      headers: {
        ...headers,
        Accept: "application/json",
      },
    });

    if (response.status === 204) {
      return { ok: true, employees: [] };
    }

    if (response.status === 403) {
      return {
        ok: false,
        status: 403,
        message: "Akun ini tidak punya akses ke data karyawan.",
      };
    }

    const payload: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message: "Gagal memuat data karyawan. Coba lagi sebentar lagi.",
      };
    }

    const parsedEmployeeList = employeeListSchema.safeParse(payload);

    if (!parsedEmployeeList.success) {
      return {
        ok: false,
        status: response.status,
        message: "Format data karyawan dari server tidak dikenali.",
      };
    }

    return { ok: true, employees: parsedEmployeeList.data.data };
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Gagal memuat data karyawan. Coba lagi sebentar lagi.",
    };
  }
}

/** Reads one employee. The backend guards the id with a digits-only param. */
export async function getEmployee(id: number): Promise<EmployeeDetailResult> {
  const endpoint = getEndpoint(`/employee/${id}`);

  if (!endpoint) {
    return {
      ok: false,
      status: 0,
      message: "BACKEND_URL belum dikonfigurasi.",
    };
  }

  const headers = await getAuthHeaders();

  try {
    const response = await fetch(endpoint, {
      cache: "no-store",
      headers: {
        ...headers,
        Accept: "application/json",
      },
    });

    if (response.status === 403) {
      return {
        ok: false,
        status: 403,
        message: "Akun ini tidak punya akses ke data karyawan.",
      };
    }

    const payload: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message: "Gagal memuat data karyawan. Coba lagi sebentar lagi.",
      };
    }

    const parsedEmployee = employeeDetailSchema.safeParse(payload);

    if (!parsedEmployee.success) {
      return {
        ok: false,
        status: response.status,
        message: "Format data karyawan dari server tidak dikenali.",
      };
    }

    return { ok: true, employee: parsedEmployee.data.data };
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Gagal memuat data karyawan. Coba lagi sebentar lagi.",
    };
  }
}

/**
 * Reads the employee record linked to the signed-in account. This endpoint is
 * the only one in the module that a plain `user` role may call.
 */
export async function getMyEmployee(): Promise<MyEmployeeResult> {
  const endpoint = getEndpoint("/employee/my");

  if (!endpoint) {
    return {
      ok: false,
      status: 0,
      message: "BACKEND_URL belum dikonfigurasi.",
    };
  }

  const headers = await getAuthHeaders();

  try {
    const response = await fetch(endpoint, {
      cache: "no-store",
      headers: {
        ...headers,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message: "Gagal memuat data karyawan saya.",
      };
    }

    const payload: unknown = await response.json().catch(() => null);
    const parsedMyEmployee = myEmployeeSchema.safeParse(payload);

    if (!parsedMyEmployee.success) {
      return {
        ok: false,
        status: response.status,
        message: "Format data karyawan dari server tidak dikenali.",
      };
    }

    return {
      ok: true,
      account: parsedMyEmployee.data.data ?? null,
      employee: parsedMyEmployee.data.employeeData ?? null,
    };
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Gagal memuat data karyawan saya.",
    };
  }
}

/**
 * Links an existing user account to an existing employee record.
 *
 * The backend finds the employee by NIK plus full name, so the form values are
 * forwarded as they are. It answers 500 when the employee or the user cannot be
 * connected, which includes a user that is already linked elsewhere because
 * `Employee.userId` is unique.
 */
export async function assignUserToEmployee(input: {
  nik: number;
  fullName: string;
  userId: number;
}): Promise<AssignUserMutationResult> {
  const endpoint = getEndpoint("/employee/assignuser");

  if (!endpoint) {
    return {
      ok: false,
      status: 0,
      message: "BACKEND_URL belum dikonfigurasi.",
    };
  }

  const headers = await getAuthHeaders();

  try {
    const response = await fetch(endpoint, {
      body: JSON.stringify(input),
      cache: "no-store",
      headers: {
        ...headers,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (response.status === 403) {
      return {
        ok: false,
        status: 403,
        message: "Akun ini tidak punya akses untuk menghubungkan akun karyawan.",
      };
    }

    if (response.status === 400) {
      return {
        ok: false,
        status: 400,
        message: "Data yang dikirim tidak valid.",
      };
    }

    await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message:
          "Gagal menghubungkan akun. Pastikan NIK, nama lengkap, dan id akun sudah benar.",
      };
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Gagal menghubungkan akun. Coba lagi sebentar lagi.",
    };
  }
}

/** Creates a new employee record. */
export async function createEmployee(
  input: CreateEmployeeInput,
): Promise<CreateEmployeeResult> {
  const endpoint = getEndpoint("/employee");

  if (!endpoint) {
    return {
      ok: false,
      status: 0,
      message: "BACKEND_URL belum dikonfigurasi.",
    };
  }

  const headers = await getAuthHeaders();

  try {
    const response = await fetch(endpoint, {
      body: JSON.stringify(input),
      cache: "no-store",
      headers: {
        ...headers,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (response.status === 403) {
      return {
        ok: false,
        status: 403,
        message: "Akun ini tidak punya akses untuk menambah karyawan.",
      };
    }

    const payload: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message: "Gagal menambah karyawan. Pastikan data sudah benar.",
      };
    }

    const parsed = employeeDetailSchema.safeParse(payload);

    if (!parsed.success) {
      return {
        ok: false,
        status: response.status,
        message: "Format data karyawan dari server tidak dikenali.",
      };
    }

    return { ok: true, employee: parsed.data.data };
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Gagal menambah karyawan. Coba lagi sebentar lagi.",
    };
  }
}

/** Updates an existing employee record. */
export async function updateEmployee(
  id: number,
  input: UpdateEmployeeInput,
): Promise<UpdateEmployeeResult> {
  const endpoint = getEndpoint(`/employee/${id}`);

  if (!endpoint) {
    return {
      ok: false,
      status: 0,
      message: "BACKEND_URL belum dikonfigurasi.",
    };
  }

  const headers = await getAuthHeaders();

  try {
    const response = await fetch(endpoint, {
      body: JSON.stringify(input),
      cache: "no-store",
      headers: {
        ...headers,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
    });

    if (response.status === 403) {
      return {
        ok: false,
        status: 403,
        message: "Akun ini tidak punya akses untuk mengubah karyawan.",
      };
    }

    if (response.status === 404) {
      return {
        ok: false,
        status: 404,
        message: "Karyawan tidak ditemukan.",
      };
    }

    const payload: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message: "Gagal mengubah karyawan. Pastikan data sudah benar.",
      };
    }

    const parsed = employeeDetailSchema.safeParse(payload);

    if (!parsed.success) {
      return {
        ok: false,
        status: response.status,
        message: "Format data karyawan dari server tidak dikenali.",
      };
    }

    return { ok: true, employee: parsed.data.data };
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Gagal mengubah karyawan. Coba lagi sebentar lagi.",
    };
  }
}
