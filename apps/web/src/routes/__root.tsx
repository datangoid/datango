import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";
import React from "react";
import { ErrorBoundary } from "@/components/root/error-boundary";
import { NotFound } from "@/components/root/not-found";
import { Toaster } from "@/components/ui/sonner";
import { authClient } from "@/integration/auth-client";

export const Route = createRootRoute({
  beforeLoad: async () => {
    // TODO : Remove this if website is going to production
    const currentDomain = window.location.hostname;
    if (currentDomain === "app.datango.id" || currentDomain === "www.app.datango.id") {
      throw redirect({
        href: "https://datango.id",
      });
    }

    // Fetch user session globally
    const { data: authData } = await authClient.getSession();

    return {
      authData,
    };
  },
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: ErrorBoundary,
});

const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null
  : React.lazy(() =>
      import("@tanstack/react-router-devtools").then((res) => ({
        default: res.TanStackRouterDevtools,
      }))
    );

const TanStackQueryDevtools = import.meta.env.PROD
  ? () => null
  : React.lazy(() =>
      import("@tanstack/react-query-devtools").then((res) => ({
        default: res.ReactQueryDevtools,
      }))
    );

function RootComponent() {
  return (
    <>
      <Toaster />
      <div className="p-2 md:p-4">
        <Outlet />
      </div>
      <React.Suspense>
        <TanStackRouterDevtools position="bottom-right" />
      </React.Suspense>
      <React.Suspense>
        <TanStackQueryDevtools buttonPosition="bottom-left" />
      </React.Suspense>
    </>
  );
}
