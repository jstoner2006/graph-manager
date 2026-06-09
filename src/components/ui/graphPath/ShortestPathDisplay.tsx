"use client";

import { useMemo } from "react";
// Import your pure BFS algorithm function and interface
import {
  findShortestPath,
  PrismaEdge,
} from "@/features/shortest-path/pathfinder";

// 1. Define the structure for the node items you are passing in
interface NodeItem {
  nodeId: string;
  nodeName: string;
  projectId: string;
  nodeType: string;
}

interface ShortestPathDisplayProps {
  edges: PrismaEdge[];
  nodes: NodeItem[];
  startNodeId: string;
  endNodeId: string;
}

export default function ShortestPathDisplay({
  edges,
  nodes,
  startNodeId,
  endNodeId,
}: ShortestPathDisplayProps) {
  // 1. Memoize the path calculation
  const path = useMemo(() => {
    // Only execute the BFS traversal if both endpoints have been chosen
    if (!startNodeId || !endNodeId) return null;

    console.log("Calculating shortest path via BFS..."); // Optional: left for debugging to watch the cache hit
    return findShortestPath(edges, startNodeId, endNodeId);
  }, [edges, startNodeId, endNodeId]); // Re-runs ONLY if one of these 3 properties changes

  // 2. Clear handling of fallback UI states
  if (!startNodeId || !endNodeId) {
    return (
      <p className="status-message">
        Please select a start and end node above.
      </p>
    );
  }

  if (!path) {
    return (
      <p className="status-message error">
        No valid route exists between these two nodes.
      </p>
    );
  }

  return (
    <div className="shortest-path-results">
      <h3>Optimal Route Found</h3>

      <ol className="path-steps-list">
        {path.map((nodeId, index) => {
          // 2. Look up the actual name using the ID right before rendering
          const matchingNode = nodes.find((n) => n.nodeId === nodeId);
          console.log(matchingNode);
          const displayName = matchingNode
            ? matchingNode.nodeName
            : `Unknown Node (${nodeId})`;

          return (
            <li key={`${nodeId}-${index}`}>
              {/* 3. Render the name instead of the ID */}
              {displayName}
              {index < path.length - 1 && (
                <span className="path-arrow"> → </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
