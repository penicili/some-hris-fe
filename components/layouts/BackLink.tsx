import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type BackLinkProps = {
  href: string;
  children: React.ReactNode;
};

/** Shadcn-styled back navigation shared by the employee pages. */
export default function BackLink({ href, children }: BackLinkProps) {
  return (
    <Button asChild size="sm" variant="ghost" className="-ml-2.5 text-muted-foreground">
      <Link href={href}>
        <ArrowLeft />
        {children}
      </Link>
    </Button>
  );
}
