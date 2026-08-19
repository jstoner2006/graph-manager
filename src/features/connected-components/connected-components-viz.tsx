import { ReactFlow, useReactFlow, ReactFlowProvider } from "@xyflow/react";
import { Graph } from "@/types/graph";

import { useEffect, useRef } from "react";
import { layoutWithDagre } from "@/utils/graph.layout";

interface ConnectedComponentsCanvasProp {
  ConnectedComponent: Graph;
}

export function ConnectedComponentsCanvasViz({
  ConnectedComponent: cc,
}: ConnectedComponentsCanvasProp) {
  const shouldRender = cc.edges.length > 0 ? true : true;

  const { setViewport, fitView, setCenter, getNode, getZoom } = useReactFlow();

  const layoutedGraph = layoutWithDagre(cc);
  const prominentNode = cc.nodes.find((n) => cc.name === n.data.label);
  const prominentNodeId = prominentNode?.id || "";
  const isMeasured = prominentNode?.measured?.width !== undefined;
  const prevProminentNodeId = useRef(prominentNodeId);

  ///focus on react flow layout on to the center of the
  //most prominent node
  useEffect(() => {
    if (!prominentNodeId || !isMeasured) return;

    //we need to force reset the viewport when the prominentNodeId changes
    const isNewGraph = prevProminentNodeId.current !== prominentNodeId;
    if (isNewGraph) {
      prevProminentNodeId.current = prominentNodeId;

      setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 0 });
    }

    // 1. Instantly fit all nodes to calculate the max zoom level
    // where no node gets clipped off-screen
    fitView({ padding: 0.2, duration: 0 });
    const fittedZoom = getZoom();

    // Pull the fresh object out of the core React Flow layout cache
    const activeNode = getNode(prominentNodeId);

    if (activeNode && activeNode.measured?.width !== undefined) {
      const nodeWidth = activeNode.measured.width;
      const nodeHeight = activeNode.measured.height ?? 40;

      const targetX = activeNode.position.x + nodeWidth / 2;
      const targetY = activeNode.position.y + nodeHeight / 2;

      setCenter(targetX, targetY, {
        zoom: fittedZoom,
        duration: 700,
      });
    }
  }, [
    prominentNodeId,
    isMeasured,
    setCenter,
    getNode,
    getZoom,
    setViewport,
    fitView,
  ]); // 🚀 Tracks the exact moment measurements lock in

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
            nodes={layoutedGraph.nodes}
            edges={layoutedGraph.edges}
            fitView
          ></ReactFlow>
        </div>
      ) : (
        <div>{cc.name} does not have any</div>
      )}
    </div>
  );
}

export default function ConnectedComponentsViz({
  //nodes: initialNodes,
  //edges: InitialEdges,
  ConnectedComponent: cc,
}: ConnectedComponentsCanvasProp) {
  return (
    <ReactFlowProvider>
      <ConnectedComponentsCanvasViz
        ConnectedComponent={cc}
      ></ConnectedComponentsCanvasViz>
    </ReactFlowProvider>
  );
}
