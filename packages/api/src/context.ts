import { createAuth } from "@datango/auth";
import type { CreateDbClient } from "@datango/db";
import type { Context as HonoContext } from "hono";

export type CreateContextOptions = {
  context: HonoContext;
  db: CreateDbClient;
};

export async function createContext({ context, db }: CreateContextOptions) {
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
