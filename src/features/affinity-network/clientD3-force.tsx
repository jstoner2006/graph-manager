"use client";

import React, { useEffect, useRef } from "react";
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
import { Node as PrismaNode, Edge as PrismaEdge } from "@prisma/client";

interface ClientWeightedFlowPageProps {
  initialNodes: PrismaNode[];
  initialEdges: PrismaEdge[];
}

export default function ClientWeightedFlowPage({
  initialNodes,
  initialEdges,
}: ClientWeightedFlowPageProps) {
  // 1. Initialize state. We use a fallback layout array directly inside useNodesState
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(() =>
    initialNodes.map(
      (node: PrismaNode): Node => ({
        id: String(node.nodeId), // TypeScript will autocomplete .nodeId cleanly!
        data: { label: node.nodeName }, // TypeScript will autocomplete .nodeName cleanly!
        position: { x: 0, y: 0 },
      }),
    ),
  );

  // 2. Initialize Edges: Transform PrismaEdge -> ReactFlow Edge
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>(() =>
    initialEdges.map(
      (edge: PrismaEdge): Edge => ({
        id: String(edge.edgeId),
        source: String(edge.fromNodeId), // Type-safe column check
        target: String(edge.toNodeId), // Type-safe column check
        data: { weight: Number(edge.edgeWeight || 0.5) },
      }),
    ),
  );
  const simulationRef = useRef<any>(null);

  useEffect(() => {
    // If no nodes are loaded yet, don't spin up the engine
    if (!nodes.length) return;

    // 2. Map coordinates explicitly onto the root object where D3 demands them
    const d3Nodes = nodes.map((n) => ({
      ...n,
      x: n.position?.x ?? 0,
      y: n.position?.y ?? 0,
    }));
    const d3Edges = edges.map((e) => ({ ...e }));
    console.log(d3Nodes, "d3 nodes", d3Edges, "d3 edges");
    // 3. Kick off the simulation
    const simulation = forceSimulation(d3Nodes)
      .force("charge", forceManyBody().strength(-400))
      .force(
        "link",
        forceLink(d3Edges)
          .id((d: any) => d.id)
          .distance(150)
          .strength((link: any) => link.data?.weight ?? 0.1),
      )
      .force("center", forceCenter(400, 300));

    // 4. Sync the coordinates into React Flow's nested state
    simulation.on("tick", () => {
      setNodes((currentNodes) =>
        currentNodes.map((currentNode) => {
          // Find the corresponding calculated math data from D3
          const d3Node = d3Nodes.find((n: any) => n.id === currentNode.id);
          if (!d3Node) return currentNode;

          // Return your untouched React Flow node, ONLY updating the position object
          return {
            ...currentNode,
            position: { x: d3Node.x, y: d3Node.y },
          };
        }),
      );
    });

    simulationRef.current = simulation;

    return () => simulation.stop();
  }, [initialNodes]); // 👈 Re-run physics safely if server data reloads

  // --- D3 Drag Handlers ---
  const onNodeDragStart = (event: any, node: any) => {
    const simulation = simulationRef.current;
    if (!simulation) return;
    simulation.alphaTarget(0.3).restart();
    const d3Node = simulation.nodes().find((n: any) => n.id === node.id);
    if (d3Node) {
      d3Node.fx = node.position.x;
      d3Node.fy = node.position.y;
    }
  };

  const onNodeDrag = (event: any, node: any) => {
    const simulation = simulationRef.current;
    if (!simulation) return;
    const d3Node = simulation.nodes().find((n: any) => n.id === node.id);
    if (d3Node) {
      d3Node.fx = node.position.x;
      d3Node.fy = node.position.y;
    }
  };

  const onNodeDragStop = (event: any, node: any) => {
    const simulation = simulationRef.current;
    if (!simulation) return;
    simulation.alphaTarget(0);
    const d3Node = simulation.nodes().find((n: any) => n.id === node.id);
    if (d3Node) {
      d3Node.fx = null;
      d3Node.fy = null;
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
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
