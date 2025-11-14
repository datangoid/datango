import alchemy from "alchemy";
import { Hyperdrive, KVNamespace, Vite, Worker } from "alchemy/cloudflare";
import { CloudflareStateStore } from "alchemy/state";
import { config } from "dotenv";

const app = await alchemy("datango", {
  stateStore: (scope) => new CloudflareStateStore(scope),
});

const stage = app.stage;

config({
  path: [`./.env.${stage}`, `./apps/web/.env.${stage}`, `./apps/server/.env.${stage}`],
});

// Create a Neon branch for pull requests (WARNING: Experimental feature)
// if (process.env.PULL_REQUEST) {
//   const branch = await NeonBranch("neon-branch", {
//     name: `preview-pr-${process.env.PULL_REQUEST}`,
//     project: app.name,
//     parentBranch: "development",
//     endpoints: [{ type: "read_write" }],
//   });
// }

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
    DATABASE: db,
    SESSIONS_KV: sessions,
    ALCHEMY_STAGE: alchemy.env.ALCHEMY_STAGE as string,
    WEB_URL: alchemy.env.WEB_URL as string,
    API_URL: alchemy.env.API_URL as string,
    MAIN_URL: alchemy.env.MAIN_URL as string,
    WEB_DOMAIN: alchemy.env.WEB_DOMAIN as string,
    API_DOMAIN: alchemy.env.API_DOMAIN as string,
    MAIN_DOMAIN: alchemy.env.MAIN_DOMAIN as string,
    API_PATTERN: alchemy.env.API_PATTERN as string,
    AUTH_SECRET: alchemy.secret.env.AUTH_SECRET as unknown as string,
  },
  domains: [stage === "dev" ? "localhost3000.example" : (alchemy.env.API_DOMAIN as string)],
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
    VITE_WEB_DOMAIN: alchemy.env.VITE_WEB_DOMAIN as string,
    VITE_WEB_URL: alchemy.env.VITE_WEB_URL as string,
    VITE_API_URL: alchemy.env.VITE_API_URL as string,
    VITE_API_PATTERN: alchemy.env.VITE_API_PATTERN as string,
  },
  dev: {
    command: "bun run dev",
  },
  domains: [stage === "dev" ? "localhost3001.example" : (alchemy.env.VITE_WEB_DOMAIN as string)],
});
if (stage === "prod" || stage === "staging") {
  const webDomain = alchemy.env.WEB_DOMAIN as string;
  const apiDomain = alchemy.env.API_DOMAIN as string;
  const apiPattern = alchemy.env.API_PATTERN as string;
  console.log(`\nDeployed to ${stage} via Alchemy:`);
  console.log(`   Web     -> https://${webDomain}`);
  console.log(`   API     -> https://${apiDomain}/${apiPattern}`);
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
