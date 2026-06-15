import ClientGraph from "@/features/graph-explorer/ClientGraph";
import { getGraphData } from "@/features/graph-explorer/getGraphData";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({
  params,
}: Props) {
  const { id } = await params;

  const graph = await getGraphData(id);



  return (
    <ClientGraph
      nodes={graph.nodes}
      nodeTypes={graph.nodeTypes}
      adjacency={graph.adjacency}
    />
  );
}