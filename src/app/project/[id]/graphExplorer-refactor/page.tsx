import ClientGraph from "@/features/graph-explorer-refactor/ClientGraph";
import { getGraphData } from "@/features/graph-explorer-refactor/getGraphData";
import { ProjectGraphContext } from "@/types/project-graph-context";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const graphContext: ProjectGraphContext = await getGraphData(id);

  return (
    <ClientGraph
      nodes={graphContext.nodes}
      edges={graphContext.edges}
      nodeTypes={graphContext.nodeTypes}
      edgeLevels={graphContext.edgeLevels}
      edgeTypes={graphContext.edgeTypes}
    />
  );
}
