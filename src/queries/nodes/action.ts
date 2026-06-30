// db/nodes/action.ts
import "server-only";
import { prisma } from "@/lib/prisma";

import { Node } from "@prisma/client";

export async function getNodesbyProjectID(projectId: string): Promise<Node[]> {
  if (!projectId) {
    throw new Error("getNodesbyProjectID requires a valid projectId string");
  }

  const nodes = await prisma.node.findMany({
    where: { projectId },
    distinct: ["nodeName"],
    orderBy: { nodeName: "asc" },
  });

  // Map database schema fields to match the interface definition
  return nodes;
}

export async function getNodeIdbyNodeNameProject(
  nodeId: string,
  projectId: string,
): Promise<Node[]> {
  if (!nodeId || !projectId) {
    throw new Error(
      "getNodeIdbyNodeNameProject requires a valid projectId and node name",
    );
  }

  const Nodes = await prisma.node.findMany({
    where: { nodeId, projectId },
    orderBy: { nodeName: "asc" },
  });

  // Map database schema fields to match the interface definition
  return Nodes;
}
