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

const app = new Hono<{ Bindings: Env }>().basePath("/v1");

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

app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGIN || "http://localhost:3001",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "User-Agent"],
    credentials: true,
  })
);

app.on(["POST", "GET"], "/auth/*", (c) => {
  const auth = createAuth(createDbClient(env.DATABASE.connectionString));
  return auth.handler(c.req.raw);
});

app.use("/*", async (c, next) => {
  const context = await createContext({ context: c });
  const rpcResult = await rpcHandler.handle(c.req.raw, {
    prefix: "/v1",
    context,
  });

  if (rpcResult.matched && rpcResult.response) {
    return c.newResponse(rpcResult.response.body, rpcResult.response);
  }

  await next();
});
app.use("/openapi/*", async (c, next) => {
  const context = await createContext({ context: c });
  const openapiResult = await apiHandler.handle(c.req.raw, {
    prefix: "/v1/openapi",
    context,
  });

  if (openapiResult.matched && openapiResult.response) {
    return c.newResponse(openapiResult.response.body, openapiResult.response);
  }

  await next();
});

app.get("/", (c) => c.text("OK"));

export default app;
