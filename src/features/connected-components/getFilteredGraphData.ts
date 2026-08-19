import { Graph } from "@/types/graph";
import { getEdgesByProjectIDandEdgeType } from "@/queries/edges/specific_edges";
import { getNodesByProjectIDandNodeType } from "@/queries/nodes/specific_nodes";
import { Node as PrismaNode, Edge as PrismaEdge } from "@prisma/client";
import { Node } from "@/types/node";
import { Edge } from "@/types/edge";

type getFilteredGraphDataProp = {
  NodeTypes: string[];
  EdgeTypes: string[];
  ProjectId: string;
};

/**
 * Given a project ID and node and edge types returns a graph object filtered to the given node and edge types
 */
export async function getFilteredGraphData({
  NodeTypes,
  EdgeTypes,
  ProjectId,
}: getFilteredGraphDataProp): Promise<Graph> {
  const filteredEdges: Promise<PrismaEdge[]> = getEdgesByProjectIDandEdgeType(
    ProjectId,
    EdgeTypes,
  );
  const filteredNodes: Promise<PrismaNode[]> = getNodesByProjectIDandNodeType(
    ProjectId,
    NodeTypes,
  );

  const formattedEdges: Edge[] = (await filteredEdges).map((e) => ({
    id: String(e.edgeId),
    source: String(e.fromNodeId),
    target: String(e.toNodeId),
    data: { weight: Number(e.edgeWeight || 0.5) },
  }));

  const formattedNodes: Node[] = (await filteredNodes).map((n) => ({
    id: n.nodeId,
    data: { label: n.nodeName },
    position: { x: 0, y: 0 },
  }));

  const graph: Graph = { nodes: formattedNodes, edges: formattedEdges };
  return graph;
}
