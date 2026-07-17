import { Node } from "@prisma/client";
import { Edge } from "@prisma/client";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  SelectionMode,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";

import dagre from "dagre";

interface ConnectedComponentsVizProp {
  //nodes: Node[];
  //edges: Edge[];
  ConnectedComponent: any;
}

function layoutWithDagre(nodesBase: any[], edgesBase: any[]) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "LR", nodesep: 80, ranksep: 320 });

  console.log(nodesBase);
  nodesBase.forEach((node) => {
    g.setNode(node.id, { width: node.measured?.width ?? 180, height: 40 });
  });

  edgesBase.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  return nodesBase.map((node) => {
    const pos = g.node(node.id);
    return {
      ...node,
      position: { x: pos?.x ?? 0, y: pos?.y ?? 0 },
    };
  });
}

export default function ConnectedComponentsViz({
  //nodes: initialNodes,
  //edges: InitialEdges,
  ConnectedComponent: cc,
}: ConnectedComponentsVizProp) {
  console.log("rendering began with ", cc.nodes, "and ", cc.edges);
  const shouldRender = cc.edges > 0 ? true : true;

  //debugger;
  const layoutedNodes = layoutWithDagre(cc.nodes, cc.edges);

  console.log("laid out nodes", layoutedNodes);

  return (
    <div>
      <p>
        Currently visualizing connected component, where <em>{cc.name}</em> is
        the most prominent node.
      </p>
      {shouldRender ? (
        <div
          style={{
            height: "800px",
            width: "100%",
          }}
        >
          <ReactFlow
            nodes={layoutedNodes}
            edges={cc.edges}
            colorMode="dark"
          ></ReactFlow>
        </div>
      ) : (
        <div>{cc.name} does not have any</div>
      )}
    </div>
  );
}
