import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { authClient, refetchSessionQuery } from "@/integration/auth-client";

export function LogoutButton({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  return (
    <button
      className="w-full"
      onClick={async () => {
        await authClient.signOut({
          fetchOptions: {
            onSuccess: async () => {
              toast.success("Berhasil logout");
              await refetchSessionQuery();
              navigate({
                to: "/sign-in",
              });
            },
          },
        });
      }}
      type="button"
    >
      {children}
    </button>
  );
}
