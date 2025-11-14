import { env } from "cloudflare:workers";
import { createContext } from "@datango/api/context";
import { appRouter } from "@datango/api/routers/index";
import { createAuth } from "@datango/auth";
import { createDbClient } from "@datango/db";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono<{ Bindings: Env }>().basePath(`/${env.API_PATTERN}`);

const apiHandler = new OpenAPIHandler(appRouter, {
  plugins: [
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    }),
  ],
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

const rpcHandler = new RPCHandler(appRouter, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

app.use(logger());

// Global CORS for all routes
app.use(
  "/*",
  cors({
    origin: [env.WEB_URL, env.API_URL, env.MAIN_URL],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "User-Agent"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

// AUTH ROUTES
app.on(["POST", "GET"], "/auth/*", (c) => {
  const auth = createAuth(createDbClient(env.DATABASE.connectionString));
  return auth.handler(c.req.raw);
});

// RPC ROUTES
app.use("/*", async (c, next) => {
  const context = await createContext({ context: c });
  const rpcResult = await rpcHandler.handle(c.req.raw, {
    prefix: `/${env.API_PATTERN}`,
    context,
  });

  if (rpcResult.matched && rpcResult.response) {
    return c.newResponse(rpcResult.response.body, rpcResult.response);
  }

  await next();
});

// OPENAPI ROUTES
app.use("/api-reference/*", async (c, next) => {
  const context = await createContext({ context: c });
  const openapiResult = await apiHandler.handle(c.req.raw, {
    prefix: `/${env.API_PATTERN}/api-reference`,
    context,
  });

  if (openapiResult.matched && openapiResult.response) {
    return c.newResponse(openapiResult.response.body, openapiResult.response);
  }

  await next();
});

app.get("/", (c) => c.text("OK"));

export default app;
