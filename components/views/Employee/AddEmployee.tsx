import Link from "next/link";
import AddEmployeeForm from "./AddEmployeeForm";

const AddEmployee = () => {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-10 md:py-14">
      <Link
        className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
        href="/karyawan"
      >
        <span aria-hidden="true">←</span>
        Kembali ke menu karyawan
      </Link>

      <h1 className="mt-6 text-2xl font-bold tracking-tight">
        Tambah karyawan
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
        Daftarkan karyawan baru lengkap dengan jabatan, departemen, dan jenis
        kontrak.
      </p>

      <div className="mt-8 max-w-2xl rounded-xl border border-border bg-surface p-6">
        <AddEmployeeForm />
      </div>
    </section>
  );
};

export default AddEmployee;
