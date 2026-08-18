"use client";
import React, { useState } from "react";

import "@xyflow/react/dist/style.css";
import { ProjectEdgeType, ProjectNodeType } from "@prisma/client";
import CCTable from "./ui/CCtable";
import { getFilteredGraphData } from "./getFilteredGraphData";
import TypeFilters from "./ui/Typefilters";
import ConnectedComponentsViz from "./connected-components-viz";
import { ConnectedComponentsData } from "./connected-components-data";

import { Graph } from "@/types/graph";
import PageFilter from "./pageFilter";
import { rankAndSortCCSummary } from "./assignRanks";
import filterCCSummary from "./filterCCSummary";
import PageNavigator from "./ui/PageNavigator";
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

  const [sortColumn, setSortColumn] = useState<string>("edgeCount");
  const [sortOrder, setSortOrder] = useState<string>("desc");

  const sortColumns: string[] = ["edgeCount", "nodeCount"];
  const sortOrders: string[] = ["asc", "desc"];

  const ccSummary = ConnectedComponentsArray.map(
    ({ name, edgeCount, nodeCount }) => ({
      name: name,
      nodeCount: String(nodeCount),
      edgeCount: String(edgeCount),
    }),
  );

  //come back here and make this dynamic

  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const totalPages = Math.ceil(ccSummary.length / pageSize);
  const [showViz, setShowViz] = useState<boolean>(false);

  const ccSummaryRanked = rankAndSortCCSummary(
    ccSummary,
    sortColumn,
    sortOrder,
  );
  const filteredCCSummary = filterCCSummary(
    ccSummaryRanked,
    currentPage * pageSize,
    (currentPage + 1) * pageSize,
  );

  const [selectedConnectedComponentName, setSelectedConnectedComponentName] =
    useState<string>("");

  const selectedConnectedComponent: Graph = ConnectedComponentsArray.find(
    (c) => c.name === selectedConnectedComponentName,
  );

  //update state with drop down values
  const applyFilters = (EdgeTypes: string[], NodeTypes: string[]) => {
    fetchFilteredNodesEdges(EdgeTypes, NodeTypes);
  };

  /**
   * Retrieve the nodes and edges
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
        <PageFilter
          selectedColumn={sortColumn}
          sortColumns={sortColumns}
          selectedOrder={sortOrder}
          sortOrders={sortOrders}
          setSortColumn={setSortColumn}
          setSortOrder={setSortOrder}
        ></PageFilter>
      </div>

      <div>
        <CCTable
          cc={filteredCCSummary}
          setSelectedConnectedComponentName={setSelectedConnectedComponentName}
          setShowViz={setShowViz}
        ></CCTable>
      </div>
      <div>
        <PageNavigator
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        ></PageNavigator>
      </div>
      {showViz ? (
        <div>
          <ConnectedComponentsViz
            ConnectedComponent={selectedConnectedComponent}
          ></ConnectedComponentsViz>
        </div>
      ) : (
        <div>Select a component to render</div>
      )}
    </div>
  );
}
