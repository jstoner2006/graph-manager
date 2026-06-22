import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

// Setup the Prisma 7 Driver Adapter
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function main() {
  console.log("Starting seed execution (appending social network dataset)...");
  console.log("🌱 Starting database seed...");

  // 1. Create the Project, its Allowed Types, and the People simultaneously
  // NOTE: Cleanup queries removed to prevent clearing preceding seeds in your sequence.
  const project = await prisma.project.create({
    data: {
      projectName: "Social Network",
      projectDescription: "A mapping of common friends.",

      nodeTypes: {
        create: { nodeType: "Person" },
      },
      edgeTypes: {
        create: { edgeType: "Affinity" },
      },

      // Create the structural nodes bound to this project (URLs completely omitted)
      nodes: {
        create: [
          { nodeName: "Alice Smith", nodeType: "Person" },
          { nodeName: "Bob Jones", nodeType: "Person" },
          { nodeName: "Charlie Brown", nodeType: "Person" },
          { nodeName: "Diana Prince", nodeType: "Person" },
          { nodeName: "Evan Wright", nodeType: "Person" },
          { nodeName: "Fiona Gallagher", nodeType: "Person" },
          { nodeName: "George Costanza", nodeType: "Person" },
          { nodeName: "Hannah Baker", nodeType: "Person" },
          { nodeName: "Dirk Mcgurk", nodeType: "Person" },
          { nodeName: "John Smith", nodeType: "Person" },
          { nodeName: "Tina Fey", nodeType: "Person" },
          { nodeName: "Will Ferrel", nodeType: "Person" },
        ],
      },
    },
    include: {
      nodes: true,
    },
  });

  console.log(
    `✅ Created project "${project.projectName}" with ID: ${project.projectId}`,
  );

  // 2. Define relationships using a standardized measure of "Common Friends" with a layout-friendly force-directed scale
  const rawEdges = [
    { from: "Alice Smith", to: "Bob Jones", weight: 0.95 },
    { from: "Alice Smith", to: "Charlie Brown", weight: 0.4 },
    { from: "Bob Jones", to: "Charlie Brown", weight: 0.85 },
    { from: "Charlie Brown", to: "Diana Prince", weight: 0.2 },
    { from: "Diana Prince", to: "Evan Wright", weight: 0.9 },
    { from: "Evan Wright", to: "Fiona Gallagher", weight: 0.55 },
    { from: "Fiona Gallagher", to: "George Costanza", weight: 0.15 },
    { from: "George Costanza", to: "Hannah Baker", weight: 0.7 },
    { from: "Hannah Baker", to: "Alice Smith", weight: 0.6 },
    { from: "Diana Prince", to: "Alice Smith", weight: 0.75 },
    { from: "Evan Wright", to: "Bob Jones", weight: 0.3 },
    { from: "Evan Wright", to: "John Smith", weight: 0.5 },
    { from: "Evan Wright", to: "Tina Fey", weight: 0.5 },
    { from: "Evan Wright", to: "Will Ferrel", weight: 0.5 },
  ];

  // 3. Map existing project node IDs into memory
  const nodeMap = new Map(
    project.nodes.map((node) => [node.nodeName, node.nodeId]),
  );

  // 4. Process records into the exact data structure Prisma expects (URLs omitted)
  const edgeDataToInsert = rawEdges.map((edge) => {
    const fromNodeId = nodeMap.get(edge.from);
    const toNodeId = nodeMap.get(edge.to);

    if (!fromNodeId || !toNodeId) {
      throw new Error(
        `Failed to map edge. Missing ID for either "${edge.from}" or "${edge.to}".`,
      );
    }

    return {
      edgeName: `${edge.from} ➔ ${edge.to} (Common Friends)`,
      projectId: project.projectId,
      edgeType: "Affinity",
      fromNodeId: fromNodeId,
      toNodeId: toNodeId,
      edgeWeight: edge.weight,
      edgeWeightMeasure: "Common Friends", // Standardized to "Common Friends" across the entire set
      edgeWeightUnit: "count",
    };
  });

  // 5. Fire the single batch query
  await prisma.edge.createMany({
    data: edgeDataToInsert,
  });

  console.log(
    `Successfully appended ${edgeDataToInsert.length} social affinity edges.`,
  );
  console.log("🏁 Seeding complete!");
}

if (require.main === module) {
  main()
    .catch((e) => {
      console.error("❌ Seeding failed:", e);
      process.exit(1);
    })
    .finally(async () => {
      await pool.end();
    });
}
