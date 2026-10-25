import BackLink from "@/components/layouts/BackLink";
import { Card, CardContent } from "@/components/ui/card";
import AssignUserForm from "./AssignUserForm";

const AssignUser = () => {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-10 md:py-14">
      <BackLink href="/karyawan">Kembali ke menu karyawan</BackLink>

      <h1 className="mt-6 text-2xl font-bold tracking-tight">Hubungkan akun</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
        Kaitkan akun pengguna yang sudah ada dengan data karyawan. Karyawan yang
        belum punya akun tidak bisa masuk ke aplikasi. Backend mencocokkan
        karyawan berdasarkan NIK dan nama lengkap.
      </p>

      <Card className="mt-8 max-w-xl">
        <CardContent>
          <AssignUserForm />
        </CardContent>
      </Card>
    </section>
  );
};

export default AssignUser;
