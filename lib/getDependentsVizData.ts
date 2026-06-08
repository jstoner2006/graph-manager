// lib/getDependents.ts
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { getFullDependents } from "@/app/db/paths/directed-transitive-closure";
import { buildReactFlowElements } from "@/lib/formatFlow";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function getDependentsVizData(id: string, nodeId: string) {
  if (!id || !nodeId) {
    throw new Error(
      "Missing required parameters: id and nodeId are both required.",
    );
  }

  console.log(
    `🔍 Graph Analysis: Analyzing dependencies for Node [${nodeId}] inside Project [${id}]`,
  );

  // 1. Run the high-performance Recursive CTE query over the local network backbone
  const rawLineageData = await getFullDependents(prisma, nodeId, id);

  // 2. Format the database flat rows into distinct React Flow node and edge maps
  const structuredGraph = buildReactFlowElements(rawLineageData);

  // 3. Return the exact memory references to the page component
  return {
    success: true,
    context: {
      id,
      startNodeId: nodeId,
    },
    metrics: {
      totalNodes: structuredGraph.nodes.length,
      totalEdges: structuredGraph.edges.length,
    },
    data: structuredGraph,
  };
}
