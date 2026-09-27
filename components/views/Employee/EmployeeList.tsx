import Link from "next/link";
import { getEmployees } from "@/lib/employee/service";
import type {
  Employee,
  EmployeeStatus,
  EmploymentStatus,
} from "@/lib/employee/types";

const hireDateFormatter = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" });

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

/** Employees are fetched on the server, so the page ships no client JS. */
const EmployeeList = async () => {
  const result = await getEmployees();

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-10 md:py-14">
      <Link
        className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
        href="/karyawan"
      >
        <span aria-hidden="true">←</span>
        Kembali ke menu karyawan
      </Link>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Karyawan</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Daftar seluruh karyawan yang tercatat di perusahaan.
          </p>
        </div>

        {result.ok && result.employees.length > 0 ? (
          <p className="text-sm text-muted-foreground">
            {result.employees.length} karyawan
          </p>
        ) : null}
      </div>

      <div className="mt-8">
        {result.ok ? (
          <EmployeeTable employees={result.employees} />
        ) : (
          <Notice message={result.message} />
        )}
      </div>
    </section>
  );
};

/** Plain table: the list is read-only, so no row actions yet. */
function EmployeeTable({ employees }: { employees: Employee[] }) {
  if (employees.length === 0) {
    return <Notice message="Belum ada data karyawan." />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-surface-muted text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3 font-semibold" scope="col">
                NIK
              </th>
              <th className="px-5 py-3 font-semibold" scope="col">
                Nama
              </th>
              <th className="px-5 py-3 font-semibold" scope="col">
                Tanggal Bergabung
              </th>
              <th className="px-5 py-3 font-semibold" scope="col">
                Kontrak
              </th>
              <th className="px-5 py-3 font-semibold" scope="col">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-muted-foreground">
                  {employee.nik}
                </td>
                <td className="px-5 py-4 font-medium">
                  <Link
                    className="text-foreground transition-colors hover:text-primary"
                    href={`/karyawan/${employee.id}`}
                  >
                    {employee.fullName}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                  {formatHireDate(employee.hireDate)}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                  {employee.employment
                    ? employmentLabels[employee.employment]
                    : "—"}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${statusBadgeStyles[employee.status]}`}
                  >
                    {statusLabels[employee.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Notice({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-5 py-10 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}

function formatHireDate(value: string): string {
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? "—" : hireDateFormatter.format(date);
}

export default EmployeeList;
