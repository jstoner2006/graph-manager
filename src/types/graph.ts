import { Edges } from "./edges";
import { Nodes } from "./nodes";

export type Graph = {
  nodes: Nodes;
  edges: Edges;
  name?: string;
  nodeCount?: number;
  edgeCount?: number;
};
