import { Edges } from "@/types/edges";
import { Graph } from "@/types/graph";
import { Nodes } from "@/types/nodes";

export function toGraph(n: Nodes, e: Edges, name: string): Graph {
  const g: Graph = {
    nodes: n,
    edges: e,
    nodeCount: n.length,
    edgeCount: e.length,
    name: name,
  };
  return g;
}
