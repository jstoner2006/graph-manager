// app/api/projects/[projectId]/dependencies/[nodeId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg"; // Adaptive driver adapter mapping
import { PrismaClient } from "@prisma/client";
import { getFullDependents } from "@/app/db/paths/directed-transitive-closure";
import { buildReactFlowElements } from "@/lib/formatFlow"; 
//, formatGraphData } from "@/lib/dependencyAnalysis";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; nodeId: string }> },
) {
  console.log("route found");
  try {
    // Next.js extracts both parameters straight from the folder structure path
    const { id, nodeId } = await params;
    console.log(nodeId);
    if (!id || !nodeId) {
      return NextResponse.json(
        {
          error:
            "Missing required parameters: id and nodeId are both required.",
        },
        { status: 400 },
      );
    }

    console.log(
      `🔍 Graph Analysis: Analyzing dependencies for Node [${nodeId}] inside Project [${id}]`,
    );

    // 1. Run the high-performance Recursive CTE query
    // Passing both IDs secures the query execution scope
    const rawLineageData = await getFullDependents(prisma, nodeId, id);

    // 2. Format the database flat rows into distinct nodes and edges maps
    const structuredGraph = buildReactFlowElements(rawLineageData);

    // 3. Return the payload scoped cleanly by its context parameters
    return NextResponse.json({
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
    });
  } catch (error) {
    console.error("❌ Project Dependency API Error:", error);
    return NextResponse.json(
      { error: "Internal server error running scoped dependency analysis" },
      { status: 500 },
    );
  }
}
