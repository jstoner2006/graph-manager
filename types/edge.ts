// types/edge.ts

export interface Edge {
  edgeId: string;
  edgeName: string;
  projectId: string;
  edgeType: string;
  fromNodeId: string;
  toNodeId: string;
}