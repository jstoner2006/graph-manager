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
  console.log("🚂 Running: seed-ticket-to-ride.ts...");
  const { main: seedTicketToRide } = require("./seed-ticket-to-ride");
  await seedTicketToRide();
  console.log("✅ Ticket to Ride Seeding Complete.");
  console.log("--------------------------------------------");

  // 2. Execute Data Lineage Seed
  console.log("📊 Running: seed-data-lineage.ts...");
  const { main: seedDataLineage } = require("./seed-data-lineage");
  await seedDataLineage();
  console.log("✅ Data Lineage Seeding Complete.");

  console.log("--------------------------------------------");
  console.log("🏁 Master Orchestration Finished Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Orchestrator encountered a fatal error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
