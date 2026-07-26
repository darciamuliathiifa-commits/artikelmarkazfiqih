import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  try {
    process.loadEnvFile(".env.local");
  } catch {
    // No .env.local (e.g. Vercel runtime already injects env vars) — ignore.
  }
}

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });
