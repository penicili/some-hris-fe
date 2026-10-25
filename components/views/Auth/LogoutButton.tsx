import { LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

/** Submit the server action that clears the JWT cookie and returns to login. */
const LogoutButton = () => {
  return (
    <form action={logout}>
      <Button size="sm" type="submit" variant="outline">
        <LogOut />
        Log out
      </Button>
    </form>
  );
};

export default LogoutButton;
