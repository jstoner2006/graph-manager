import { getEdgesByProjectIDandEdgeType } from "@/queries/edges/specific_edges";

import { getEdgeTypesByProjectID } from "@/queries/edgetypes/actions";
import { getNodesbyProjectID } from "@/queries/nodes/action";

import "@xyflow/react/dist/style.css";
import ClientWeightedFlowPage from "@/features/affinity-network/clientD3-force";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  // 1. Concurrently fetch the nodes and available edge types for the selector
  const [nodes, projectEdgeTypes] = await Promise.all([
    getNodesbyProjectID(id),
    getEdgeTypesByProjectID(id),
  ]);

  // 2. Load the initial edge dataset (empty array means load all edge types)
  const initialEdges = await getEdgesByProjectIDandEdgeType(id, []);

  return (
    <ClientWeightedFlowPage
      projectId={id}
      initialNodes={nodes}
      initialEdges={initialEdges}
      projectEdgeTypes={projectEdgeTypes}
    />
  );
}
