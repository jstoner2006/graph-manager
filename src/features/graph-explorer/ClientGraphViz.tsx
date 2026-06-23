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
  useReactFlow,
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

  // 2. 🚀 Camera Recentering Hook (Fires ONLY on fresh node activation/regeneration)

  const { setCenter, getNode } = useReactFlow(); // Added getNode
  // Extract the raw measured status of our anchor node to use as a pinpoint dependency
  const anchorNodeId = initialAnchorNode?.id;
  const liveAnchorNode = nodes.find((n) => n.id === anchorNodeId);
  const isMeasured = liveAnchorNode?.measured?.width !== undefined;

  useEffect(() => {
    if (!anchorNodeId) return;

    // Pull the fresh object out of the core React Flow layout cache
    const activeNode = getNode(anchorNodeId);

    if (activeNode && activeNode.measured?.width !== undefined) {
      const nodeWidth = activeNode.measured.width;
      const nodeHeight = activeNode.measured.height ?? 40;

      const targetX = activeNode.position.x + nodeWidth / 2;
      const targetY = activeNode.position.y + nodeHeight / 2;

      setCenter(targetX, targetY, {
        zoom: 1.1,
        duration: 700,
      });
    }
  }, [anchorNodeId, isMeasured, setCenter, getNode]); // 🚀 Tracks the exact moment measurements lock in

  const styledNodes = nodes.map((node) => {
    if (initialAnchorNode && node.id === initialAnchorNode.id) {
      return {
        ...node,
        style: {
          ...node.style,
          width: "max-content",
          whiteSpace: "nowrap",
          fontWeight: "bold",
          border: "3px solid #3b82f6", // Neon Blue border
          boxShadow: "0 0 15px rgba(59, 130, 246, 0.6)", // Highlighting Glow
          backgroundColor: "#1e293b", // Contrasting dark tile
          color: "#ffffff",
        },
      };
    } else {
      return {
        ...node,
        style: {
          ...node.style,
          width: "max-content",
          whiteSpace: "nowrap",
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
          onNodeMouseLeave={() => setHoveredNode(null)}
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
        {/* this code is technically working but right now not useful the ui needs cleaned up
        {hoveredNode && (
          <NodeToolTip node={hoveredNode} x={toolTipPos.x} y={toolTipPos.y} />
        )}
        */}
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
