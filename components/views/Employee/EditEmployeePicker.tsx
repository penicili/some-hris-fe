import Link from "next/link";
import { getEmployees } from "@/lib/employee/service";

/** Lists employees with links to the edit page. */
const EditEmployeePicker = async () => {
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

      <h1 className="mt-6 text-2xl font-bold tracking-tight">Ubah karyawan</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Pilih karyawan yang ingin diubah datanya.
      </p>

      <div className="mt-8">
        {result.ok ? (
          result.employees.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-border bg-surface">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-surface-muted text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-5 py-3 font-semibold" scope="col">
                        NIK
                      </th>
                      <th className="px-5 py-3 font-semibold" scope="col">
                        Nama
                      </th>
                      <th className="px-5 py-3 font-semibold" scope="col">
                        <span className="sr-only">Aksi</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {result.employees.map((employee) => (
                      <tr key={employee.id}>
                        <td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-muted-foreground">
                          {employee.nik}
                        </td>
                        <td className="px-5 py-4 font-medium">
                          {employee.fullName}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Link
                            className="text-sm font-medium text-primary transition-colors hover:text-primary-hover"
                            href={`/karyawan/ubah/${employee.id}`}
                          >
                            Ubah
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-surface px-5 py-10 text-center text-sm text-muted-foreground">
              Belum ada data karyawan.
            </div>
          )
        ) : (
          <div className="rounded-xl border border-border bg-surface px-5 py-10 text-center text-sm text-muted-foreground">
            {result.message}
          </div>
        )}
      </div>
    </section>
  );
};

export default EditEmployeePicker;
