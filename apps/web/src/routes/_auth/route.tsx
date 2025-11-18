import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ModeToggle } from "@/components/root/mode-toggle";
import { Card, CardContent } from "@/components/ui/card";

interface LoginSearch {
  redirect?: string;
}

export const Route = createFileRoute("/_auth")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    redirect: (search.redirect as string) || undefined,
  }),
  component: Layout,
});

function Layout() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="fixed inset-x-0 top-0 z-50 flex select-none justify-center">
        <div className="mx-auto w-full max-w-7xl rounded-b-2xl bg-sidebar px-4 shadow-sm md:px-8">
          <nav className="flex items-center justify-between py-2">
            <div className="flex min-w-[30%] items-center gap-1.5">
              <img
                alt="Datango Logo"
                className="h-8 w-8"
                height={200}
                src="/logo.png"
                width={200}
              />
              <span className="font-semibold text-lg">Datango</span>
            </div>
            <div className="flex min-w-[30%] items-center justify-end gap-2">
              <ModeToggle />
            </div>
          </nav>
        </div>
      </header>
      <main className="container mx-auto max-w-7xl flex-1 py-8 pt-14 sm:px-4 md:px-0">
        <div className="flex min-h-[calc(100vh-140px)] w-full items-start justify-center py-8 sm:items-center sm:px-4">
          <Card className="flex w-full max-w-md flex-col">
            <CardContent className="flex w-full flex-col">
              <Outlet />
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="z-10 m-auto w-full max-w-7xl rounded-t-2xl bg-sidebar py-[7px] text-center text-muted-foreground text-sm shadow-sm">
        © 2025 <a href="https://datango.id">Datango</a>. All rights reserved.
      </footer>
    </div>
  );
}
