"use client";
import React, { useState } from "react";

import "@xyflow/react/dist/style.css";
import { ProjectEdgeType, ProjectNodeType } from "@prisma/client";
import CCTable from "./ui/CCtable";
import { getFilteredGraphData } from "./getFilteredGraphData";
import TypeFilters from "./ui/Typefilters";
import ConnectedComponentsViz from "./connected-components-viz";
import { ConnectedComponentsData } from "./connected-components-data";
import ConnectedComponentFilter from "./ui/ConnectedComponentFilters";
import { Graph } from "@/types/graph";
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
  const [ConnectedComponentsArray, setConnectedComponentsArray] = useState<
    Graph[]
  >([{ nodes: [], edges: [], name: "", edgeCount: 0, nodeCount: 0 }]);

  const ccSummary = ConnectedComponentsArray.map(
    ({ name, edgeCount, nodeCount }) => ({
      name: name,
      nodeCount: String(nodeCount),
      edgeCount: String(edgeCount),
    }),
  );

  const [showViz, setShowViz] = useState<boolean>(false);

  const [selectedconnectedComponent, setselectedconnectedComponent] =
    useState<Graph>({
      nodes: [],
      edges: [],
    });

  //update state with drop down values
  const applyFilters = (EdgeTypes: string[], NodeTypes: string[]) => {
    fetchFilteredNodesEdges(EdgeTypes, NodeTypes);
  };

  /**
   * Retrieve teh nodes and
   * @param edgeTypes
   * @param nodeTypes
   */
  const fetchFilteredNodesEdges = async (
    edgeTypes: string[],
    nodeTypes: string[],
  ) => {
    const graph = await getFilteredGraphData({
      NodeTypes: nodeTypes,
      EdgeTypes: edgeTypes,
      ProjectId: projectId,
    });

    setConnectedComponentsArray(
      ConnectedComponentsData(graph.nodes, graph.edges),
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
      <div>
        <CCTable cc={ccSummary}></CCTable>
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
