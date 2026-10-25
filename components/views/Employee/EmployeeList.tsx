import Link from "next/link";
import BackLink from "@/components/layouts/BackLink";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

/** Employees are fetched on the server, so the page ships no client JS. */
const EmployeeList = async () => {
  const result = await getEmployees();

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-10 md:py-14">
      <BackLink href="/karyawan">Kembali ke menu karyawan</BackLink>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Karyawan</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Daftar seluruh karyawan yang tercatat di perusahaan.
          </p>
        </div>

        {result.ok && result.employees.length > 0 ? (
          <Badge variant="secondary">{result.employees.length} karyawan</Badge>
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
    <Card className="overflow-hidden py-0">
      <Table className="min-w-[640px]">
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="px-5 py-3 text-xs uppercase tracking-wide text-muted-foreground">
              NIK
            </TableHead>
            <TableHead className="px-5 py-3 text-xs uppercase tracking-wide text-muted-foreground">
              Nama
            </TableHead>
            <TableHead className="px-5 py-3 text-xs uppercase tracking-wide text-muted-foreground">
              Tanggal Bergabung
            </TableHead>
            <TableHead className="px-5 py-3 text-xs uppercase tracking-wide text-muted-foreground">
              Kontrak
            </TableHead>
            <TableHead className="px-5 py-3 text-xs uppercase tracking-wide text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="px-5 py-3 text-right text-xs uppercase tracking-wide text-muted-foreground">
              Aksi
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell className="px-5 py-4 font-mono text-xs text-muted-foreground">
                {employee.nik}
              </TableCell>
              <TableCell className="px-5 py-4 font-medium">
                <Link
                  className="text-foreground transition-colors hover:text-primary"
                  href={`/karyawan/${employee.id}`}
                >
                  {employee.fullName}
                </Link>
              </TableCell>
              <TableCell className="px-5 py-4 text-muted-foreground">
                {formatHireDate(employee.hireDate)}
              </TableCell>
              <TableCell className="px-5 py-4 text-muted-foreground">
                {employee.employment
                  ? employmentLabels[employee.employment]
                  : "—"}
              </TableCell>
              <TableCell className="px-5 py-4">
                <Badge
                  className={statusBadgeStyles[employee.status]}
                  variant="outline"
                >
                  {statusLabels[employee.status]}
                </Badge>
              </TableCell>
              <TableCell className="px-5 py-4 text-right">
                <Button asChild className="h-auto p-0" variant="link">
                  <Link href={`/karyawan/ubah/${employee.id}`}>Ubah</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

function Notice({ message }: { message: string }) {
  return (
    <Card className="px-5 py-10 text-center text-sm text-muted-foreground">
      {message}
    </Card>
  );
}

function formatHireDate(value: string): string {
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? "—" : hireDateFormatter.format(date);
}

export default EmployeeList;
