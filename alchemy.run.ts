import alchemy from "alchemy";
import { Hyperdrive, Vite, Worker } from "alchemy/cloudflare";
import { CloudflareStateStore } from "alchemy/state";
import { config } from "dotenv";

const app = await alchemy("datango", {
  stateStore: (scope) =>
    new CloudflareStateStore(scope, {
      stateToken: alchemy.secret(process.env.ALCHEMY_STATE_TOKEN),
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
  origin: alchemy.secret(process.env.DATABASE_URL),
  dev: {
    origin: process.env.DATABASE_URL,
  },
});

export const server = await Worker("server", {
  cwd: "apps/server",
  entrypoint: "src/index.ts",
  compatibility: "node",
  bindings: {
    DATABASE: db,
    CORS_ORIGIN: process.env.CORS_ORIGIN || "",
    BETTER_AUTH_SECRET: alchemy.secret(process.env.BETTER_AUTH_SECRET),
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "",
  },
  dev: {
    port: 3000,
  },
});

export const web = await Vite("web", {
  cwd: "apps/web",
  assets: "dist",
  bindings: {
    VITE_SERVER_URL: process.env.VITE_SERVER_URL || "",
  },
  dev: {
    command: "bun run dev",
  },
});

console.log(`Web    -> ${web.url}`);
console.log(`Server -> ${server.url}`);

await app.finalize();
