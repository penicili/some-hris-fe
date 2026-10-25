"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { AppNavItem } from "@/lib/navigation";

type NavLinksVariant = "navbar" | "footer";

type NavLinksProps = {
  items: AppNavItem[];
  variant?: NavLinksVariant;
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

  return (
    <nav
      aria-label={variant === "footer" ? "Footer" : "Primary"}
      className={variant === "footer" ? "sm:justify-end" : "min-w-0 flex-1 overflow-x-auto"}
    >
      <ul className="flex items-center gap-1">
        {items.map((item) => {
          const active = isActive(pathname, item.href);

          return (
            <li key={item.href}>
              <Button
                asChild
                size={variant === "footer" ? "xs" : "sm"}
                variant={active ? "secondary" : "ghost"}
                className={active ? "" : "text-muted-foreground"}
              >
                <Link
                  aria-current={active ? "page" : undefined}
                  href={item.href}
                >
                  {item.label}
                </Link>
              </Button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
