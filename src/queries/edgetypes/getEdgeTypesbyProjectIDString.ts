// db/edges/action.ts

import "server-only";
import { prisma } from "@/lib/prisma";
import { ProjectEdgeType } from "@prisma/client";

export async function getEdgeTypesByProjectIDString(
  projectId: string,
): Promise<string[]> {
  if (!projectId) {
    throw new Error(
      "getEdgeTypesByProjectID requires a valid projectId string",
    );
  }

  const EdgeTypes = await prisma.projectEdgeType.findMany({
    where: { projectId },
    orderBy: { edgeType: "asc" },
  });
  const stringEdgeTypes = EdgeTypes.map((t) => t.edgeType);

  // Map database schema fields to match the interface definition
  return stringEdgeTypes;
}
