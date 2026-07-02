"use server";
import { prisma } from "@/lib/prisma";
import { Node } from "@prisma/client";

export async function getNodesByProjectIDandNodeType(
  projectId: string,
  NodeTypes: string[],
): Promise<Node[]> {
  if (!projectId) {
    throw new Error("getNodesByProjectID requires a valid projectId string");
  }

  const whereClause: any = {
    projectId,
  };

  // 3. Only filter by edgeType if the user has actively selected specific filters.
  // If the array is empty, Prisma fetches all edge types matching the projectId.
  if (NodeTypes && NodeTypes.length > 0) {
    whereClause.nodeType = {
      in: NodeTypes,
    };
  }

  const nodes = await prisma.node.findMany({
    where: whereClause,
    orderBy: { nodeName: "asc" },
  });

  return nodes;
}
