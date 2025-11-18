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
