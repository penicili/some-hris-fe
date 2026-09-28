import Link from "next/link";
import { notFound } from "next/navigation";
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
        <Link
          className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
          href="/karyawan/ubah"
        >
          <span aria-hidden="true">←</span>
          Kembali ke daftar karyawan
        </Link>
        <div className="mt-8 rounded-xl border border-border bg-surface px-5 py-10 text-center text-sm text-muted-foreground">
          {result.message}
        </div>
      </section>
    );
  }

  const { employee } = result;

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-10 md:py-14">
      <Link
        className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
        href="/karyawan/ubah"
      >
        <span aria-hidden="true">←</span>
        Kembali ke daftar karyawan
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight">
          Ubah karyawan
        </h1>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Perbarui data {employee.fullName}.
      </p>

      <div className="mt-8 max-w-2xl rounded-xl border border-border bg-surface p-6">
        <EditEmployeeForm employee={employee} />
      </div>
    </section>
  );
};

export default EditEmployee;
