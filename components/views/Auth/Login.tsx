import Link from "next/link";
import AuthLayoutUI from "@/components/layouts/AuthLayoutUI";
import LoginForm from "@/components/views/Auth/LoginForm";

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

        <LoginForm />

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
