
interface LineageElement {
  nodeId: string;
  nodeName: string;
  nodeType: string;

  edgeId: string | null;
  edgeName: string | null;

  sourceNodeId: string | null;
  targetNodeId: string | null;

  depth: number;

}export function formatGraphData(lineage: LineageElement[]) {
  const nodes = new Map();
  const edges = new Map();

  lineage.forEach((row) => {
    nodes.set(row.nodeId, {
      id: row.nodeId,
      label: row.nodeName,
      type: row.nodeType,
    });

    if (
      row.edgeId &&
      row.sourceNodeId &&
      row.targetNodeId
    ) {
      edges.set(row.edgeId, {
        id: row.edgeId,
        source: row.sourceNodeId,
        target: row.targetNodeId,
        label: row.edgeName,
      });
    }
  });

  return {
    nodes: [...nodes.values()],
    edges: [...edges.values()],
  };
}