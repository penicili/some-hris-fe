import BackLink from "@/components/layouts/BackLink";
import { Card, CardContent } from "@/components/ui/card";
import AddEmployeeForm from "./AddEmployeeForm";

const AddEmployee = () => {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-10 md:py-14">
      <BackLink href="/karyawan">Kembali ke menu karyawan</BackLink>

      <h1 className="mt-6 text-2xl font-bold tracking-tight">
        Tambah karyawan
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
        Daftarkan karyawan baru lengkap dengan jabatan, departemen, dan jenis
        kontrak.
      </p>

      <Card className="mt-8 max-w-2xl">
        <CardContent>
          <AddEmployeeForm />
        </CardContent>
      </Card>
    </section>
  );
};

export default AddEmployee;
