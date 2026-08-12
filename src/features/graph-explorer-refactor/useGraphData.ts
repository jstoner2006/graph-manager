import { useMemo } from "react";
import { Nodes } from "@/types/nodes";
import { Edges } from "@/types/edges";
import { Node } from "@/types/node";
import { layoutWithDagre } from "@/utils/graph.layout";
import { Graph } from "@/types/graph";

// FIX 1: Corrected BFS tracking depth correctly and tracking queue visits safely
function traverse(
  startNodeId: string,
  maxDepth: number,
  map: Record<string, string[]> /**
   *given a start node, depth, and adjacency list
   *returns all nodes within hop count
   *
   */,
) {
  const visited = new Set<string>();
  const queued = new Set<string>([startNodeId]); // Track what entered the queue to prevent cycles/duplicates
  const queue = [{ nodeId: startNodeId, depth: 0 }];

  while (queue.length > 0) {
    const current = queue.shift()!;

    // Always add to visited when extracted
    visited.add(current.nodeId);

    // Stop exploring deeper if we've reached maxDepth
    if (current.depth >= maxDepth) {
      continue;
    }

    const neighbors = map[current.nodeId] ?? [];
    for (const neighbor of neighbors) {
      if (!queued.has(neighbor)) {
        queued.add(neighbor);
        queue.push({
          nodeId: neighbor,
          depth: current.depth + 1,
        });
      }
    }
  }
  return visited;
}

type UseGraphDataProp = {
  nodes: Nodes;
  edges: Edges;
  selectedNodeId: string;
  hopsBefore: number;
  hopsAfter: number;
  selectedEdgeTypes: string[];
  selectedEdgeLevels: string[];
};

export function useGraphData(
  {
    nodes,
    edges,
    selectedNodeId,
    hopsBefore,
    hopsAfter,
    selectedEdgeTypes,
    selectedEdgeLevels,
  }: UseGraphDataProp /** returns the data needed for react
   * stores adjacency lists in dynamic adjacency
   * captures visible node list using traverse(hops, nodes, adj)
   * adds xy for nodes with dagre
   *
   */,
) {
  const dynamicAdjacency = useMemo(() => {
    const outgoing: Record<string, string[]> = {};
    const incoming: Record<string, string[]> = {};

    console.log("useGraphData:selectedEdgeLevels", selectedEdgeLevels);
    // 1. Filter the database edges based on your UI multi-select state
    const filteredEdges = edges.filter((edge) => {
      // If no edge types are selected, allow all edges
      const edgeType = edge.data?.edgeType;
      const edgeLevel = edge.data?.edgeLevel;
      return (
        edgeType !== undefined &&
        edgeLevel !== undefined &&
        selectedEdgeTypes.includes(edgeType) &&
        selectedEdgeLevels.includes(edgeLevel)
      );
    });

    // 2. Dynamically build the incoming and outgoing maps from the filtered results
    filteredEdges.forEach((edge) => {
      const source = edge.source;
      const target = edge.target;

      if (!outgoing[source]) outgoing[source] = [];
      outgoing[source].push(target);

      if (!incoming[target]) incoming[target] = [];
      incoming[target].push(source);
    });

    return { outgoing, incoming };
  }, [edges, selectedEdgeTypes, selectedEdgeLevels]); //

  const visibleNodeIds = useMemo(() => {
    if (!selectedNodeId) return new Set<string>();

    const upstream = traverse(
      selectedNodeId,
      hopsBefore,
      dynamicAdjacency.incoming,
    );
    const downstream = traverse(
      selectedNodeId,
      hopsAfter,
      dynamicAdjacency.outgoing,
    );

    return new Set([...upstream, ...downstream]);
  }, [selectedNodeId, hopsBefore, hopsAfter, dynamicAdjacency]);

  const reactFlowData = useMemo(() => {
    const rfNodesBase: Nodes = nodes
      .filter((n) => visibleNodeIds.has(n.id))
      .map((node) => ({
        id: node.id,
        data: {
          label: node.data.label,
          attributes: node.data.attributes,
          lastUpdateDts: node.data.lastUpdateDts,
          url: node.data.url,
        },

        position: { x: 0, y: 0 },
      }));

    const rfEdges: Edges = [];
    for (const sourceId in dynamicAdjacency.outgoing) {
      const targets = dynamicAdjacency.outgoing[sourceId];
      for (const targetId of targets) {
        if (visibleNodeIds.has(sourceId) && visibleNodeIds.has(targetId)) {
          rfEdges.push({
            id: `${sourceId}-${targetId}`,
            source: sourceId,
            target: targetId,
          });
        }
      }
    }
    const graph: Graph = { nodes: rfNodesBase, edges: rfEdges };
    const layedOutGraph: Graph = layoutWithDagre(graph);
    const fallbackNode: Node = {
      id: "none",
      position: { x: 0, y: 0 },
      data: {},
    };
    const anchorNode: Node =
      layedOutGraph.nodes.find((node) => node.id === selectedNodeId) ??
      fallbackNode;
    return { graph: layedOutGraph, anchorNode: anchorNode };
  }, [nodes, dynamicAdjacency, visibleNodeIds, selectedNodeId]);

  return reactFlowData;
}
