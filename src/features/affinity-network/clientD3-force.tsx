"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  Edge,
  Node,
} from "@xyflow/react";
import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCenter,
} from "d3-force";

import "@xyflow/react/dist/style.css";
import {
  Node as PrismaNode,
  Edge as PrismaEdge,
  ProjectEdgeType,
} from "@prisma/client";
import { getEdgesByProjectIDandEdgeType } from "@/queries/edges/specific_edges";
import EdgeTypeSelector from "./ui/EdgeTypeSelector"; // Directly imports from neighboring folder

interface ClientWeightedFlowPageProps {
  projectId: string;
  initialNodes: PrismaNode[];
  initialEdges: PrismaEdge[];
  projectEdgeTypes: ProjectEdgeType[];
}

export default function ClientWeightedFlowPage({
  projectId,
  initialNodes,
  initialEdges,
  projectEdgeTypes,
}: ClientWeightedFlowPageProps) {
  const [selectedEdgeTypes, setSelectedEdgeTypes] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  // 1. Transform initial Prisma Nodes to React Flow format (0,0 maps cleanly for SSR)
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>(() =>
    initialNodes.map((node) => ({
      id: String(node.nodeId),
      data: { label: node.nodeName },
      position: { x: 0, y: 0 },
    })),
  );

  // Core formatting pipeline for incoming Prisma edges
  const mapPrismaEdges = (prismaEdges: PrismaEdge[]): Edge[] =>
    prismaEdges.map((edge) => ({
      id: String(edge.edgeId),
      source: String(edge.fromNodeId),
      target: String(edge.toNodeId),
      data: { weight: Number(edge.edgeWeight || 0.5) },
    }));

  // 2. Initialize Edges State
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>(() =>
    mapPrismaEdges(initialEdges),
  );

  const simulationRef = useRef<any>(null);

  // --- FILTER CHANGE OPERATIONS ---

  const handleToggleEdgeType = (type: string) => {
    const updatedTypes = selectedEdgeTypes.includes(type)
      ? selectedEdgeTypes.filter((t) => t !== type)
      : [...selectedEdgeTypes, type];

    setSelectedEdgeTypes(updatedTypes);
    fetchFilteredEdges(updatedTypes);
  };

  const handleClearSelection = () => {
    setSelectedEdgeTypes([]);
    fetchFilteredEdges([]);
  };

  const fetchFilteredEdges = (types: string[]) => {
    startTransition(async () => {
      const rawEdges = await getEdgesByProjectIDandEdgeType(projectId, types);
      setEdges(mapPrismaEdges(rawEdges));
    });
  };

  // --- D3 SIMULATION ENGINE PIPELINE ---

  useEffect(() => {
    if (!nodes.length) return;

    const d3Nodes = nodes.map((n) => ({
      ...n,
      x: n.position?.x === 0 ? Math.random() * 100 : n.position.x,
      y: n.position?.y === 0 ? Math.random() * 100 : n.position.y,
    }));

    const d3Edges = edges.map((e) => ({ ...e }));

    const simulation = forceSimulation(d3Nodes)
      .force("charge", forceManyBody().strength(-300))
      .force(
        "link",
        forceLink(d3Edges)
          .id((d: any) => d.id)
          .distance(120),
      )
      .force("center", forceCenter(400, 300));

    // Fast-forward simulation cycles upfront for static frame loading
    simulation.stop();
    for (let i = 0; i < 300; i++) {
      simulation.tick();
    }

    setNodes((currentNodes) =>
      currentNodes.map((currentNode) => {
        const matchingD3Node = d3Nodes.find((n) => n.id === currentNode.id);
        if (!matchingD3Node) return currentNode;

        return {
          ...currentNode,
          position: {
            x: Number.isFinite(matchingD3Node.x) ? matchingD3Node.x : 0,
            y: Number.isFinite(matchingD3Node.y) ? matchingD3Node.y : 0,
          },
        };
      }),
    );

    simulationRef.current = simulation;
    return () => simulation.stop();
  }, [initialNodes, edges]);

  // --- INTERACTIVE DRAG physics HANDLERS ---

  const onNodeDragStart = (event: any, node: any) => {
    const simulation = simulationRef.current;
    if (!simulation) return;
    simulation.alpha(1);
  };

  const onNodeDrag = (event: any, node: any) => {
    const simulation = simulationRef.current;
    if (!simulation) return;

    const d3Node = simulation.nodes().find((n: any) => n.id === node.id);
    if (d3Node) {
      d3Node.fx = node.position.x;
      d3Node.fy = node.position.y;
    }

    simulation.tick();

    setNodes((currentNodes) =>
      currentNodes.map((currentNode) => {
        const matchingD3Node = simulation
          .nodes()
          .find((n: any) => n.id === currentNode.id);
        if (!matchingD3Node) return currentNode;
        return {
          ...currentNode,
          position: { x: matchingD3Node.x, y: matchingD3Node.y },
        };
      }),
    );
  };

  const onNodeDragStop = (event: any, node: any) => {
    const simulation = simulationRef.current;
    if (!simulation) return;

    const d3Node = simulation.nodes().find((n: any) => n.id === node.id);
    if (d3Node) {
      d3Node.fx = null;
      d3Node.fy = null;
    }

    for (let i = 0; i < 80; i++) {
      simulation.tick();
    }

    setNodes((currentNodes) =>
      currentNodes.map((currentNode) => {
        const matchingD3Node = simulation
          .nodes()
          .find((n: any) => n.id === currentNode.id);
        if (!matchingD3Node) return currentNode;
        return {
          ...currentNode,
          position: { x: matchingD3Node.x, y: matchingD3Node.y },
        };
      }),
    );

    simulation.stop();
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#1a1a1a",
        position: "relative",
      }}
    >
      {/* Absolute Control Overlay Menu Container */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <EdgeTypeSelector
          projectEdgeTypes={projectEdgeTypes}
          selectedEdgeTypes={selectedEdgeTypes}
          onToggle={handleToggleEdgeType}
          onClear={handleClearSelection}
        />
        {isPending && (
          <span style={{ fontSize: "12px", color: "#a1a1aa" }}>
            Calculating Physics...
          </span>
        )}
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        colorMode="dark"
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStart={onNodeDragStart}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
