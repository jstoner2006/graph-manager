// db/edges/action.ts

import "server-only";
import { prisma } from "@/lib/prisma";
import { ProjectEdgeLevel } from "@prisma/client";

export async function getEdgeLevelsByProjectID(
  projectId: string,
): Promise<ProjectEdgeLevel[]> {
  if (!projectId) {
    throw new Error(
      "getEdgeTypesByProjectID requires a valid projectId string",
    );
  }

  const rawEdgeLevels = await prisma.projectEdgeLevel.findMany({
    where: { projectId },
    orderBy: { edgeLevel: "asc" },
  });

  // Map database schema fields to match the interface definition
  return rawEdgeLevels;
}
