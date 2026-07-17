// db/edges/action.ts

import "server-only";
import { prisma } from "@/lib/prisma";
import { ProjectEdgeLevel } from "@prisma/client";

export async function getEdgeLevelsByProjectIDString(
  projectId: string,
): Promise<string[]> {
  if (!projectId) {
    throw new Error(
      "getEdgeTypesByProjectID requires a valid projectId string",
    );
  }

  const rawEdgeLevels = await prisma.projectEdgeLevel.findMany({
    where: { projectId },
    orderBy: { edgeLevel: "asc" },
  });
  const stringEdgeLevels = rawEdgeLevels.map((level) => level.edgeLevel);

  // Map database schema fields to match the interface definition
  return stringEdgeLevels;
}
