import type { HTMLInputTypeAttribute } from "react";
import { Lock, Mail, UserRound, type LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthFieldProps = {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  icon: "email" | "lock" | "name";
  type?: HTMLInputTypeAttribute;
  autoComplete?: string;
  required?: boolean;
  error?: string;
};

const fieldIcons: Record<AuthFieldProps["icon"], LucideIcon> = {
  email: Mail,
  lock: Lock,
  name: UserRound,
};

export default function AuthField({
  id,
  name,
  label,
  placeholder,
  icon,
  type = "text",
  autoComplete,
  required = true,
  error,
}: AuthFieldProps) {
  const Icon = fieldIcons[icon];

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-muted-foreground">
          <Icon aria-hidden="true" className="size-5" />
        </span>
        <Input
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={error ? true : undefined}
          autoComplete={autoComplete}
          className="h-12 pl-11 text-sm"
          id={id}
          name={name}
          placeholder={placeholder}
          required={required}
          type={type}
        />
      </div>
      {error ? (
        <p
          className="text-xs text-destructive"
          id={`${id}-error`}
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
