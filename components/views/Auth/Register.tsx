import Link from "next/link";
import AuthLayoutUI from "@/components/layouts/AuthLayoutUI";
import AuthField from "@/components/views/Auth/AuthField";

const Register = () => {
  return (
    <AuthLayoutUI
      imageAlt="Illustration for creating an HRIS account"
      imagePosition="right"
      imageSrc="/images/register.svg"
    >
      <div className="w-full">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Get started
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.025em] text-foreground sm:text-4xl">
            Create your account
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Set up your HRIS workspace and give your people a better place to
            work.
          </p>
        </div>

        <form action="/register" className="space-y-4">
          <AuthField
            autoComplete="name"
            id="name"
            icon="name"
            label="Full name"
            name="name"
            placeholder="Your full name"
          />
          <AuthField
            autoComplete="email"
            id="email"
            icon="email"
            label="Work email"
            name="email"
            placeholder="you@company.com"
            type="email"
          />
          <AuthField
            autoComplete="new-password"
            id="password"
            icon="lock"
            label="Password"
            name="password"
            placeholder="Create a password"
            type="password"
          />

          <div className="flex items-start gap-3 pt-1">
            <input
              className="mt-0.5 size-4 shrink-0 rounded border-border accent-primary"
              id="terms"
              name="terms"
              required
              type="checkbox"
            />
            <label
              className="cursor-pointer text-xs leading-5 text-muted-foreground"
              htmlFor="terms"
            >
              I agree to the Terms of Service and Privacy Policy.
            </label>
          </div>

          <button
            className="mt-1 flex h-12 w-full items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/25 focus:outline-none focus:ring-4 focus:ring-primary/20"
            type="submit"
          >
            Create account
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            className="font-semibold text-primary transition-colors hover:text-primary-hover"
            href="/login"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayoutUI>
  );
};

export default Register;
