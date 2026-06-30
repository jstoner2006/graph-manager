import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import * as fs from "fs/promises";
import * as path from "path";
import { parse } from "csv-parse/sync";

// Setup the Prisma 7 Driver Adapter
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface CsvNode {
  nodeName: string;
  nodeType: string;
  nodeDisplayName: string;
  url: string;
}

interface CsvEdge {
  from: string;
  to: string;
  weight: string;
  edgeType: string; // CSV values are initially strings
  edgeWeight: string;
  edgeWeightMeasure: string;
  edgeWeightUnit: string;
  edgeLevel: string;
}

export async function main() {
  console.log("Cleaning up existing database records...");

  // Clear dependent tables first to avoid foreign key constraint violations

  await prisma.project.deleteMany({});
  await prisma.projectNodeType.deleteMany({});
  await prisma.projectEdgeType.deleteMany({});
  await prisma.edge.deleteMany({});
  await prisma.node.deleteMany({});

  console.log("Database cleared. Starting seed execution...");
  console.log("🌱 Starting database seed...");

  // 1. Resolve file paths and read CSV files
  const nodesFilePath = path.join(__dirname, "data", "nodes.csv");
  const edgesFilePath = path.join(__dirname, "data", "edges.csv");

  const nodesRaw = await fs.readFile(nodesFilePath, "utf-8");
  const edgesRaw = await fs.readFile(edgesFilePath, "utf-8");

  // 2. Parse the CSVs into JS Object arrays (skipping headers)
  const parsedNodes: CsvNode[] = parse(nodesRaw, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
    // delimiter: "|",
  });
  const parsedEdges: CsvEdge[] = parse(edgesRaw, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
    //delimiter: "|",
  });

  // 3. Extract unique node and edge types dynamically to populate constraints
  const uniqueNodeTypes = Array.from(
    new Set(parsedNodes.map((n) => n.nodeType)),
  );
  const uniqueEdgeTypes = Array.from(
    new Set(parsedEdges.map((n) => n.edgeType)),
  );

  const uniqueEdgeLevels = Array.from(
    new Set(parsedEdges.map((n) => n.edgeLevel)),
  );

  // 1. Create the Project, its Allowed Types, and the Cities simultaneously
  const project = await prisma.project.create({
    data: {
      projectName: "Control Tower Data Lineage",
      projectDescription:
        "Storing the data lineage of control towers data assests as a graph for analysis.",

      // Define valid types allowed in this project
      nodeTypes: {
        create: uniqueNodeTypes.map((type) => ({ nodeType: type })),
      },
      edgeTypes: {
        create: uniqueEdgeTypes.map((type) => ({ edgeType: type })),
      },
      edgeLevels: {
        create: uniqueEdgeLevels.map((level) => ({ edgeLevel: level })),
      },

      // Create the structural nodes bound to this project
      nodes: {
        create: parsedNodes.map((node) => ({
          nodeName: node.nodeName,
          nodeType: node.nodeType,
          nodeDisplayName: node.nodeDisplayName,
          url: node.url,
        })),
      },
    },
    include: {
      nodes: true,
    },
  });

  console.log(
    `✅ Created project "${project.projectName}" with ID: ${project.projectId}`,
  );

  // 5. Map the newly generated engine primary keys to names in memory
  const nodeMap = new Map(
    project.nodes.map((node) => [node.nodeName, node.nodeId]),
  );

  const edgeDataToInsert = parsedEdges.map((edge) => {
    const fromNodeId = nodeMap.get(edge.from);
    const toNodeId = nodeMap.get(edge.to);

    if (!fromNodeId || !toNodeId) {
      throw new Error(
        `Failed to map edge. Missing ID for either "${edge.from}" or "${edge.to}". Check your CSV content integrity.`,
      );
    }

    return {
      edgeName: `${edge.from}  ${edge.edgeType} ${edge.to}`,
      projectId: project.projectId,
      edgeType: edge.edgeType,
      fromNodeId: fromNodeId,
      toNodeId: toNodeId,
      edgeWeight: parseFloat(edge.edgeWeight) ?? null, // Parse text weights to floats securely
      edgeWeightMeasure: edge.edgeWeightMeasure,
      edgeWeightUnit: edge.edgeWeightUnit,
      edgeLevel: edge.edgeLevel,
    };
  });

  // 7. Execute the transaction block
  await prisma.edge.createMany({
    data: edgeDataToInsert,
  });

  console.log(
    `Successfully appended ${edgeDataToInsert.length} data lineage records.`,
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
