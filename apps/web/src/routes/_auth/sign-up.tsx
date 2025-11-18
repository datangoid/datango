import { createFileRoute } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { SignUpForm } from "@/features/auth/sign-up-form";

export const Route = createFileRoute("/_auth/sign-up")({
  validateSearch: zodValidator(
    z.object({
      redirect: fallback(z.string(), "").optional(),
    })
  ),
  component: RouteComponent,
});

function RouteComponent() {
  const search = Route.useSearch();
  return <SignUpForm search={search} />;
}
