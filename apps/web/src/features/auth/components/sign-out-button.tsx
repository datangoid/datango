import { LogOutIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/integration/auth-client";

interface SignOutButtonProps {
  className?: string;
  variant?: "ghost" | "outline";
  redirectTo?: string;
}

export function SignOutButton({
  className,
  variant = "ghost",
  redirectTo = "/",
}: SignOutButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const handleSignOut = async () => {
    setIsPending(true);
    await authClient.signOut({
      fetchOptions: {
        credentials: "include",
        onSuccess: () => {
          window.location.href = redirectTo;
        },
        onError: (err) => {
          console.error("Failed to sign out", err);
          setIsPending(false);
        },
      },
    });
  };

  return (
    <Button className={className} disabled={isPending} onClick={handleSignOut} variant={variant}>
      <LogOutIcon className="mr-2 size-4" />
      {isPending ? "Signing out..." : "Sign Out"}
    </Button>
  );
}
