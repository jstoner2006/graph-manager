// db/edges/action.ts

import "server-only";
import { prisma } from "@/lib/prisma";
import { EdgeType } from "@/types/edgeType";

export async function getEdgeTypesByProjectID(
  projectId: string,
): Promise<EdgeType[]> {
  if (!projectId) {
    throw new Error(
      "getEdgeTypesByProjectID requires a valid projectId string",
    );
  }

  const rawEdgeTypes = await prisma.projectEdgeType.findMany({
    where: { projectId },
    orderBy: { edgeType: "asc" },
  });

  // Map database schema fields to match the interface definition
  return rawEdgeTypes.map((edge) => ({
    projectId: edge.projectId,
    edgeType: edge.edgeType,
  }));
}
