import Denque from "denque";

import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  Edge as RfEdge,
  Node as RfNode,
} from "@xyflow/react";
import { Target } from "lucide-react";

import { Node } from "@/types/node";
import { Edge } from "@/types/edge";
import { Graph } from "@/types/graph";

type GraphAdjacency = {
  outgoing: Record<string, string[]>;
  incoming: Record<string, string[]>;
};

/** Given array of nodes and edges returns
 * an array where each record are the nodes and edges
 * of each connected component returns the orginal
 * edges and nodes
 */
export const ConnectedComponentsData = (
  InitialNodes: Node[],
  InitialEdges: Edge[],
): Graph[] => {
  console.log(
    "generating connected components started with ",
    InitialEdges.length,
    " edges and",
    InitialNodes.length,
    " nodes",
  );
  const nodeMap = new Map();
  for (const n of InitialNodes) {
    nodeMap.set(n.id, n);
  }

  const adj = new Map();

  for (const e of InitialEdges) {
    const o = e.source;
    const d = e.target;

    if (!adj.has(o)) {
      adj.set(o, []);
    }
    if (!adj.has(d)) {
      adj.set(d, []);
    }
    adj.get(o).push(d);
    adj.get(d).push(o);
  }

  const painted = new Set();
  const cc_array: Graph[] = [];
  const q = new Denque<string>();

  for (const n of InitialNodes) {
    const start_id: string = n.id;

    //if the node has
    //not been visited and has edges add it to the
    if (!painted.has(start_id) && adj.has(start_id)) {
      const nodes: Node[] = [];
      const edges: Edge[] = [];
      let totalNodeCount = 1;
      let totalEdgeCount = 0;

      //add this node
      nodes.push(n);
      painted.add(start_id);
      q.push(start_id);

      let most_prom_node_name = "";
      let most_prom_node_count = 0;
      //start the bfs
      while (q.length > 0) {
        const curr_node: string | undefined = q.shift();
        let n_count = 0;
        totalNodeCount++;
        for (const neigh of adj.get(curr_node)) {
          //visit the neighbor if it
          //hasn't been visited
          if (!painted.has(neigh)) {
            nodes.push(nodeMap.get(neigh));
            painted.add(neigh);
            n_count++;

            q.push(neigh);
          }
        }
        totalEdgeCount = totalEdgeCount + n_count;

        if (n_count > most_prom_node_count) {
          most_prom_node_name = nodeMap.get(curr_node).data.label;
          most_prom_node_count = n_count;
        }
      }
      //go back through the edges and capture
      //any that are in the current component
      for (const e of InitialEdges) {
        for (const n of nodes) {
          if (e.source === n.id) {
            edges.push(e);
          }
        }
      }

      cc_array.push({
        name: most_prom_node_name,
        nodes: nodes,
        edges: edges,
        nodeCount: totalNodeCount,
        edgeCount: totalEdgeCount,
      });
    } else if (!adj.has(start_id)) {
      //if there are nodes without edges they are their own connected component
      const emptyEdgeArray: Edge[] = [];
      cc_array.push({
        name: nodeMap.get(start_id).data.label,
        nodes: [nodeMap.get(start_id)],
        edges: emptyEdgeArray,
        nodeCount: 1,
        edgeCount: 0,
      });
    }
  }
  console.log(cc_array.length, "Connected Components generated");

  return cc_array;
};
