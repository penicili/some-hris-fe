import Link from "next/link";
import { getMyEmployee } from "@/lib/employee/service";
import type {
  Employee,
  EmployeeStatus,
  EmploymentStatus,
} from "@/lib/employee/types";

const hireDateFormatter = new Intl.DateTimeFormat("id-ID", { dateStyle: "long" });

const salaryFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const statusLabels: Record<EmployeeStatus, string> = {
  active: "Aktif",
  on_leave: "Cuti",
  resigned: "Resign",
};

const statusBadgeStyles: Record<EmployeeStatus, string> = {
  active: "bg-primary-soft text-primary",
  on_leave: "bg-surface-muted text-muted-foreground",
  resigned: "border border-border bg-background text-muted-foreground",
};

const employmentLabels: Record<EmploymentStatus, string> = {
  permanent: "Permanen",
  contract: "Kontrak",
  probation: "Probasi",
  intern: "Magang",
};

const roleLabels: Record<string, string> = {
  admin: "Admin",
  executive: "Eksekutif",
  management: "Manajemen",
  user: "Pengguna",
};

/** The employee record linked to the signed-in account, if there is one. */
const MyEmployee = async () => {
  const result = await getMyEmployee();

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-10 md:py-14">
      <Link
        className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
        href="/karyawan"
      >
        <span aria-hidden="true">←</span>
        Kembali ke menu karyawan
      </Link>

      <h1 className="mt-6 text-2xl font-bold tracking-tight">Data saya</h1>

      {!result.ok ? (
        <div className="mt-8 rounded-xl border border-border bg-surface px-5 py-10 text-center text-sm text-muted-foreground">
          {result.message}
        </div>
      ) : !result.employee ? (
        <div className="mt-8 rounded-xl border border-border bg-surface px-5 py-10 text-center">
          <p className="text-sm text-foreground">
            Akun ini belum terhubung dengan data karyawan.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Hubungkan lewat menu Hubungkan akun agar data payroll dan absensi
            bisa tertaut ke akun kamu.
          </p>
        </div>
      ) : (
        <>
          {result.account ? (
            <dl className="mt-8 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
              <Field label="Nama akun">{result.account.name}</Field>
              <Field label="Email">{result.account.email}</Field>
              <Field label="Peran">
                {roleLabels[result.account.role] ?? result.account.role}
              </Field>
            </dl>
          ) : null}

          <EmployeeFields employee={result.employee} />
        </>
      )}
    </section>
  );
};

export function EmployeeFields({ employee }: { employee: Employee }) {
  return (
    <dl className="mt-4 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
      <Field label="NIK">
        <span className="font-mono text-xs">{employee.nik}</span>
      </Field>
      <Field label="Status">
        <span
          className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${statusBadgeStyles[employee.status]}`}
        >
          {statusLabels[employee.status]}
        </span>
      </Field>
      <Field label="Tanggal bergabung">{formatHireDate(employee.hireDate)}</Field>
      <Field label="Jenis kontrak">
        {employee.employment ? employmentLabels[employee.employment] : "Belum diisi"}
      </Field>
      <Field label="Gaji">{salaryFormatter.format(employee.salary)}</Field>
      <Field label="ID departemen">
        {employee.departmentId ? `#${employee.departmentId}` : "Belum diisi"}
      </Field>
    </dl>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-background px-5 py-4">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1.5 text-sm text-foreground">{children}</dd>
    </div>
  );
}

function formatHireDate(value: string): string {
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? "—" : hireDateFormatter.format(date);
}

export default MyEmployee;
