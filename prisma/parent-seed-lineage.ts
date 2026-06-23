// prisma/seed.ts
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg"; // Adaptive placeholder matching your client driver config
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

// Setup a shared Prisma instance for log messages or explicit global cleanups if needed
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🚀 Starting Master Seed Orchestrator...");
  console.log("--------------------------------------------");

  // 1. Execute Ticket to Ride Seed
  console.log("🚂 Running: child-seed-lineage-csvs.ts...");
  const { main: seedLineage } = require("./child-seed-lineage-csvs");
  await seedLineage();
  console.log("✅ Seeding data lineage completed.");
  console.log("--------------------------------------------");
}

main()
  .catch((e) => {
    console.error("❌ Orchestrator encountered a fatal error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
