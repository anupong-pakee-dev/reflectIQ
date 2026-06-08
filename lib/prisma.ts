import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

function createPrismaClient() {
  // DATABASE_URL = Supabase transaction pooler (pgBouncer, port 6543).
  // Use max:1 — pgBouncer already manages the real connection pool server-side,
  // and serverless functions should not hold many open connections.
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
    max: 1,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient>;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
