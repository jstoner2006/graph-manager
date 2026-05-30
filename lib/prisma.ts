import "server-only";
import { PrismaClient } from "@prisma/client";

// Extend the NodeJS global type to prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Instantiate the client if it doesn't exist, otherwise use the existing global one
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
