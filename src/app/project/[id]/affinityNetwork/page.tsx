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
import ClientWeightedFlowPage from "@/features/affinity-network/clientD3-force";

const initialNodes = [
  { id: "1", data: { label: "Core Hub" }, position: { x: 0, y: 0 } },
  { id: "2", data: { label: "Strong Link A" }, position: { x: 0, y: 0 } },
  { id: "3", data: { label: "Strong Link B" }, position: { x: 0, y: 0 } },
  { id: "4", data: { label: "Weak Link C" }, position: { x: 0, y: 0 } },
  { id: "5", data: { label: "Weak Link D" }, position: { x: 0, y: 0 } },
];

// 1. Add a custom 'weight' property to your edges (scale of 0 to 1 works best)
const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    data: { weight: 1.0 },
  },
  {
    id: "e1-3",
    source: "1",
    target: "3",
    data: { weight: 0.8 },
  },
  {
    id: "e1-4",
    source: "1",
    target: "4",
    data: { weight: 0.1 },
  },
  {
    id: "e1-5",
    source: "1",
    target: "5",
    data: { weight: 0.05 },
  },
];
export function Page() {
  return (
    <ClientWeightedFlowPage
      initialEdges={initialEdges}
      initialNodes={initialNodes}
    ></ClientWeightedFlowPage>
  );
}
