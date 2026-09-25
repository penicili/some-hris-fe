import Link from "next/link";
import AuthLayoutUI from "@/components/layouts/AuthLayoutUI";
import AuthField from "@/components/views/Auth/AuthField";

const Login = () => {
  return (
    <AuthLayoutUI
      imageAlt="Illustration for signing in to the HRIS workspace"
      imagePosition="left"
      imageSrc="/images/login.svg"
    >
      <div className="w-full">
        <div className="mb-9">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Welcome back
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.025em] text-foreground sm:text-4xl">
            Sign in to your account
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Access your HRIS workspace and keep your team moving forward.
          </p>
        </div>

        <form action="/login" className="space-y-5">
          <AuthField
            autoComplete="email"
            id="email"
            icon="email"
            label="Email address"
            name="email"
            placeholder="you@company.com"
            type="email"
          />
          <AuthField
            autoComplete="current-password"
            id="password"
            icon="lock"
            label="Password"
            name="password"
            placeholder="Enter your password"
            type="password"
          />

          <div className="flex items-center justify-between gap-4 pt-1 text-sm">
            <label
              className="inline-flex cursor-pointer items-center gap-2 text-muted-foreground"
              htmlFor="remember"
            >
              <input
                className="size-4 rounded border-border accent-primary"
                id="remember"
                name="remember"
                type="checkbox"
              />
              Remember me
            </label>
            <Link
              className="font-medium text-primary transition-colors hover:text-primary-hover"
              href="#"
            >
              Forgot password?
            </Link>
          </div>

          <button
            className="flex h-12 w-full items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/25 focus:outline-none focus:ring-4 focus:ring-primary/20"
            type="submit"
          >
            Sign in
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            className="font-semibold text-primary transition-colors hover:text-primary-hover"
            href="/register"
          >
            Create an account
          </Link>
        </p>
      </div>
    </AuthLayoutUI>
  );
};

export default Login;
