import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { canManageEmployees } from "@/lib/auth/access";
import { getCurrentUser } from "@/lib/auth/session";

type ModuleAction = {
  title: string;
  description: string;
  href: string;
  /** Hidden entirely for accounts the backend would answer 403. */
  privileged: boolean;
  /** False while the target page is still to be built. */
  ready: boolean;
};

const moduleActions: ModuleAction[] = [
  {
    title: "Daftar karyawan",
    description:
      "Lihat seluruh karyawan yang tercatat beserta NIK, tanggal bergabung, dan status kepegawaian.",
    href: "/karyawan/daftar",
    privileged: true,
    ready: true,
  },
  {
    title: "Data saya",
    description:
      "Data karyawan yang terhubung dengan akun yang sedang kamu pakai.",
    href: "/karyawan/saya",
    privileged: false,
    ready: true,
  },
  {
    title: "Tambah karyawan",
    description:
      "Daftarkan karyawan baru lengkap dengan jabatan, departemen, dan jenis kontrak.",
    href: "/karyawan/tambah",
    privileged: true,
    ready: true,
  },
  {
    title: "Hubungkan akun",
    description:
      "Kaitkan akun pengguna yang sudah ada dengan data karyawan yang sebelumnya belum punya akun.",
    href: "/karyawan/hubungkan-akun",
    privileged: false,
    ready: true,
  },
  {
    title: "Ubah karyawan",
    description:
      "Perbarui data karyawan, termasuk jabatan, departemen, dan status kepegawaian.",
    href: "/karyawan/ubah",
    privileged: true,
    ready: true,
  },
];

/** Entry point of the Karyawan module: one card per backend capability. */
const EmployeeHub = async () => {
  const user = await getCurrentUser();
  const canManage = canManageEmployees(user?.role ?? "");
  // Anything behind the privileged-role guard is left out entirely, including
  // the cards that are still "Segera", so the hub only lists what the signed-in
  // account can actually reach.
  const visibleActions = moduleActions.filter(
    (action) => !action.privileged || canManage,
  );

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-10 md:py-14">
      <h1 className="text-2xl font-bold tracking-tight">Karyawan</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
        Kelola data karyawan: daftarkan karyawan baru, perbarui data, dan
        hubungkan akun pengguna dengan data karyawan.
      </p>

      {!canManage ? (
        <Alert className="mt-4">
          <AlertDescription>
            Sebagian menu hanya tersedia untuk akun admin, eksekutif, dan
            manajemen.
          </AlertDescription>
        </Alert>
      ) : null}

      {visibleActions.length > 0 ? (
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {visibleActions.map((action) => (
            <li key={action.href}>
              {action.ready ? (
                <Card className="h-full py-0 transition-colors hover:bg-muted/50">
                  <Link
                    className="flex h-full flex-col p-5"
                    href={action.href}
                  >
                    <span className="text-sm font-semibold text-foreground">
                      {action.title}
                    </span>
                    <span className="mt-2 text-sm leading-6 text-muted-foreground">
                      {action.description}
                    </span>
                  </Link>
                </Card>
              ) : (
                <Card className="h-full py-0">
                  <div className="flex h-full flex-col p-5">
                    <span className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                      {action.title}
                      <Badge variant="secondary">Segera</Badge>
                    </span>
                    <span className="mt-2 text-sm leading-6 text-muted-foreground">
                      {action.description}
                    </span>
                  </div>
                </Card>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <Card className="mt-8 px-5 py-10 text-center text-sm text-muted-foreground">
          Tidak ada menu yang tersedia untuk akun ini.
        </Card>
      )}
    </section>
  );
};

export default EmployeeHub;
