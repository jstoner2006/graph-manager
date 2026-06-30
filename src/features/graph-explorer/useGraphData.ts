import { useMemo, useState, useRef } from "react";
import dagre from "dagre";
// FIX 1: Corrected BFS tracking depth correctly and tracking queue visits safely
function traverse(
  startNodeId: string,
  maxDepth: number,
  map: Record<string, string[]>,
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

function layoutWithDagre(nodesBase: any[], edgesBase: any[]) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "LR", nodesep: 80, ranksep: 320 });

  nodesBase.forEach((node) => {
    g.setNode(node.id, { width: node.measured?.width ?? 180, height: 40 });
  });

  edgesBase.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  return nodesBase.map((node) => {
    const pos = g.node(node.id);
    return {
      ...node,
      position: { x: pos?.x ?? 0, y: pos?.y ?? 0 },
    };
  });
}

export function useGraphData({
  nodes,
  edges,
  selectedNodeId,
  hopsBefore,
  hopsAfter,
  selectedEdgeTypes,
  selectedNodeType,
}) {
  const dynamicAdjacency = useMemo(() => {
    const outgoing: Record<string, string[]> = {};
    const incoming: Record<string, string[]> = {};

    // 1. Filter the database edges based on your UI multi-select state
    const filteredEdges = edges.filter((edge) => {
      // If no edge types are selected, allow all edges
      if (selectedEdgeTypes.length === 0) return true;
      return selectedEdgeTypes.includes(edge.edgeType);
    });

    // 2. Dynamically build the incoming and outgoing maps from the filtered results
    filteredEdges.forEach((edge) => {
      const source = edge.fromNodeId;
      const target = edge.toNodeId;

      if (!outgoing[source]) outgoing[source] = [];
      outgoing[source].push(target);

      if (!incoming[target]) incoming[target] = [];
      incoming[target].push(source);
    });

    return { outgoing, incoming };
  }, [edges, selectedEdgeTypes]); //

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

  //console.log("visibleNodeIds", visibleNodeIds); //is populate

  const reactFlowData = useMemo(() => {
    const rfNodesBase = nodes
      .filter((n) => visibleNodeIds.has(n.nodeId))
      .map((node) => ({
        id: node.nodeId,
        data: { label: node.nodeDisplayName },
        position: { x: 0, y: 0 },
      }));

    const rfEdges: any[] = [];
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

    const layoutedNodes = layoutWithDagre(rfNodesBase, rfEdges);
    const anchorNode = layoutedNodes.find((node) => node.id === selectedNodeId);
    return { nodes: layoutedNodes, edges: rfEdges, anchorNode: anchorNode };
  }, [
    nodes,
    dynamicAdjacency,
    visibleNodeIds,
    selectedNodeId,
    selectedEdgeTypes,
  ]);

  return reactFlowData;
}
