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
  ReactFlowProvider,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { Node, Edge } from "@xyflow/react";
import NodeToolTip from "./NodeToolTip";

type ClientGraphVizProps = {
  nodes: Node[];
  edges: Edge[];
  anchorNode: Node;
};

export function GraphVizCanvas({
  nodes: initialNodes,
  edges: initialEdges,
  anchorNode: initialAnchorNode,
}: ClientGraphVizProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  //added to hold absolute position of node for tool tip
  const [toolTipPos, setToolTipPos] = useState({ x: 0, y: 0 });

  const [dragMode, setDragMode] = useState<"pan" | "lasso">("pan");

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

  const handleOnNodeMouseEnter = (
    { clientX, clientY }: React.MouseEvent,
    hoveredNode: Node,
  ) => {
    const screenPos = { x: clientX, y: clientY };

    setHoveredNode(hoveredNode);
    setToolTipPos(screenPos);
  };

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

          onNodeMouseEnter={handleOnNodeMouseEnter}
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
        </ReactFlow>
        {hoveredNode && (
          <NodeToolTip node={hoveredNode} x={toolTipPos.x} y={toolTipPos.y} />
        )}
      </div>
    </div>
  );
}

export function ClientGraphViz({
  nodes: initialNodes,
  edges: initialEdges,
  anchorNode: initialAnchorNode,
}: ClientGraphVizProps) {
  return (
    <ReactFlowProvider>
      <GraphVizCanvas
        nodes={initialNodes}
        edges={initialEdges}
        anchorNode={initialAnchorNode}
      />
    </ReactFlowProvider>
  );
}
