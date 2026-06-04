// Add this interface definition at the top of your file:
interface LineageElement {
  nodeId: string;
  nodeName: string;
  nodeType: string;
  edgeId: string | null;
  edgeName: string | null;
  depth: number;
}

export function formatGraphData(lineageElements: LineageElement[]) {
  const nodesMap = new Map();
  const edgesMap = new Map();

  lineageElements.forEach((item) => {
    // Add Node if not already present
    if (!nodesMap.has(item.nodeId)) {
      nodesMap.set(item.nodeId, {
        id: item.nodeId,
        label: item.nodeName,
        type: item.nodeType,
      });
    }

    // Add Edge if it exists in this step of the path
    if (item.edgeId) {
      edgesMap.set(item.edgeId, {
        id: item.edgeId,
        label: item.edgeName,
      });
    }
  });

  return {
    nodes: Array.from(nodesMap.values()),
    edges: Array.from(edgesMap.values()),
  };
}
