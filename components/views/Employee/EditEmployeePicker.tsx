import Link from "next/link";
import BackLink from "@/components/layouts/BackLink";
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

/** Lists employees with links to the edit page. */
const EditEmployeePicker = async () => {
  const result = await getEmployees();

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-10 md:py-14">
      <BackLink href="/karyawan">Kembali ke menu karyawan</BackLink>

      <h1 className="mt-6 text-2xl font-bold tracking-tight">Ubah karyawan</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Pilih karyawan yang ingin diubah datanya.
      </p>

      <div className="mt-8">
        {result.ok ? (
          result.employees.length > 0 ? (
            <Card className="overflow-hidden py-0">
              <Table className="min-w-[480px]">
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="px-5 py-3 text-xs uppercase tracking-wide text-muted-foreground">
                      NIK
                    </TableHead>
                    <TableHead className="px-5 py-3 text-xs uppercase tracking-wide text-muted-foreground">
                      Nama
                    </TableHead>
                    <TableHead className="px-5 py-3 text-right text-xs uppercase tracking-wide text-muted-foreground">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="px-5 py-4 font-mono text-xs text-muted-foreground">
                        {employee.nik}
                      </TableCell>
                      <TableCell className="px-5 py-4 font-medium">
                        {employee.fullName}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-right">
                        <Button asChild className="h-auto p-0" variant="link">
                          <Link href={`/karyawan/ubah/${employee.id}`}>
                            Ubah
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          ) : (
            <Card className="px-5 py-10 text-center text-sm text-muted-foreground">
              Belum ada data karyawan.
            </Card>
          )
        ) : (
          <Card className="px-5 py-10 text-center text-sm text-muted-foreground">
            {result.message}
          </Card>
        )}
      </div>
    </section>
  );
};

export default EditEmployeePicker;
