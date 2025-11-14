import { env } from "cloudflare:workers";
import type { BetterAuthOptions } from "better-auth";

export const getAuthConfig = (): Partial<BetterAuthOptions> => ({
  trustedOrigins: [env.WEB_URL, env.API_URL, env.MAIN_URL],
  secret: env.AUTH_SECRET,
  baseURL: env.API_URL,
  basePath: `/${env.API_PATTERN}/auth`,
  advanced: {
    cookiePrefix: getCookiePrefix(),
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
    crossSubDomainCookies: {
      enabled: env.ALCHEMY_STAGE !== "dev",
      domain: env.MAIN_DOMAIN,
    },
  },
  session: {
    cookieCache: {
      enabled: env.ALCHEMY_STAGE !== "dev",
      maxAge: 60,
    },
  },
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
});

const getCookiePrefix = (): string => {
  switch (env.ALCHEMY_STAGE) {
    case "prod":
      return "datango_";
    case "staging":
      return "datango_staging_";
    case "dev":
      return "datango_dev_";
    default:
      return "datango_preview_";
  }
};
