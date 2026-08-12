import dagre from "dagre";
import { Graph } from "@/types/graph";

export function layoutWithDagre(graph: Graph): Graph {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "LR", nodesep: 80, ranksep: 620 });

  graph.nodes.forEach((node) => {
    g.setNode(node.id, { width: node.measured?.width ?? 180, height: 40 });
  });

  graph.edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  const nodes = graph.nodes.map((node) => {
    const pos = g.node(node.id);
    return {
      ...node,
      position: { x: pos?.x ?? 0, y: pos?.y ?? 0 },
    };
  });
  return { nodes: nodes, edges: graph.edges };
}
