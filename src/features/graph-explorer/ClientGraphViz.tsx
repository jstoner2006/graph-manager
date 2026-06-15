"use client";

import  {ReactFlow,
  Background,
  Controls,
  MiniMap,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

type Props = {
  nodes: any[];
  edges: any[];
};

export default function ClientGraphViz({
  nodes,
  edges,
}: Props) {
   
  return (
    <div
      style={{
        height: "800px",
        width: "100%",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView>
        
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}