import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  // DIRECT_URL = direct connection to Supabase (port 5432)
  // Required for prisma db push / prisma migrate — pgBouncer doesn't support DDL.
  // For app queries, lib/prisma.ts uses DATABASE_URL (pgBouncer pooler, port 6543).
  datasource: {
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});
