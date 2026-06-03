// components/ShortestPathDisplay.tsx
import React from "react";
import { findShortestPath, PrismaEdge } from "@/lib/pathfinder";

interface ShortestPathProps {
  edges: PrismaEdge[];
  startNodeId: string;
  endNodeId: string;
}

export default async function ShortestPathDisplay({
  edges,
  startNodeId,
  endNodeId,
}: ShortestPathProps) {
  // Execute the pathfinding algorithm on the server
  const pathNodeIds = findShortestPath(edges, startNodeId, endNodeId);

  return (
    <div className="p-4 border rounded-xl bg-slate-50 dark:bg-slate-900">
      <h3 className="text-lg font-bold mb-2">Calculated Route</h3>

      {!pathNodeIds ? (
        <p className="text-red-500">
          No available route connects these cities.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            Shortest path found ({pathNodeIds.length - 1} connections):
          </p>
          <div className="flex flex-wrap items-center gap-2 font-medium">
            {pathNodeIds.map((nodeId, index) => (
              <React.Fragment key={nodeId}>
                <span className="px-3 py-1 bg-white dark:bg-slate-800 rounded-md border shadow-sm">
                  {nodeId}{" "}
                  {/* If you have names mapped, you can resolve them here */}
                </span>
                {index < pathNodeIds.length - 1 && (
                  <span className="text-slate-400">➔</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
