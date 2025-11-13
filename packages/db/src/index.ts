import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index";

export function createDbClient(connectionString: string): PostgresJsDatabase<typeof schema> {
  const client = postgres(connectionString, {
    max: 5,
    fetch_types: false,
  });

  return drizzle(client, { schema });
}

export type DrizzleClient = ReturnType<typeof createDbClient>;
