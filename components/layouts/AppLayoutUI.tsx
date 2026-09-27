import Link from "next/link";
import type { ReactNode } from "react";
import LogoutButton from "@/components/views/Auth/LogoutButton";
import NavLinks from "@/components/layouts/NavLinks";
import { COMPANY_NAME } from "@/lib/config";
import type { AppNavItem } from "@/lib/navigation";

export type { AppNavItem };

type AppLayoutUIProps = {
  children: ReactNode;
  navItems?: AppNavItem[];
  user?: {
    name: string;
    email: string;
  };
};

/** Chrome for signed-in pages: navbar, page content, footer. */
export default function AppLayoutUI({
  children,
  navItems = [],
  user,
}: AppLayoutUIProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-20 border-b border-border bg-surface">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-6 px-6 py-4">
          <Link
            className="shrink-0 text-sm font-semibold tracking-tight text-foreground"
            href="/"
          >
            HRIS
          </Link>

          <NavLinks items={navItems} />

          <div className="flex shrink-0 items-center gap-4">
            {user ? (
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium leading-tight text-foreground">
                  {user.name}
                </p>
                <p className="text-xs leading-tight text-muted-foreground">
                  {user.email}
                </p>
              </div>
            ) : null}

            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; 2026 {COMPANY_NAME}
          </p>

          <NavLinks items={navItems} variant="footer" />
        </div>
      </footer>
    </div>
  );
}
