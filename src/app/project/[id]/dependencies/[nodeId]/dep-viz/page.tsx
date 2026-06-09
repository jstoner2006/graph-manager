import LineageGraph from "@/components/ui/graphPath/lineageGraph";
import { getDependentsVizData } from "@/features/dependencies-downstream/getDependentsVizData";

interface PageProps {
  params: Promise<{
    id: string;
    nodeId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  // 1. Await parameters natively resolved by the Next.js routing tree
  const { id, nodeId } = await params;

  // 2. Direct memory invocation within the cloud infrastructure (Zero HTTP / Serialization tax)
  const json = await getDependentsVizData(id, nodeId);

  if (!json.success || !json.data) {
    throw new Error("Failed to load graph data");
  }

  // 3. Unpack live object arrays directly from the server engine
  const { nodes, edges } = json.data;

  return (
    <main
      style={{
        width: "100%",
        height: "100vh",
      }}
    >
      {/* 4. Stream pre-compiled structured graph elements straight to the client canvas canvas layout */}
      <LineageGraph nodes={nodes} edges={edges} />
    </main>
  );
}
