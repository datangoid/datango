import alchemy from "alchemy";
import { Hyperdrive, Vite, Worker } from "alchemy/cloudflare";
import { CloudflareStateStore } from "alchemy/state";
import { config } from "dotenv";

const app = await alchemy("datango", {
  stateStore: (scope) =>
    new CloudflareStateStore(scope, {
      stateToken: alchemy.secret.env.ALCHEMY_STATE_TOKEN,
    }),
});

const stage = app.stage;

config({
  path: [
    `./.env.${stage}`,
    `./apps/web/.env.${stage}`,
    `./apps/server/.env.${stage}`,
  ],
});

const db = await Hyperdrive("database", {
  name: `${app.name}-${stage}-db`,
  adopt: true,
  caching: { disabled: true },
  origin: alchemy.secret.env.DATABASE_URL as unknown as string,
  dev: {
    origin: alchemy.secret.env.DATABASE_URL as unknown as string,
  },
});

export const server = await Worker("server", {
  cwd: "apps/server",
  entrypoint: "src/index.ts",
  compatibility: "node",
  bindings: {
    DATABASE: db,
    CORS_ORIGIN: alchemy.env.CORS_ORIGIN as string,
    BETTER_AUTH_SECRET: alchemy.secret.env
      .BETTER_AUTH_SECRET as unknown as string,
    BETTER_AUTH_URL: alchemy.env.BETTER_AUTH_URL as string,
  },
  dev: {
    port: 3000,
  },
});

export const web = await Vite("web", {
  cwd: "apps/web",
  assets: "dist",
  bindings: {
    VITE_SERVER_URL: alchemy.env.VITE_SERVER_URL as string,
  },
  dev: {
    command: "bun run dev",
  },
});

console.log(`Web    -> ${web.url}`);
console.log(`API -> ${server.url}`);

await app.finalize();
