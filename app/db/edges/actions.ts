// db/edges/action.ts

import "server-only";
import { prisma } from "@/lib/prisma";
import { Edge } from "@/types/edge";

export async function getEdgesByProjectID(
  projectId: string,
): Promise<Edge[]> {
  if (!projectId) {
    throw new Error("getEdgesByProjectID requires a valid projectId string");
  }

  const rawEdges = await prisma.edge.findMany({
    where: { projectId },
    orderBy: { edgeName: "asc" },
  });

  // Map database schema fields to match the interface definition
  return rawEdges.map((edge) => ({
    edgeId: edge.edgeId,
    edgeName: edge.edgeName,
    projectId: edge.projectId,
    edgeType: edge.edgeType,
    fromNodeId: edge.fromNodeId,
    toNodeId: edge.toNodeId,
  }));
}