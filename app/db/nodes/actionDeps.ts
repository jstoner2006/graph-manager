// src/features/dependency-graph/queries.ts
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function getProjectNodesDep(projectId: string) {
  if (!projectId) throw new Error("Project ID is required.");

  console.log(
    `📡 Fetching dropdown inventory directly for Project ID: ${projectId}`,
  );

  try {
    return await prisma.node.findMany({
      where: { projectId },
      select: {
        nodeId: true,
        nodeName: true,
        nodeType: true,
      },
      orderBy: { nodeName: "asc" },
    });
  } catch (error: any) {
    console.error("❌ Nodes List Query Failure:", error);
    throw new Error(
      "Failed to fetch project mapping index directly from database",
    );
  }
}
