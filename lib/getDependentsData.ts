import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg"; // Adaptive driver adapter mapping
import { PrismaClient } from "@prisma/client";
import { getFullDependents } from "@/app/db/paths/directed-transitive-closure";
import { formatGraphData } from "@/lib/formatGraphData";
//, formatGraphData } from "@/lib/dependencyAnalysis";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function getDependentsData(id: string, nodeId: string) {
  if (!id || !nodeId) {
    throw new Error(
      "Missing required parameters: id and nodeID are both required",
    );
  }

  console.log(
    `🔍 Graph Analysis: Analyzing dependencies for Node [${nodeId}] inside Project [${id}]`,
  );
  try {
    // 1. Run the high-performance Recursive CTE query
    const rawLineageData = await getFullDependents(prisma, nodeId, id);

    // 2. Format the database flat rows into distinct nodes and edges maps
    const structuredGraph = formatGraphData(rawLineageData);

    // 3. Return the payload matching your route's original object signature
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
  } catch (error) {
    console.error("❌ Scoped dependency analysis function error:", error);
    throw new Error("Internal server error running scoped dependency analysis");
  }
}
