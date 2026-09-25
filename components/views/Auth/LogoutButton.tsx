import { logout } from "@/app/actions/auth";

/** Submit the server action that clears the JWT cookie and returns to login. */
const LogoutButton = () => {
  return (
    <form action={logout}>
      <button
        className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
        type="submit"
      >
        Log out
      </button>
    </form>
  );
};

export default LogoutButton;
