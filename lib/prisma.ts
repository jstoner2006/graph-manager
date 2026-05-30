// lib/prisma.ts
import "server-only";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prisma: PrismaClient;

if (globalForPrisma.prisma) {
  prisma = globalForPrisma.prisma;
} else {
  // 1. Create a native PG database connection pool
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });

  // 2. Wrap it with the Prisma v7 Driver Adapter
  const adapter = new PrismaPg(pool);

  // 3. Instantiate the client passing the adapter configuration
  prisma = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
  }
}

export { prisma };
