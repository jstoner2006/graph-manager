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

import "@xyflow/react/dist/style.css";
import {
  Node as PrismaNode,
  Edge as PrismaEdge,
  ProjectEdgeType,
  ProjectNodeType,
} from "@prisma/client";
import { getEdgesByProjectIDandEdgeType } from "@/queries/edges/specific_edges";
import { getNodesByProjectIDandNodeType } from "@/queries/nodes/specific_nodes";

import TypeFilters from "./ui/Typefilters";
import ConnectedComponentsViz from "./connected-components-viz";
import { ConnectedComponentsData } from "./connected-components-data";
import ConnectedComponentFilter from "./ui/ConnectedComponentFilters";

import { Client } from "pg";

interface ConnectedComponentsContainerProps {
  projectId: string;

  projectEdgeTypes: ProjectEdgeType[];
  projectNodeTypes: ProjectNodeType[];
}

/**
 * Will hold the filters, and return the nodes and
 * edges based on them
 * then will call the connected components action
 * and feed its value to the viz
 *
 *
 */
export default function ConnectedComponentsContainer({
  projectId,
  projectEdgeTypes,
  projectNodeTypes,
}: ConnectedComponentsContainerProps) {
  //this will hold all the connected components names, nodes, and edges
  const [ConnectedComponentsArray, setConnectedComponentsArray] = useState([
    {
      name: "og name",
      nodes: [],
    },
  ]);

  const [showViz, setShowViz] = useState<boolean>(false);

  const [selectedconnectedComponent, setselectedconnectedComponent] = useState([
    {
      name: "og name",
      nodes: [],
    },
  ]);

  //update state with drop down values
  const applyFilters = (EdgeTypes: string[], NodeTypes: string[]) => {
    fetchFilteredNodesEdges(EdgeTypes, NodeTypes);
  };

  //fetching and formatting nodes and edges based on selected types
  const mapPrismaEdges = (prismaEdges: PrismaEdge[]) =>
    prismaEdges.map((edge) => ({
      id: String(edge.edgeId),
      source: String(edge.fromNodeId),
      target: String(edge.toNodeId),
      data: { weight: Number(edge.edgeWeight || 0.5) },
    }));

  const mapPrismaNodes = (prismaNodes: PrismaNode[]) =>
    prismaNodes.map((node) => ({
      id: node.nodeId,
      data: { label: node.nodeName },
      position: { x: 0, y: 0 },
    }));

  //get nodes and edges based on selected node types, edge types
  //also pass those selected node types to connected component creator

  const fetchFilteredNodesEdges = async (
    edgeTypes: string[],
    nodeTypes: string[],
  ) => {
    const rawEdges = await getEdgesByProjectIDandEdgeType(projectId, edgeTypes);
    const formattedEdges = mapPrismaEdges(rawEdges);

    //console.log("fetch filtered edges called");

    const rawNodes = await getNodesByProjectIDandNodeType(projectId, nodeTypes);
    const formattedNodes = mapPrismaNodes(rawNodes);

    //console.log("fetch filtered nodes called");

    setConnectedComponentsArray(
      ConnectedComponentsData(formattedNodes, formattedEdges),
    );
  };

  return (
    <div>
      <div>
        <TypeFilters
          projectEdgeTypes={projectEdgeTypes}
          projectNodeTypes={projectNodeTypes}
          applyFilters={applyFilters}
        ></TypeFilters>
      </div>
      <div>
        <ConnectedComponentFilter
          ConnectedComponents={ConnectedComponentsArray}
          applyConnectedComponentfilter={setselectedconnectedComponent}
          setShowViz={setShowViz}
        ></ConnectedComponentFilter>
      </div>
      {showViz ? (
        <div>
          <ConnectedComponentsViz
            ConnectedComponent={selectedconnectedComponent}
          ></ConnectedComponentsViz>
        </div>
      ) : (
        <div>Select a component to render</div>
      )}
    </div>
  );
}
