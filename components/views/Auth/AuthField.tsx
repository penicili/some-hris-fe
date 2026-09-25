import type { HTMLInputTypeAttribute } from "react";

type AuthFieldProps = {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  icon: "email" | "lock" | "name";
  type?: HTMLInputTypeAttribute;
  autoComplete?: string;
  required?: boolean;
};

function FieldIcon({ name }: { name: AuthFieldProps["icon"] }) {
  const iconClassName = "h-5 w-5";

  if (name === "email") {
    return (
      <svg
        aria-hidden="true"
        className={iconClassName}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75A2.25 2.25 0 0 1 6 4.5h12a2.25 2.25 0 0 1 2.25 2.25v10.5A2.25 2.25 0 0 1 18 19.5H6a2.25 2.25 0 0 1-2.25-2.25V6.75Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m4.5 7.25 6.12 4.59a2.25 2.25 0 0 0 2.76 0l6.12-4.59"
        />
      </svg>
    );
  }

  if (name === "lock") {
    return (
      <svg
        aria-hidden="true"
        className={iconClassName}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 10.5V8.25a5.25 5.25 0 0 1 10.5 0v2.25"
        />
        <rect
          x="4.5"
          y="10.5"
          width="15"
          height="10"
          rx="2.25"
        />
        <path strokeLinecap="round" d="M12 14.25v2.25" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className={iconClassName}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 20.25v-1.5a3.75 3.75 0 0 0-3.75-3.75h-3a3.75 3.75 0 0 0-3.75 3.75v1.5"
      />
      <circle cx="10.5" cy="7.5" r="3.75" />
    </svg>
  );
}

export default function AuthField({
  id,
  name,
  label,
  placeholder,
  icon,
  type = "text",
  autoComplete,
  required = true,
}: AuthFieldProps) {
  return (
    <div>
      <label
        className="text-sm font-medium text-foreground"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="relative mt-2">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-muted-foreground">
          <FieldIcon name={icon} />
        </span>
        <input
          autoComplete={autoComplete}
          className="h-12 w-full rounded-xl border border-border bg-surface pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/10"
          id={id}
          name={name}
          placeholder={placeholder}
          required={required}
          type={type}
        />
      </div>
    </div>
  );
}
