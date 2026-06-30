// db/edges/action.ts

import "server-only";
import { prisma } from "@/lib/prisma";
import { ProjectEdgeType } from "@prisma/client";

export async function getEdgeTypesByProjectID(
  projectId: string,
): Promise<ProjectEdgeType[]> {
  if (!projectId) {
    throw new Error(
      "getEdgeTypesByProjectID requires a valid projectId string",
    );
  }

  const EdgeTypes = await prisma.projectEdgeType.findMany({
    where: { projectId },
    orderBy: { edgeType: "asc" },
  });

  // Map database schema fields to match the interface definition
  return EdgeTypes;
}
