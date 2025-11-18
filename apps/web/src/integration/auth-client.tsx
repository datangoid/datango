import type { createAuth } from "@datango/auth";
import { organizationTypeEnum } from "@datango/auth/constant";
import {
  adminClient,
  emailOTPClient,
  inferAdditionalFields,
  organizationClient,
  passkeyClient,
  twoFactorClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { queryClient } from "./query-client";

export const authClient = createAuthClient({
  baseURL: `${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_PATTERN}/auth`,
  plugins: [
    emailOTPClient(),
    inferAdditionalFields<typeof createAuth>(),
    passkeyClient(),
    twoFactorClient(),
    adminClient(),
    organizationClient({
      schema: {
        organization: {
          additionalFields: {
            description: {
              type: "string",
              input: true,
              required: false,
            },
            type: {
              type: "string",
              input: true,
              required: true,
              options: organizationTypeEnum,
            },
            status: {
              type: "boolean",
              input: true,
              required: false,
              defaultValue: true,
            },
            subscriptionPlan: {
              type: "string",
              input: true,
              required: false,
              options: "string",
            },
          },
        },
      },
    }),
  ],
});

export const { getSession } = authClient;

const SESSION_QUERY_KEY = ["auth", "session"] as const;

export async function getSessionQuery() {
  return await queryClient.ensureQueryData({
    queryKey: SESSION_QUERY_KEY,
    queryFn: async () => await getSession(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export async function refetchSessionQuery() {
  await queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEY });
  return queryClient.refetchQueries({ queryKey: SESSION_QUERY_KEY });
}
