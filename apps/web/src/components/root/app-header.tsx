import type { User } from "@datango/auth";
import { SidebarIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { AppUserDropdown } from "./app-user-dropdown";

export function AppHeader({ user }: { user: User }) {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="fixed top-0 z-50 flex h-(--header-height) w-full rounded-2xl p-3.5 pb-0">
      <div className="flex w-full items-center gap-2 rounded-lg bg-sidebar px-2.5 shadow-sm">
        <Button className="h-8 w-8" onClick={toggleSidebar} size="icon" variant="ghost">
          <SidebarIcon />
        </Button>
        <Separator className="mr-2 h-4" orientation="vertical" />
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Data Fetching</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto w-full sm:w-auto">
          <AppUserDropdown user={user} />
        </div>
      </div>
    </header>
  );
}
