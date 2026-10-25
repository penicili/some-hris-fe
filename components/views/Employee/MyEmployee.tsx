import Link from "next/link";
import BackLink from "@/components/layouts/BackLink";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  active: "border-transparent bg-primary-soft text-primary",
  on_leave: "border-transparent bg-surface-muted text-muted-foreground",
  resigned: "text-muted-foreground",
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
      <BackLink href="/karyawan">Kembali ke menu karyawan</BackLink>

      <h1 className="mt-6 text-2xl font-bold tracking-tight">Data saya</h1>

      {!result.ok ? (
        <Alert className="mt-8" variant="destructive">
          <AlertDescription>{result.message}</AlertDescription>
        </Alert>
      ) : !result.employee ? (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Akun belum terhubung</CardTitle>
            <CardDescription>
              Hubungkan lewat menu Hubungkan akun agar data payroll dan absensi
              bisa tertaut ke akun kamu.
            </CardDescription>
            <div className="mt-2">
              <Button asChild size="sm" variant="outline">
                <Link href="/karyawan/hubungkan-akun">Hubungkan akun</Link>
              </Button>
            </div>
          </CardHeader>
        </Card>
      ) : (
        <>
          {result.account ? (
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <Field label="Nama akun">{result.account.name}</Field>
              <Field label="Email">{result.account.email}</Field>
              <Field label="Peran">
                {roleLabels[result.account.role] ?? result.account.role}
              </Field>
            </div>
          ) : null}

          <EmployeeFields employee={result.employee} />
        </>
      )}
    </section>
  );
};

export function EmployeeFields({ employee }: { employee: Employee }) {
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      <Field label="NIK">
        <span className="font-mono text-xs">{employee.nik}</span>
      </Field>
      <Field label="Status">
        <Badge
          className={statusBadgeStyles[employee.status]}
          variant="outline"
        >
          {statusLabels[employee.status]}
        </Badge>
      </Field>
      <Field label="Tanggal bergabung">{formatHireDate(employee.hireDate)}</Field>
      <Field label="Jenis kontrak">
        {employee.employment ? employmentLabels[employee.employment] : "Belum diisi"}
      </Field>
      <Field label="Gaji">{salaryFormatter.format(employee.salary)}</Field>
      <Field label="ID departemen">
        {employee.departmentId ? `#${employee.departmentId}` : "Belum diisi"}
      </Field>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Card className="gap-1 py-3" size="sm">
      <CardHeader>
        <CardDescription className="text-xs uppercase tracking-wide">
          {label}
        </CardDescription>
        <CardTitle className="text-sm font-normal">{children}</CardTitle>
      </CardHeader>
    </Card>
  );
}

function formatHireDate(value: string): string {
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? "—" : hireDateFormatter.format(date);
}

export default MyEmployee;
