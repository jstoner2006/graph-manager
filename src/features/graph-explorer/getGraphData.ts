import { getEdgesByProjectID } from "@/queries/edges/actions";
import { getNodesbyProjectID } from "@/queries/nodes/action";
import { getProjectNodeTypesbyProjectID } from "@/queries/nodetypes/action";
import { getEdgeLevelsByProjectID } from "@/queries/edgeLevels/actions";
import { ProjectEdgeLevel } from "@prisma/client";
import { Edge } from "@/types/edge";
import { Node } from "@/types/node"; // ✅ Explicit Type reference
import { EdgeType } from "@/types/edgeType";
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
  const [nodes, edges, nodeTypes, projectEdgeLevels] = await Promise.all([
    getNodesbyProjectID(projectId),

    getEdgesByProjectID(projectId),
    getProjectNodeTypesbyProjectID(projectId),
    getEdgeLevelsByProjectID(projectId),
  ]);

  const adjacency = buildAdjacency(nodes, edges);
  //  console.log(adjacency.outgoing["cmqptr6vr00x2m0qnclmb8vtf"]); correctly getting 127
  // console.log(adjacency.outgoing["cmqptr6vq00cwm0qnh7a9dxlp"]); correctly getting 1
  //console.log(adjacency.outgoing["cmqptr6vq00ctm0qnkhz6z9mo"]); correctly getting 10
  //console.log(adjacency.outgoing["cmqptr6vq00igm0qny7i3l358"]); correctly getting 4

  console.log(
    "adjacency.outgoing.length",
    Object.keys(adjacency.outgoing).length,
  );

  console.log(
    "adjacency.incoming.length",
    Object.keys(adjacency.incoming).length,
  );

  return {
    nodes,
    edges,
    nodeTypes,
    adjacency,
    projectEdgeLevels,
  };
}
