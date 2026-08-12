import { Edge } from "@/types/edge";
import { Edge as PrismaEdge } from "@prisma/client";

export function toEdge(e: PrismaEdge): Edge {
  const edge: Edge = {
    id: e.edgeId,
    source: e.fromNodeId,
    target: e.toNodeId,
    data: { edgeType: e.edgeType, edgeLevel: e.edgeLevel },
  };
  return edge;
}
