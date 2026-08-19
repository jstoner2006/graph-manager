"use client";

import { useMemo, useState } from "react";
import { ClientGraphViz } from "./ClientGraphViz";

import { useGraphData } from "./useGraphData";
import EdgeTypeSelector from "./ui/EdgeTypeSelector";
import { NodeSelector } from "./ui/nodeSelector";
import { EdgeLevelSelector } from "./ui/EdgeLevelSelector";
import { NodeTypeSelector } from "./ui/NodeTypeSelector";

import { ProjectGraphContext } from "@/types/project-graph-context";

export default function ClientGraph({
  nodes,
  edges,
  nodeTypes,
  edgeLevels,
  edgeTypes,
}: ProjectGraphContext) {
  /**
   *
   *
   *
   */

  const [selectedNodeType, setSelectedNodeType] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState("");
  const [hopsBefore, setHopsBefore] = useState(2);
  const [hopsAfter, setHopsAfter] = useState(2);
  const [selectedEdgeLevels, setSelectedEdgeLevels] =
    useState<string[]>(edgeLevels);
  const [selectedEdgeTypes, setSelectedEdgeTypes] =
    useState<string[]>(edgeTypes);

  const availableNodes = useMemo(() => {
    if (!selectedNodeType) return nodes;
    return nodes.filter((n) => n.data.nodeType === selectedNodeType);
  }, [nodes, selectedNodeType]);

  const { graph: rfgraph, anchorNode } = useGraphData({
    nodes,
    edges,
    selectedNodeId,
    hopsBefore,
    hopsAfter,
    selectedEdgeTypes,
    selectedEdgeLevels,
  });

  //console.log(rfNodesT, rfEdgesT);
  // Handler to toggle an element into or out of the array configuration
  const handleToggleEdgeType = (edgeType: string) => {
    setSelectedEdgeTypes((prev) =>
      prev.includes(edgeType)
        ? prev.filter((t) => t !== edgeType)
        : [...prev, edgeType],
    );
  };

  return (
    <>
      <div className="flex gap-4 mb-4 text-white">
        {/* UPDATED: Multi-select Edge Type Selector */}
        <div className="flex flex-col gap-1.5">
          {" "}
          Select Edge Type
          <EdgeTypeSelector
            projectEdgeTypes={edgeTypes}
            selectedEdgeTypes={selectedEdgeTypes}
            onToggle={handleToggleEdgeType}
            onClear={() => setSelectedEdgeTypes(edgeTypes)}
          />
        </div>
        {/* Edge Level Selector */}
        <div className="flex flex-col gap-1.5">
          Select Edge Level
          <EdgeLevelSelector
            projectEdgeLevels={edgeLevels}
            selectedEdgeLevels={selectedEdgeLevels}
            onSelectEdgeLevels={setSelectedEdgeLevels}
          />
        </div>
        {/* Node Type Selector */}
        <div className="flex flex-col gap-1.5">
          Select Node Type
          <NodeTypeSelector
            nodeTypes={nodeTypes}
            selectedNodeType={selectedNodeType}
            onSelectNodeType={setSelectedNodeType}
          />
        </div>
        {/* Node Selector */}
        <div className="flex flex-col gap-1.5">
          Select Node
          <NodeSelector
            nodes={nodes}
            availableNodes={availableNodes}
            selectedNodeId={selectedNodeId}
            onSelectNodeId={setSelectedNodeId}
          />
        </div>

        {/* Hops Inputs */}
        <div className="flex flex-col items-center gap-2">
          <label className="text-xs text-zinc-400">Hops Before:</label>
          <input
            className="bg-zinc-900 text-white border border-zinc-700 px-2 py-1 rounded w-16"
            type="number"
            min={0}
            value={hopsBefore}
            onChange={(e) => setHopsBefore(Number(e.target.value))}
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <label className="text-xs text-zinc-400">Hops After:</label>
          <input
            className="bg-zinc-900 text-white border border-zinc-700 px-2 py-1 rounded w-16"
            type="number"
            min={0}
            value={hopsAfter}
            onChange={(e) => setHopsAfter(Number(e.target.value))}
          />
        </div>
      </div>
      {selectedNodeId ? (
        <ClientGraphViz
          nodes={rfgraph.nodes}
          edges={rfgraph.edges}
          anchorNode={anchorNode}
        />
      ) : (
        <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed border-zinc-800 text-zinc-500">
          Select a node from the dropdown above to view the graph.
        </div>
      )}
    </>
  );
}
