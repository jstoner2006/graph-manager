"use client";

import { Node } from "@xyflow/react";

type NodeToolTipProps = {
  node: Node;
};

export default function NodeToolTip({ node }: NodeToolTipProps) {
  // 1. Extract the nodeName safely from the data key, matching your structure
  const nodeName = node.data?.label || "Unnamed Node";
  const nodeId = node.data.id;

  // 2. Extract the coordinates of the node so we can place the tooltip right over it
  console.log(node.position);
  const { x, y } = node.position;
  //console.log("x pos is  ", x, "y pos is ", y);
  return (
    <div
      style={{
        position: "absolute",
        // 3. Shift the tooltip horizontally to the center of the node,
        //    and vertically to sit roughly 45px above the node's top boundary
        left: `${x + 75}px`,
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
        pointerEvents: "none", // Prevents the tooltip from stealing mouse clicks
        fontFamily: "sans-serif",
        fontSize: "12px",
        whiteSpace: "nowrap", // Keeps the text on a single line
      }}
    >
      {/* 4. Display the required details */}
      <div style={{ fontWeight: "bold", marginBottom: "2px" }}>{nodeName}</div>
    </div>
  );
}
