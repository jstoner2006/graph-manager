"use client";

import { useState } from "react";
import { NodeSelectionDropdowns } from "./ShortestPathControl";
import ShortestPathDisplay from "./ShortestPathDisplay";

export default function RouteOptimizerSection({ edges, nodes }) {
  const [startNodeId, setStartNodeId] = useState("");
  const [endNodeId, setEndNodeId] = useState("");

  const handleSelectionChange = (startId: string, endId: string) => {
    setStartNodeId(startId);
    setEndNodeId(endId);
  };

  return (
    <>
      {/* 1. Collect user selections via the callback prop */}
      <NodeSelectionDropdowns
        nodeNames={nodes}
        onSelectionChange={handleSelectionChange}
      />

      {/* 2. Dynamically pass selections into the display logic */}
      {startNodeId && endNodeId ? (
        <ShortestPathDisplay
          edges={edges}
          startNodeId={startNodeId}
          endNodeId={endNodeId}
          nodes={nodes}
        />
      ) : (
        <p className="mt-4 text-gray-500">
          Select a start and end node to view the shortest path.
        </p>
      )}
    </>
  );
}
