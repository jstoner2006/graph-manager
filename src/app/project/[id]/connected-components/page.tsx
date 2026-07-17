import { getEdgesByProjectIDandEdgeType } from "@/queries/edges/specific_edges";

import { getEdgeTypesByProjectID } from "@/queries/edgetypes/actions";
import { getProjectNodeTypesbyProjectID } from "@/queries/nodetypes/action";
import { getNodesbyProjectID } from "@/queries/nodes/action";

import "@xyflow/react/dist/style.css";
import ConnectedComponentsContainer from "@/features/connected-components/ConnectedComponents-container";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  // 1. Concurrently fetch the nodes and available edge types for the selector
  const [projectEdgeTypes, projectNodeTypes] = await Promise.all([
    getEdgeTypesByProjectID(id),
    getProjectNodeTypesbyProjectID(id),
  ]);

  // 2. Load the initial edge dataset (empty array means load all edge types)
  const initialEdges = await getEdgesByProjectIDandEdgeType(id, []);

  return (
    <ConnectedComponentsContainer
      projectId={id}
      projectEdgeTypes={projectEdgeTypes}
      projectNodeTypes={projectNodeTypes}
    />
  );
}
