import Link from "next/link";
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
        <p className="mt-4 rounded-lg border border-border bg-surface-muted px-4 py-3 text-sm text-muted-foreground">
          Sebagian menu hanya tersedia untuk akun admin, eksekutif, dan
          manajemen.
        </p>
      ) : null}

      {visibleActions.length > 0 ? (
        <ul
          className={`mt-8 grid gap-px overflow-hidden rounded-xl border border-border bg-border ${
            // One card fills the row, otherwise the trailing cell would show
            // the container background as an empty panel.
            visibleActions.length > 1 ? "sm:grid-cols-2" : ""
            }`}
        >
          {visibleActions.map((action) => (
            <li className="bg-background" key={action.href}>
              {action.ready ? (
                <Link
                  className="flex h-full flex-col p-5 transition-colors hover:bg-surface"
                  href={action.href}
                >
                  <span className="text-sm font-semibold text-foreground">
                    {action.title}
                  </span>
                  <span className="mt-2 text-sm leading-6 text-muted-foreground">
                    {action.description}
                  </span>
                </Link>
              ) : (
                <div className="flex h-full flex-col p-5">
                  <span className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    {action.title}
                    <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      Segera
                    </span>
                  </span>
                  <span className="mt-2 text-sm leading-6 text-muted-foreground">
                    {action.description}
                  </span>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 rounded-xl border border-border bg-surface px-5 py-10 text-center text-sm text-muted-foreground">
          Tidak ada menu yang tersedia untuk akun ini.
        </p>
      )}
    </section>
  );
};

export default EmployeeHub;
