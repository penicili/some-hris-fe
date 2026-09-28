import Link from "next/link";
import { notFound } from "next/navigation";
import { getEmployee } from "@/lib/employee/service";
import type { EmployeeStatus, EmploymentStatus } from "@/lib/employee/types";

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

type EmployeeDetailProps = {
  id: string;
};

/** Detail view of a single employee record. */
const EmployeeDetail = async ({ id }: EmployeeDetailProps) => {
  // The backend only accepts digits in the id param.
  const result = /^\d+$/.test(id) ? await getEmployee(Number(id)) : null;

  if (result === null) {
    notFound();
  }

  if (!result.ok) {
    if (result.status === 404) {
      notFound();
    }

    return (
      <section className="mx-auto w-full max-w-5xl px-6 py-10 md:py-14">
        <BackLink />
        <div className="mt-8 rounded-xl border border-border bg-surface px-5 py-10 text-center text-sm text-muted-foreground">
          {result.message}
        </div>
      </section>
    );
  }

  const { employee } = result;

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-10 md:py-14">
      <BackLink />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight">{employee.fullName}</h1>
        <span
          className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${statusBadgeStyles[employee.status]}`}
        >
          {statusLabels[employee.status]}
        </span>
      </div>
      <p className="mt-2 font-mono text-xs text-muted-foreground">
        NIK {employee.nik}
      </p>

      <div className="mt-6">
        <Link
          className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-surface px-4 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
          href={`/karyawan/ubah/${employee.id}`}
        >
          Ubah data
        </Link>
      </div>

      <dl className="mt-8 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
        <Field label="Tanggal bergabung">
          {formatHireDate(employee.hireDate)}
        </Field>
        <Field label="Jenis kontrak">
          {employee.employment
            ? employmentLabels[employee.employment]
            : "Belum diisi"}
        </Field>
        <Field label="Gaji">{salaryFormatter.format(employee.salary)}</Field>
        <Field label="Akun tertaut">
          {employee.userId ? `Terhubung (#${employee.userId})` : "Belum terhubung"}
        </Field>
        <Field label="ID departemen">
          {employee.departmentId ? `#${employee.departmentId}` : "Belum diisi"}
        </Field>
        <Field label="ID jabatan">
          <span className="font-mono text-xs text-muted-foreground">
            #{employee.positionId}
          </span>
        </Field>
      </dl>

      <p className="mt-4 text-xs text-muted-foreground">
        Nama departemen dan jabatan belum dikirim backend karena endpoint daftar
        karyawan tidak menyertakan relasinya.
      </p>
    </section>
  );
};

function BackLink() {
  return (
    <Link
      className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
      href="/karyawan/daftar"
    >
      <span aria-hidden="true">←</span>
      Kembali ke daftar karyawan
    </Link>
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

export default EmployeeDetail;
