import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { SignOutButton } from "@/features/auth/components/sign-out-button";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context }) => {
    if (!context.authData) {
      throw redirect({
        to: "/auth",
      });
    }
  },
  component: Layout,
});

function Layout() {
  const { authData } = Route.useRouteContext();

  return (
    <div className="min-h-screen">
      <nav className="flex w-full justify-between border-b bg-background">
        {authData?.user.name}
        <SignOutButton />
      </nav>
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
