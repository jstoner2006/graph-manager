import { Node, Edge } from "@xyflow/react";
import dagre from "@dagrejs/dagre";

interface LineageElement {
  nodeId: string;
  nodeName: string;
  nodeType: string;

  edgeId: string | null;
  edgeName: string | null;

  sourceNodeId: string | null;
  targetNodeId: string | null;

  depth: number;
}

export function buildDagreGraph(data: LineageElement[]) {
  const graph = new dagre.graphlib.Graph();

  graph.setGraph({
    rankdir: "RL", // Right -> left
    nodesep: 50,
    ranksep: 150,
  });

  graph.setDefaultEdgeLabel(() => ({}));

  const seenNodes = new Set<string>();

  for (const row of data) {
    if (!seenNodes.has(row.nodeId)) {
      seenNodes.add(row.nodeId);

      graph.setNode(row.nodeId, {
        width: 220,
        height: 80,
        label: row.nodeName,
        nodeType: row.nodeType,
      });
    }

    if (row.sourceNodeId && row.targetNodeId) {
      graph.setEdge(row.sourceNodeId, row.targetNodeId);
    }
  }

  dagre.layout(graph);

  return graph;
}


export function buildReactFlowElements(
  data: LineageElement[]
): {
  nodes: Node[];
  edges: Edge[];
} {
  const graph = buildDagreGraph(data);

  const nodeMap = new Map<string, Node>();
  const edgeMap = new Map<string, Edge>();

  for (const row of data) {
    if (!nodeMap.has(row.nodeId)) {
      const dagreNode = graph.node(row.nodeId);

      nodeMap.set(row.nodeId, {
        id: row.nodeId,
        type: "default",
        position: {
          x: dagreNode.x,
          y: dagreNode.y,
        },
        data: {
          label: row.nodeName,
          nodeType: row.nodeType,
        },
      });
    }

    if (
      row.edgeId &&
      row.sourceNodeId &&
      row.targetNodeId &&
      !edgeMap.has(row.edgeId)
    ) {
      edgeMap.set(row.edgeId, {
        id: row.edgeId,
        source: row.sourceNodeId,
        target: row.targetNodeId,
      });
    }
  }

  return {
    nodes: Array.from(nodeMap.values()),
    edges: Array.from(edgeMap.values()),
  };
}