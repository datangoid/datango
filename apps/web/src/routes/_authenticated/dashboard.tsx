import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { apiClient } from "@/integration/api-client";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const authData = Route.useLoaderData();
  const privateData = useQuery(apiClient.privateData.queryOptions());

  return (
    <div>
      <h1>Dashboard</h1>
      <p>API: {privateData.data?.message}</p>
      <p>User: {JSON.stringify(authData)}</p>
    </div>
  );
}
