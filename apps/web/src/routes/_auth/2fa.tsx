import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/2fa")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_auth/2fa"!</div>;
}
