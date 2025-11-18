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
  origin: alchemy.secret.env.DATABASE_URL,
  dev: {
    origin: alchemy.secret.env.DATABASE_URL,
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
    ALCHEMY_STAGE: alchemy.env.ALCHEMY_STAGE,
    WEB_URL: alchemy.env.WEB_URL,
    API_URL: alchemy.env.API_URL,
    MAIN_URL: alchemy.env.MAIN_URL,
    WEB_DOMAIN: alchemy.env.WEB_DOMAIN,
    API_DOMAIN: alchemy.env.API_DOMAIN,
    MAIN_DOMAIN: alchemy.env.MAIN_DOMAIN,
    API_PATTERN: alchemy.env.API_PATTERN,
    AUTH_SECRET: alchemy.secret.env.AUTH_SECRET,
  },
  domains: [stage === "dev" ? "localhost3000.example" : alchemy.env.API_DOMAIN],
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
    VITE_WEB_DOMAIN: alchemy.env.VITE_WEB_DOMAIN,
    VITE_WEB_URL: alchemy.env.VITE_WEB_URL,
    VITE_API_URL: alchemy.env.VITE_API_URL,
    VITE_API_PATTERN: alchemy.env.VITE_API_PATTERN,
  },
  dev: {
    command: "bun run dev",
  },
  domains: [stage === "dev" ? "localhost3001.example" : alchemy.env.VITE_WEB_DOMAIN],
});
if (stage === "prod" || stage === "staging") {
  const webDomain = alchemy.env.WEB_DOMAIN;
  const apiDomain = alchemy.env.API_DOMAIN;
  const apiPattern = alchemy.env.API_PATTERN;
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
