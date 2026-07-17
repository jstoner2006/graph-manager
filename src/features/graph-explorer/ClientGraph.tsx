"use client";

import { useMemo, useState, useRef } from "react";
import { ClientGraphViz } from "./ClientGraphViz";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ProjectEdgeLevel } from "@prisma/client";
import dagre from "dagre";
import { ProjectEdgeType } from "@prisma/client";
import { Node } from "@prisma/client";
import { Edge } from "@/types/edge";
import { useGraphData } from "./useGraphData";
import EdgeTypeSelector from "./ui/EdgeTypeSelector";
import { NodeSelector } from "./ui/nodeSelector";
import { EdgeLevelSelector } from "./ui/EdgeLevelSelector";
import { NodeTypeSelector } from "./ui/NodeTypeSelector";

type NodeType = { projectId: string; nodeType: string };

type GraphAdjacency = {
  outgoing: Record<string, string[]>;
  incoming: Record<string, string[]>;
};
type Props = {
  nodes: Node[];
  edges: Edge[];
  nodeTypes: NodeType[];
  adjacency: GraphAdjacency;
  ProjectEdgeLevels: string[];
  projectEdgeTypes: string[];
};

export default function ClientGraph({
  nodes,
  edges,
  nodeTypes,
  adjacency,
  ProjectEdgeLevels,
  projectEdgeTypes,
}: Props) {
  /**
   *
   *
   *
   */

  const commandListRef = useRef<HTMLDivElement>(null);

  const [selectedNodeType, setSelectedNodeType] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState("");
  const [hopsBefore, setHopsBefore] = useState(2);
  const [hopsAfter, setHopsAfter] = useState(2);
  const [selectedEdgeLevels, setSelectedEdgeLevels] =
    useState<string[]>(ProjectEdgeLevels);
  const [selectedEdgeTypes, setSelectedEdgeTypes] =
    useState<string[]>(projectEdgeTypes);

  const availableNodes = useMemo(() => {
    if (!selectedNodeType) return nodes;
    return nodes.filter((n) => n.nodeType === selectedNodeType);
  }, [nodes, selectedNodeType]);

  const {
    nodes: rfNodes,
    edges: rfEdges,
    anchorNode,
  } = useGraphData({
    nodes,
    edges,
    selectedNodeId,
    hopsBefore,
    hopsAfter,
    selectedEdgeTypes,
    selectedNodeType,
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
            projectEdgeTypes={projectEdgeTypes}
            selectedEdgeTypes={selectedEdgeTypes}
            onToggle={handleToggleEdgeType}
            onClear={() => setSelectedEdgeTypes(projectEdgeTypes)}
          />
        </div>
        {/* Edge Level Selector */}
        <div className="flex flex-col gap-1.5">
          Select Edge Level
          <EdgeLevelSelector
            projectEdgeLevels={ProjectEdgeLevels}
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
          nodes={rfNodes}
          edges={rfEdges}
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
