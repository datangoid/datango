import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

// Only load .env files if DATABASE_URL is not already set (for local dev)
if (!process.env.DATABASE_URL) {
  dotenv.config({
    path: "../../apps/server/.env.dev",
  });
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required for database migrations");
}

export default defineConfig({
  schema: "./src/schema",
  out: "./src/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
