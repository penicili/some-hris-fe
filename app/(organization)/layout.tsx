import { ReactNode } from "react";
import AppLayoutUI from "@/components/layouts/AppLayoutUI";
import { requireUser } from "@/lib/auth/session";
import { HR_MODULES } from "@/lib/navigation";

export default async function OrgLayout({children} : {children: ReactNode}) {
  const user = await requireUser()

  return (
    <AppLayoutUI navItems={HR_MODULES} user={user}>
      {children}
    </AppLayoutUI>
  )
}
