import { Node } from "@/types/node";
import { Node as PrismaNode } from "@prisma/client";

export function toNode(n: PrismaNode): Node {
  const node: Node = {
    id: n.nodeId,
    position: { x: 0, y: 0 },
    data: {
      label: n.nodeDisplayName,
      url: n.url,
      nodeType: n.nodeType,
      fullNodeName: n.nodeName,
      lastUpdateDts: n.last_update_dts,
      attributes: n.attributes,
    },
  };
  return node;
}
