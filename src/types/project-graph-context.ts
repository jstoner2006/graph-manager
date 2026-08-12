import { Edges } from "./edges";
import { Nodes } from "./nodes";

/**
 * Stores all context to generate filtered graphs from a project
 */
export interface ProjectGraphContext {
  nodes: Nodes;
  edges: Edges;
  nodeTypes: string[];
  edgeTypes: string[];
  edgeLevels: string[];
}
