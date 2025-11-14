import type { DrizzleClient } from "@datango/db";
import * as schema from "@datango/db/schema/auth";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getAuthConfig } from "./auth-config";

export const createAuth = (db: DrizzleClient): ReturnType<typeof betterAuth> =>
  betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      schema,
    }),
    ...getAuthConfig(),
    emailAndPassword: {
      enabled: true,
    },
  } as BetterAuthOptions);

export type BetterAuth = ReturnType<typeof createAuth>;
