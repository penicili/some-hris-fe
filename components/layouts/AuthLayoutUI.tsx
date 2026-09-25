import Image from "next/image";
import type { ReactNode } from "react";
import Link from "next/link";
import { COMPANY_NAME } from "@/lib/config";

type AuthLayoutUIProps = {
  children: ReactNode;
  imagePosition?: "left" | "right";
  imageSrc: string;
  imageAlt: string;
};

function AuthVisual({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative min-h-[360px] overflow-hidden bg-surface-muted sm:min-h-[440px] lg:min-h-screen">
      <Image
        alt={alt}
        className="object-contain p-16 sm:p-20 lg:p-24"
        fill
        priority
        sizes="(min-width: 1024px) 50vw, 100vw"
        src={src}
      />
    </div>
  );
}

function FormPanel({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[560px] flex-col bg-surface px-6 py-7 sm:px-10 lg:min-h-screen lg:px-16 lg:py-8 xl:px-24">
      <div className="mx-auto flex w-full max-w-[470px] flex-1 flex-col">
        <div className="flex justify-end">
          <Link
            className="group inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
            href="/"
          >
            Back to home
            <span
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5"
            >
              ↗
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center py-10 lg:py-8">{children}</div>

        <p className="text-center text-xs text-muted-foreground">
          © 2026 {COMPANY_NAME}
        </p>
      </div>
    </div>
  );
}

export default function AuthLayoutUI({
  children,
  imagePosition = "left",
  imageSrc,
  imageAlt,
}: AuthLayoutUIProps) {
  const visual = <AuthVisual alt={imageAlt} src={imageSrc} />;
  const form = <FormPanel>{children}</FormPanel>;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-screen w-full max-w-[1600px] lg:grid-cols-2">
        {imagePosition === "left" ? (
          <>
            {visual}
            {form}
          </>
        ) : (
          <>
            {form}
            {visual}
          </>
        )}
      </div>
    </main>
  );
}
