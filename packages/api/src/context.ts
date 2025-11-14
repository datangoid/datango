import { env } from "cloudflare:workers";
import { createAuth } from "@datango/auth";
import { createDbClient } from "@datango/db";
import type { Context as HonoContext } from "hono";

export type CreateContextOptions = {
  context: HonoContext;
};

export async function createContext({ context }: CreateContextOptions) {
  const db = createDbClient(env.DATABASE.connectionString);
  const auth = createAuth(db);
  const session = await auth.api.getSession({
    headers: context.req.raw.headers,
  });
  return {
    db,
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
