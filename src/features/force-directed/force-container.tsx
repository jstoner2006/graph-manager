"use client";
import React, { useState } from "react";
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
import {
  Node as PrismaNode,
  Edge as PrismaEdge,
  ProjectEdgeType,
  ProjectNodeType,
} from "@prisma/client";
import { getEdgesByProjectIDandEdgeType } from "@/queries/edges/specific_edges";
import { getNodesByProjectIDandNodeType } from "@/queries/nodes/specific_nodes";
import ForceViz from "./ui/ForceViz";
import Filters from "./ui/filters";
import { edgeServerAppPaths } from "next/dist/build/webpack/plugins/pages-manifest-plugin";
import { Client } from "pg";

interface ForceContainerProps {
  projectId: string;
  initialNodes: PrismaNode[];
  initialEdges: PrismaEdge[];
  projectEdgeTypes: ProjectEdgeType[];
  projectNodeTypes: ProjectNodeType[];
}

export default function ForceContainer({
  projectId,
  initialNodes,
  initialEdges,
  projectEdgeTypes,
  projectNodeTypes,
}: ForceContainerProps) {
  const [selectedEdgeTypes, setSelectedEdgeTypes] = useState<string[]>([]);
  const [selectedNodeTypes, setSelectedNodeTypes] = useState<string[]>([]);

  const [selectedEdges, setSelectedEdges] = useState<Edge[]>([]);
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);

  //update state with drop down values
  const applyFilters = (EdgeTypes: string[], NodeTypes: string[]) => {
    setSelectedEdgeTypes(EdgeTypes);
    setSelectedNodeTypes(NodeTypes);

    updateNodesEdges(EdgeTypes, NodeTypes);
  };

  const updateNodesEdges = async (edgeTypes: string[], nodeTypes: string[]) => {
    //this function will fetch the nodes and edges and format them
    //then update the selectedNodes and edges state

    fetchFilteredEdges(); //updates selectedEdges based on selectedEdgeTypes
    fetchFilteredNodes(); //updates selectedNodes based on selectedNodeTypes
  };

  //fetching and formatting nodes and edges based on selected types
  const mapPrismaEdges = (prismaEdges: PrismaEdge[]) =>
    prismaEdges.map((edge) => ({
      id: String(edge.edgeId),
      source: String(edge.fromNodeId),
      target: String(edge.toNodeId),
      data: { weight: Number(edge.edgeWeight || 0.5) },
    }));

  const fetchFilteredEdges = async () => {
    const rawEdges = await getEdgesByProjectIDandEdgeType(
      projectId,
      selectedEdgeTypes,
    );
    const formattedEdges = mapPrismaEdges(rawEdges);
    setSelectedEdges(formattedEdges);
    console.log("fetch filtered edges called");
  };

  const mapPrismaNodes = (prismaNodes: PrismaNode[]) =>
    prismaNodes.map((node) => ({
      id: node.nodeId,
      data: { label: node.nodeName },
      position: { x: 0, y: 0 },
    }));

  const fetchFilteredNodes = async () => {
    const rawNodes = await getNodesByProjectIDandNodeType(
      projectId,
      selectedNodeTypes,
    );
    const formattedNodes = mapPrismaNodes(rawNodes);
    setSelectedNodes(formattedNodes);
    console.log("fetch filtered nodes called");
  };

  return (
    <div>
      <Filters
        projectEdgeTypes={projectEdgeTypes}
        projectNodeTypes={projectNodeTypes}
        applyFilters={applyFilters}
      ></Filters>
      {selectedEdges.length > 0 && selectedNodes.length > 0 && (
        <ForceViz edges={selectedEdges} nodes={selectedNodes}></ForceViz>
      )}
    </div>
  );
}
