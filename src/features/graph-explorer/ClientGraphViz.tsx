"use client";
import { useState, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  SelectionMode,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { Node, Edge } from "@xyflow/react";
import NodeToolTip from "./NodeToolTip";

type Props = {
  nodes: Node[];
  edges: Edge[];
  anchorNode: Node;
};

export default function ClientGraphViz({
  nodes: initialNodes,
  edges: initialEdges,
  anchorNode: initialAnchorNode,
}: Props) {
  // 1. React Flow's built-in state hooks handle the applyNodeChanges logic automatically
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);

  const [dragMode, setDragMode] = useState<"pan" | "lasso">("pan");

  // 2. Because useNodesState initializes instantly, we do a one-time sync
  // to ensure the hook grabs the props if they arrive slightly delayed.
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  const styledNodes = nodes.map((node) => {
    if (initialAnchorNode && node.id === initialAnchorNode.id) {
      return {
        ...node,
        style: {
          ...node.style,
          fontWeight: "bold",
          border: "3px solid #3b82f6", // Neon Blue border
          boxShadow: "0 0 15px rgba(59, 130, 246, 0.6)", // Highlighting Glow
          backgroundColor: "#1e293b", // Contrasting dark tile
          color: "#ffffff",
        },
      };
    }
    return node;
  });

  return (
    <div
      style={{
        height: "800px",
        width: "100%",
        position: "relative", // Needed to position our control box over the graph
      }}
    >
      {/* 2. Floating Radio/Toggle Control Box */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 10,
          background: "#222",
          color: "#fff",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #444",
          display: "flex",
          gap: "12px",
          fontFamily: "sans-serif",
          fontSize: "14px",
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            cursor: "pointer",
          }}
        >
          <input
            type="radio"
            name="dragMode"
            value="pan"
            checked={dragMode === "pan"}
            onChange={() => setDragMode("pan")}
          />
          ✋ Pan Canvas
        </label>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            cursor: "pointer",
          }}
        >
          <input
            type="radio"
            name="dragMode"
            value="lasso"
            checked={dragMode === "lasso"}
            onChange={() => setDragMode("lasso")}
          />
          📐 Lasso Select
        </label>
      </div>

      <div
        style={{
          height: "800px",
          width: "100%",
        }}
      >
        <ReactFlow
          nodes={styledNodes}
          edges={edges}
          //supporting draggability
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          //tool tip generation handling
          // onNodeMouseEnter={(_, clickedNode) => setHoveredNode}

          onNodeMouseEnter={(_, clickedNode) => setHoveredNode(clickedNode)}
          //onNodeMouseEnter={(node) =>
          //  console.log("entered node", hoveredNode, node.target)
          //}
          onNodeMouseLeave={() => console.log("leave fired")}
          //onNodeMouseLeave={() => setHoveredNode(null)}
          colorMode="dark"
          fitView
          // providing the toggle between lasso and pan

          panOnDrag={dragMode === "pan"}
          selectionOnDrag={dragMode === "lasso"}
          // Ensure these settings aren't forcing pan mode
          panOnScroll={false}
          preventScrolling={false}
          selectionMode={SelectionMode.Full}
        >
          <MiniMap />
          <Controls />
          <Background />
          {hoveredNode && <NodeToolTip node={hoveredNode} />}
        </ReactFlow>
      </div>
    </div>
  );
}
