import { env } from "cloudflare:workers";
import type { DrizzleClient } from "@datango/db";
import * as schema from "@datango/db/schema/auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const createAuth = (db: DrizzleClient) =>
  betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      schema,
    }),
    trustedOrigins: [env.CORS_ORIGIN],
    emailAndPassword: {
      enabled: true,
    },
    session: {
      cookieCache: {
        enabled: env.ALCHEMY_STAGE === "prod",
        maxAge: 60,
      },
    },
    basePath: "/v1/auth",
    secondaryStorage: {
      get: async (key) => {
        const value = await env.SESSIONS_KV.get(key);
        return value;
      },
      set: async (key, value, ttl) => {
        if (ttl) {
          await env.SESSIONS_KV.put(key, value, { expirationTtl: ttl });
        } else {
          await env.SESSIONS_KV.put(key, value);
        }
      },
      delete: async (key) => {
        await env.SESSIONS_KV.delete(key);
      },
    },
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    advanced: {
      defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      },
      crossSubDomainCookies: {
        enabled: env.ALCHEMY_STAGE === "prod" || env.ALCHEMY_STAGE === "staging",
        domain:
          env.ALCHEMY_STAGE === "prod"
            ? "app.datango.id"
            : env.ALCHEMY_STAGE === "staging"
              ? "staging.app.datango.id"
              : "preview.app.datango.id",
      },
    },
  });

export type BetterAuth = ReturnType<typeof createAuth>;
