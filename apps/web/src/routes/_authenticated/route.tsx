import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppHeader } from "@/components/root/app-header";
import { AppSidebar } from "@/components/root/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context }) => {
    if (!context.authData) {
      throw redirect({
        to: "/sign-in",
        search: { redirect: window.location.pathname },
      });
    }
  },
  component: Layout,
});

function Layout() {
  const { authData } = Route.useRouteContext();

  return (
    <div className="[--header-height:calc(--spacing(18))]">
      <SidebarProvider className="flex flex-col">
        <AppHeader user={authData!.user} />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset className="pt-(--header-height)">
            <div className="flex flex-1 flex-col gap-3.5 p-3.5 pl-0">
              <div className="grid auto-rows-min gap-3.5 md:grid-cols-3">
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
              </div>
              <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
