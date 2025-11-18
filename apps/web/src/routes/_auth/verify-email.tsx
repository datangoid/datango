import { createFileRoute, redirect } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import VerifyEmail from "@/features/auth/verify-email";

export const Route = createFileRoute("/_auth/verify-email")({
  validateSearch: zodValidator(
    z.object({
      redirect: fallback(z.string(), "").optional(),
      email: z.email(),
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
  return <VerifyEmail search={search} />;
}
