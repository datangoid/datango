import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter as createTanstackRouter, RouterProvider } from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import React from "react";
import ReactDOM from "react-dom/client";
import { queryClient } from "@/integration/query-client";
import { routeTree } from "@/routeTree.gen";
import { Spinner } from "./components/ui/spinner";

export function createRouter() {
  const router = createTanstackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPendingComponent: () => <Spinner />,
    Wrap({ children }) {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    },
  });
  return router;
}
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}

const ROOT_ELEMENT_ID = "app";
const rootElement = document.getElementById(ROOT_ELEMENT_ID);
if (!rootElement) {
  throw new Error(`Root element with ID '${ROOT_ELEMENT_ID}' not found.`);
}

const router = createRouter();

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        disableTransitionOnChange
        enableSystem
        themes={["light", "dark"]}
      >
        <RouterProvider router={router} />
      </ThemeProvider>
    </React.StrictMode>
  );
}
