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

type NodeType = { projectId: string; nodeType: string };
type GraphNode = {
  nodeId: string;
  nodeName: string;
  nodeDisplayName: string;
  projectId: string;
  nodeType: string;
};
type GraphAdjacency = {
  outgoing: Record<string, string[]>;
  incoming: Record<string, string[]>;
};
type Props = {
  nodes: GraphNode[];
  nodeTypes: NodeType[];
  adjacency: GraphAdjacency;
  ProjectEdgeLevels: ProjectEdgeLevel[];
};

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

export default function ClientGraph({
  nodes,
  nodeTypes,
  adjacency,
  ProjectEdgeLevels,
}: Props) {
  {
    /**used to reset the scroll bar when changing searches */
  }

  const commandListRef = useRef<HTMLDivElement>(null);

  const [selectedNodeType, setSelectedNodeType] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState("");
  const [hopsBefore, setHopsBefore] = useState(2);
  const [hopsAfter, setHopsAfter] = useState(2);
  const [selectedEdgeLevel, setSelectedEdgeLevel] = useState("");

  const availableNodes = useMemo(() => {
    if (!selectedNodeType) return nodes;
    return nodes.filter((n) => n.nodeType === selectedNodeType);
  }, [nodes, selectedNodeType]);

  const visibleNodeIds = useMemo(() => {
    if (!selectedNodeId) return new Set<string>();

    const upstream = traverse(selectedNodeId, hopsBefore, adjacency.incoming);
    const downstream = traverse(selectedNodeId, hopsAfter, adjacency.outgoing);

    return new Set([...upstream, ...downstream]);
  }, [selectedNodeId, hopsBefore, hopsAfter, adjacency]);

  console.log(ProjectEdgeLevels);

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

  const reactFlowData = useMemo(() => {
    const rfNodesBase = nodes
      .filter((n) => visibleNodeIds.has(n.nodeId))
      .map((node) => ({
        id: node.nodeId,
        data: { label: node.nodeDisplayName },
        position: { x: 0, y: 0 },
      }));

    const rfEdges: any[] = [];
    for (const sourceId in adjacency.outgoing) {
      const targets = adjacency.outgoing[sourceId];
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
  }, [nodes, adjacency, visibleNodeIds, selectedNodeId]);

  return (
    <>
      <div className="flex gap-4 mb-4 text-white">
        {/* Edge Level Selector */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-[200px] justify-between"
            >
              {selectedEdgeLevel
                ? ProjectEdgeLevels.find(
                    (el) => el.edgeLevel === selectedEdgeLevel,
                  )?.edgeLevel
                : "All Edge Levels"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0 bg-zinc-900 border border-zinc-700 text-white">
            <Command className="bg-zinc-900 text-white">
              <CommandInput placeholder="Search levels..." />
              <CommandList>
                <CommandEmpty>No level found.</CommandEmpty>
                <CommandGroup>
                  {/* Default Option to clear filter */}
                  <CommandItem
                    value="all-levels"
                    onSelect={() => setSelectedEdgeLevel("")}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${selectedEdgeLevel === "" ? "opacity-100" : "opacity-0"}`}
                    />
                    All Edge Levels
                  </CommandItem>

                  {/* Dynamic levels map */}
                  {ProjectEdgeLevels.map((level) => (
                    <CommandItem
                      key={level.edgeLevel}
                      value={level.edgeLevel.toLowerCase()}
                      onSelect={() => setSelectedEdgeLevel(level.edgeLevel)}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${selectedEdgeLevel === level.edgeLevel ? "opacity-100" : "opacity-0"}`}
                      />
                      {level.edgeLevel}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {/* Node Type Selector */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-[220px] justify-between"
            >
              {selectedNodeType
                ? nodeTypes.find((t) => t.nodeType === selectedNodeType)
                    ?.nodeType
                : "All Types"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[220px] p-0 bg-zinc-900 border border-zinc-700 text-white">
            <Command className="bg-zinc-900 text-white">
              <CommandInput placeholder="Search types..." />
              <CommandList>
                <CommandEmpty>No node type found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value="all-types"
                    onSelect={() => setSelectedNodeType("")}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${selectedNodeType === "" ? "opacity-100" : "opacity-0"}`}
                    />
                    All Types
                  </CommandItem>
                  {nodeTypes.map((type) => (
                    <CommandItem
                      key={type.nodeType}
                      value={type.nodeType}
                      onSelect={() =>
                        setSelectedNodeType(String(type.nodeType))
                      }
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${selectedNodeType === type.nodeType ? "opacity-100" : "opacity-0"}`}
                      />
                      {type.nodeType}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Node Selector */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-[300px] justify-between"
            >
              {selectedNodeId
                ? nodes.find((n) => n.nodeId === selectedNodeId)
                    ?.nodeDisplayName
                : "Select Node"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput
                placeholder="Search nodes..."
                onValueChange={() => {
                  if (commandListRef.current) {
                    commandListRef.current.scrollTop = 0;
                  }
                }}
              />
              {/** update here add  ref={commandListRef} */}
              <CommandList ref={commandListRef}>
                <CommandEmpty>No node found.</CommandEmpty>
                <CommandGroup>
                  {availableNodes.map((node) => (
                    <CommandItem
                      key={node.nodeId}
                      // FIX 2: Value lowered and unique to ensure Shadcn searches node names perfectly
                      value={`${node.nodeDisplayName.toLowerCase()}||${node.nodeId}`}
                      onSelect={() => setSelectedNodeId(node.nodeId)}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${selectedNodeId === node.nodeId ? "opacity-100" : "opacity-0"}`}
                      />
                      {node.nodeDisplayName}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Hops Inputs */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-zinc-400">Hops Before:</label>
          <input
            className="bg-zinc-900 text-white border border-zinc-700 px-2 py-1 rounded w-16"
            type="number"
            min={0}
            value={hopsBefore}
            onChange={(e) => setHopsBefore(Number(e.target.value))}
          />
        </div>
        <div className="flex items-center gap-2">
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

      <ClientGraphViz
        nodes={reactFlowData.nodes}
        edges={reactFlowData.edges}
        anchorNode={reactFlowData.anchorNode}
      />
    </>
  );
}
