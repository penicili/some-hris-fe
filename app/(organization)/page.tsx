import { Card, CardContent } from "@/components/ui/card";
import { HR_MODULES } from "@/lib/navigation";

/**
 * Signed-in landing page. The route group layout already validates the session
 * and renders the navbar and footer, so this page only owns its content.
 */
export default function Home() {
  return (
    <>
      <section className="mx-auto w-full max-w-5xl px-6 py-20 md:py-28">
        <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
          Human Resources Information System
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
          Portal internal untuk mengelola data karyawan, absensi, penggajian, dan
          laporan sumber daya manusia.
        </p>
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto w-full max-w-5xl px-6 py-14">
          <h2 className="text-sm font-semibold text-muted-foreground">Modul HR</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {HR_MODULES.map((module) => (
              <Card className="py-0" key={module.href}>
                <CardContent className="px-5 py-4 text-sm font-medium">
                  {module.label}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
