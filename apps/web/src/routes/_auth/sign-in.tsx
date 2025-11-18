import { createFileRoute, redirect } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { SignInForm } from "@/features/auth/sign-in-form";

export const Route = createFileRoute("/_auth/sign-in")({
  validateSearch: zodValidator(
    z.object({
      redirect: fallback(z.string(), "").optional(),
    })
  ),
  beforeLoad: ({ context, search }) => {
    if (context.authData) {
      throw redirect({ to: search.redirect || "/" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const search = Route.useSearch();
  return <SignInForm search={search} />;
}
