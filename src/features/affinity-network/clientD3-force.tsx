"use client";

import React, { useEffect, useRef } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
} from "@xyflow/react";
import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCenter,
} from "d3-force";

import "@xyflow/react/dist/style.css";

export default function ClientWeightedFlowPage({ initialNodes, initialEdges }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const simulationRef = useRef(null);

  useEffect(() => {
    const d3Nodes = nodes.map((n) => ({ ...n }));
    const d3Edges = edges.map((e) => ({ ...e }));

    // 2. Initialize the simulation with dynamic link strength
    const simulation = forceSimulation(d3Nodes)
      .force("charge", forceManyBody().strength(-400))
      .force(
        "link",
        forceLink(d3Edges)
          .id((d) => d.id)
          .distance(150) // Base resting distance between nodes
          // This callback fires for every link to calculate its custom spring force:
          .strength((link) => {
            // Read the weight from the React Flow edge data structure
            const weight = link.data?.weight ?? 0.1;
            return weight; // Return a value typically between 0.0 and 1.0
          }),
      )
      .force("center", forceCenter(400, 300));

    simulation.on("tick", () => {
      setNodes((currentNodes) =>
        currentNodes.map((currentNode) => {
          const d3Node = d3Nodes.find((n) => n.id === currentNode.id);
          if (!d3Node) return currentNode;
          return {
            ...currentNode,
            position: { x: d3Node.x || 0, y: d3Node.y || 0 },
          };
        }),
      );
    });

    simulationRef.current = simulation;

    return () => simulation.stop();
  }, []);

  // --- D3 Drag Handlers ---
  const onNodeDragStart = (event, node) => {
    const simulation = simulationRef.current;
    if (!simulation) return;
    simulation.alphaTarget(0.3).restart();
    const d3Node = simulation.nodes().find((n) => n.id === node.id);
    if (d3Node) {
      d3Node.fx = node.position.x;
      d3Node.fy = node.position.y;
    }
  };

  const onNodeDrag = (event, node) => {
    const simulation = simulationRef.current;
    if (!simulation) return;
    const d3Node = simulation.nodes().find((n) => n.id === node.id);
    if (d3Node) {
      d3Node.fx = node.position.x;
      d3Node.fy = node.position.y;
    }
  };

  const onNodeDragStop = (event, node) => {
    const simulation = simulationRef.current;
    if (!simulation) return;
    simulation.alphaTarget(0);
    const d3Node = simulation.nodes().find((n) => n.id === node.id);
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
