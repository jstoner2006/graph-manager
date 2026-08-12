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
import { ProjectGraphContext } from "@/types/project-graph-context";
import { toNode } from "@/utils/node.mapper";
import { toEdge } from "@/utils/edge.mapper";
import { Nodes } from "@/types/nodes";
import { Edges } from "@/types/edges";

export type GraphAdjacency = {
  outgoing: Record<string, string[]>;
  incoming: Record<string, string[]>;
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

export async function getGraphData(
  projectId: string,
): Promise<ProjectGraphContext> {
  const [nodes, edges, nodeTypes, projectEdgeLevels, projectEdgeTypes] =
    await Promise.all([
      getNodesbyProjectID(projectId),

      getEdgesByProjectID(projectId),
      getProjectNodeTypesbyProjectID(projectId),
      getEdgeLevelsByProjectIDString(projectId),
      getEdgeTypesByProjectIDString(projectId),
    ]);

  const adjacency = buildAdjacency(nodes, edges);
  const fNodes: Nodes = nodes.map((n) => toNode(n));
  const fEdges: Edges = edges.map((e) => toEdge(e));
  const fNodeTypes: string[] = nodeTypes.map((n) => n.nodeType);

  return {
    nodes: fNodes,
    edges: fEdges,
    nodeTypes: fNodeTypes,
    edgeLevels: projectEdgeLevels,
    edgeTypes: projectEdgeTypes,
  };
}
