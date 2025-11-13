import alchemy from "alchemy";
import { Hyperdrive, KVNamespace, Vite, Worker } from "alchemy/cloudflare";
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
  path: [`./.env.${stage}`, `./apps/web/.env.${stage}`, `./apps/server/.env.${stage}`],
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

const sessions = await KVNamespace("kv", {
  title: `${app.name}-${stage}-user-sessions`,
  adopt: true,
});

export const server = await Worker("server", {
  cwd: "apps/server",
  name: `${app.name}-${stage}-api`,
  entrypoint: "src/index.ts",
  compatibility: "node",
  adopt: true,
  url: false,
  bundle: {
    loader: {
      ".sql": "text",
    },
  },
  observability: {
    enabled: true,
  },
  bindings: {
    STAGE: stage,
    DATABASE: db,
    SESSIONS_KV: sessions,
    ALCHEMY_STAGE: alchemy.env.ALCHEMY_STAGE as string,
    CORS_ORIGIN: alchemy.env.CORS_ORIGIN as string,
    BETTER_AUTH_SECRET: alchemy.secret.env.BETTER_AUTH_SECRET as unknown as string,
    BETTER_AUTH_URL: alchemy.env.BETTER_AUTH_URL as string,
  },
  routes: [
    {
      pattern: alchemy.env.API_ROUTE_PATTERN as string,
      adopt: true,
    },
  ],
  domains: [alchemy.env.API_CUSTOM_DOMAIN as string],
  dev: {
    port: 3000,
  },
});

export const web = await Vite("web", {
  cwd: "apps/web",
  name: `${app.name}-${stage}-web`,
  assets: "dist",
  url: false,
  adopt: true,
  bindings: {
    ALCHEMY_STAGE: alchemy.env.ALCHEMY_STAGE as string,
    VITE_SERVER_URL: alchemy.env.VITE_SERVER_URL as string,
    VITE_WEB_URL: alchemy.env.VITE_WEB_URL as string,
  },
  dev: {
    command: "bun run dev",
  },
  domains: [alchemy.env.CUSTOM_WEB_DOMAIN as string],
});

if (stage === "prod" || stage === "staging") {
  const customDomain = alchemy.env.CUSTOM_WEB_DOMAIN as string;
  const apiPattern = alchemy.env.API_ROUTE_PATTERN as string;

  console.log(`\nDeployed to ${stage} via Alchemy:`);
  console.log(`   Web     -> https://${customDomain}`);
  console.log(`   API     -> https://${apiPattern.replace("/*", "")}`);
}

// Run this to generate wrangler.json files for local development
// Then you can run bun run dev.
// Dont forget to set your local database connection string in the wrangler.json files!
// After that you can comment this out again.
// if (stage === "dev") {
//   await WranglerJson({
//     worker: server,
//   });
// }

await app.finalize();
