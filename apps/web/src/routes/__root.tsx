import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";
import React from "react";
import { ErrorBoundary } from "@/components/root/error-boundary";
import { NotFound } from "@/components/root/not-found";
import { Toaster } from "@/components/ui/sonner";
import { getSessionQuery } from "@/integration/auth-client";

export const Route = createRootRoute({
  beforeLoad: async () => {
    // TODO : Remove this if website is going to production
    const currentDomain = window.location.hostname;
    if (currentDomain === "app.datango.id" || currentDomain === "www.app.datango.id") {
      throw redirect({
        href: "https://datango.id",
      });
    }
    const authData = await getSessionQuery();
    return {
      authData: authData.data,
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
      <Outlet />
      <React.Suspense>
        <TanStackRouterDevtools position="bottom-right" />
      </React.Suspense>
      <React.Suspense>
        <TanStackQueryDevtools buttonPosition="bottom-right" />
      </React.Suspense>
    </>
  );
}
