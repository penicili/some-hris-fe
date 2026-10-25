import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DepartemenPage() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-20 md:py-28">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
          Departemen
        </h1>
        <Badge variant="secondary">Segera</Badge>
      </div>
      <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
        Modul ini sedang dalam pengembangan.
      </p>

      <Card className="mt-8 max-w-2xl">
        <CardHeader>
          <CardTitle>Modul dalam pengembangan</CardTitle>
          <CardDescription>
            Halaman ini akan menampilkan struktur departemen perusahaan setelah
            modul selesai dikerjakan.
          </CardDescription>
        </CardHeader>
      </Card>
    </section>
  );
}
