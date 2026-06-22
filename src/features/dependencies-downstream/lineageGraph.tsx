"use client";

import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  Node,
  Edge,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

interface Props {
  nodes: Node[];
  edges: Edge[];
}

export default function LineageGraph({ nodes, edges }: Props) {
  return (
    <div style={{ width: "100%", height: "90vh" }}>
      <ReactFlow nodes={nodes} edges={edges} colorMode="dark" fitView>
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}