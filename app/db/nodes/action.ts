// db/nodes/action.ts
import "server-only";
import { prisma } from "@/lib/prisma";
import { Node } from "@/types/node"; // ✅ Explicit Type reference

export async function getNodesbyProjectID(
  projectId: string,
): Promise<Node[]> {
  if (!projectId) {
    throw new Error("getNodesbyProjectID requires a valid projectId string");
  }

  const rawNodes = await prisma.node.findMany({
    where: { projectId },
    orderBy: { nodeName: "asc" },
  });

  // Map database schema fields to match the interface definition
  return rawNodes.map((node) => ({
    nodeId: node.nodeId,
    nodeName: node.nodeName,
    projectId: node.projectId,
    nodeType: node.nodeType,
  }));
}
