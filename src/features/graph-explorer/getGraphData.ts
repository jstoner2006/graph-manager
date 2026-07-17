import { getEdgesByProjectID } from "@/queries/edges/actions";
import { getNodesbyProjectID } from "@/queries/nodes/action";
import { getProjectNodeTypesbyProjectID } from "@/queries/nodetypes/action";
import { getEdgeLevelsByProjectIDString } from "@/queries/edgeLevels/getEdgeLevelsbyProjectIDstring";
import { getEdgeTypesByProjectIDString } from "@/queries/edgetypes/getEdgeTypesbyProjectIDString";
import { ProjectEdgeLevel } from "@prisma/client";
import { Edge } from "@prisma/client";
import { Node } from "@prisma/client";
import { ProjectEdgeType } from "@prisma/client";
import { ProjectNodeType } from "@/types/NodeType";

export type GraphNode = {
  id: string;
  name: string;
  displayName: string;
  nodeTypeId: string;
};

export type GraphEdge = {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
};

export type GraphAdjacency = {
  outgoing: Record<string, string[]>;
  incoming: Record<string, string[]>;
};

export type EdgeLevel = {
  EdgeLevel: number;
};

export type GraphData = {
  nodes: Node[];
  edges: Edge[];
  nodeTypes: ProjectNodeType[];
  adjacency: GraphAdjacency;
  projectEdgeLevels: ProjectEdgeLevel[];
  projectEdgeTypes: ProjectEdgeType[];
};

function buildAdjacency(nodes: Node[], edges: Edge[]): GraphAdjacency {
  const outgoing: Record<string, string[]> = {};
  const incoming: Record<string, string[]> = {};

  for (const node of nodes) {
    outgoing[node.nodeId] = [];
    incoming[node.nodeId] = [];
  }

  for (const edge of edges) {
    outgoing[edge.fromNodeId] ??= [];
    incoming[edge.toNodeId] ??= [];

    outgoing[edge.fromNodeId].push(edge.toNodeId);
    incoming[edge.toNodeId].push(edge.fromNodeId);
  }

  return {
    outgoing,
    incoming,
  };
}

export async function getGraphData(projectId: string): Promise<GraphData> {
  const [nodes, edges, nodeTypes, projectEdgeLevels, projectEdgeTypes] =
    await Promise.all([
      getNodesbyProjectID(projectId),

      getEdgesByProjectID(projectId),
      getProjectNodeTypesbyProjectID(projectId),
      getEdgeLevelsByProjectIDString(projectId),
      getEdgeTypesByProjectIDString(projectId),
    ]);

  const adjacency = buildAdjacency(nodes, edges);

  return {
    nodes,
    edges,
    nodeTypes,
    adjacency,
    projectEdgeLevels,
    projectEdgeTypes,
  };
}
