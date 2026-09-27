"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AppNavItem } from "@/lib/navigation";

type NavLinksVariant = "navbar" | "footer";

type NavLinksProps = {
  items: AppNavItem[];
  variant?: NavLinksVariant;
};

const variantStyles: Record<
  NavLinksVariant,
  { nav: string; list: string; link: string; active: string }
> = {
  navbar: {
    nav: "min-w-0 flex-1 overflow-x-auto",
    list: "flex items-center gap-5",
    link: "whitespace-nowrap text-sm font-medium transition-colors",
    active: "text-foreground",
  },
  footer: {
    nav: "sm:justify-end",
    list: "flex flex-wrap items-center gap-x-4 gap-y-2",
    link: "whitespace-nowrap transition-colors",
    active: "text-foreground",
  },
};

function isActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function NavLinks({ items, variant = "navbar" }: NavLinksProps) {
  const pathname = usePathname();

  if (items.length === 0) {
    return null;
  }

  const styles = variantStyles[variant];

  return (
    <nav
      aria-label={variant === "footer" ? "Footer" : "Primary"}
      className={styles.nav}
    >
      <ul className={styles.list}>
        {items.map((item) => {
          const active = isActive(pathname, item.href);

          return (
            <li key={item.href}>
              <Link
                aria-current={active ? "page" : undefined}
                className={`${styles.link} ${
                  active ? styles.active : "text-muted-foreground hover:text-foreground"
                }`}
                href={item.href}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
