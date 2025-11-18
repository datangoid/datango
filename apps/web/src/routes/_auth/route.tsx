import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";

interface LoginSearch {
  redirect?: string;
}

export const Route = createFileRoute("/_auth")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    redirect: (search.redirect as string) || undefined,
  }),
  beforeLoad: ({ context, search }) => {
    if (context.authData) {
      throw redirect({ to: search.redirect || "/" });
    }
  },
  component: Layout,
});

function Layout() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="flex w-full max-w-md flex-col">
        <CardContent className="flex w-full flex-col">
          <Outlet />
        </CardContent>
      </Card>
    </div>
  );
}
