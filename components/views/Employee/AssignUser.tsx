import Link from "next/link";
import AssignUserForm from "./AssignUserForm";

const AssignUser = () => {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-10 md:py-14">
      <Link
        className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
        href="/karyawan"
      >
        <span aria-hidden="true">←</span>
        Kembali ke menu karyawan
      </Link>

      <h1 className="mt-6 text-2xl font-bold tracking-tight">Hubungkan akun</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
        Kaitkan akun pengguna yang sudah ada dengan data karyawan. Karyawan yang
        belum punya akun tidak bisa masuk ke aplikasi. Backend mencocokkan
        karyawan berdasarkan NIK dan nama lengkap.
      </p>

      <div className="mt-8 max-w-xl rounded-xl border border-border bg-surface p-6">
        <AssignUserForm />
      </div>
    </section>
  );
};

export default AssignUser;
