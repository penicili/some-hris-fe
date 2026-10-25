import { notFound } from "next/navigation";
import BackLink from "@/components/layouts/BackLink";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { getEmployee } from "@/lib/employee/service";
import EditEmployeeForm from "./EditEmployeeForm";

type EditEmployeeProps = {
  id: string;
};

const EditEmployee = async ({ id }: EditEmployeeProps) => {
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
        <BackLink href="/karyawan/ubah">Kembali ke daftar karyawan</BackLink>
        <Alert className="mt-8" variant="destructive">
          <AlertDescription>{result.message}</AlertDescription>
        </Alert>
      </section>
    );
  }

  const { employee } = result;

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-10 md:py-14">
      <BackLink href="/karyawan/ubah">Kembali ke daftar karyawan</BackLink>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight">
          Ubah karyawan
        </h1>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Perbarui data {employee.fullName}.
      </p>

      <Card className="mt-8 max-w-2xl">
        <CardContent>
          <EditEmployeeForm employee={employee} />
        </CardContent>
      </Card>
    </section>
  );
};

export default EditEmployee;
