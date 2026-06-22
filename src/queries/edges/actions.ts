// db/edges/action.ts

import "server-only";
import { prisma } from "@/lib/prisma";
import { Edge } from "@/types/edge";

export async function getEdgesByProjectID(projectId: string): Promise<Edge[]> {
  if (!projectId) {
    throw new Error("getEdgesByProjectID requires a valid projectId string");
  }

  const edges = await prisma.edge.findMany({
    where: { projectId },
    orderBy: { edgeName: "asc" },
  });

  // Map database schema fields to match the interface definition
  return edges;
}
