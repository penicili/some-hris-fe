import Link from "next/link";
import AuthLayoutUI from "@/components/layouts/AuthLayoutUI";
import RegisterForm from "@/components/views/Auth/RegisterForm";

const Register = () => {
  return (
    <AuthLayoutUI
      imageAlt="Illustration for creating an HRIS account"
      imagePosition="right"
      imageSrc="/images/register.svg"
    >
      <div className="w-full">
        <div className="mb-6">
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

        <RegisterForm />

        <p className="mt-5 text-center text-sm text-muted-foreground">
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
