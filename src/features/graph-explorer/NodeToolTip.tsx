"use client";

import { Node } from "@xyflow/react";

interface NodeToolTipProps {
  node: Node | null;
  x: number;
  y: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function NodeToolTip({
  node,
  x,
  y,
  onMouseEnter,
  onMouseLeave,
}: NodeToolTipProps) {
  // 1. Extract the nodeName safely from the data key, matching your structure
  const nodeName = node?.data?.label || "Unnamed Node";
  const nodeLastupdateDts = node?.data?.lastUpdateDts || "no last update dts";
  const nodeUrl = node?.data?.url || null;
  const nodeId = node?.data.id;

  // 2. Extract the coordinates of the node so we can place the tooltip right over it

  //const { x, y } = node.position;
  //const x = x;
  //const y = y;
  //console.log("x pos is  ", x, "y pos is ", y);
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: "fixed",
        // 3. Shift the tooltip horizontally to the center of the node,
        //    and vertically to sit roughly 45px above the node's top boundary
        left: `${x}px`,
        top: `${y}px`,
        transform: "translateX(-50%)", // Centers the tooltip perfectly over the node center

        // --- Styling (Dark Mode Theme) ---
        backgroundColor: "#1e293b", // Slate 800
        color: "#f8fafc", // Slate 50
        padding: "8px 12px",
        borderRadius: "6px",
        border: "1px solid #475569", // Slate 600
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
        zIndex: 1000, // Forces it to float cleanly on top of everything
        pointerEvents: "auto",
        fontFamily: "sans-serif",
        fontSize: "12px",
        whiteSpace: "nowrap", // Keeps the text on a single line
      }}
    >
      {/* 4. Display the required details */}

      {nodeUrl !== "NULL" ? (
        <div>
          Node Name:
          <a
            href={nodeUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            style={{
              color: "#60a5fa", // Only the name turns blue
              textDecoration: "underline",
              cursor: "pointer",
              pointerEvents: "auto",
            }}
          >
            {nodeName}
          </a>
        </div>
      ) : (
        <div
          style={{
            fontWeight: "bold",
            marginBottom: "2px",
            pointerEvents: "none",
          }}
        >
          Node Name: {nodeName}
        </div>
      )}

      <div
        style={{
          fontWeight: "bold",
          marginBottom: "2px",
          pointerEvents: "none",
        }}
      >
        Last Updated: {nodeLastupdateDts}
      </div>
    </div>
  );
}
