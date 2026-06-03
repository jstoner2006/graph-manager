// app/projects/[id]/page.tsx
import { getEdgesByProjectID } from "@/app/db/edges/actions";
import ShortestPathDisplay from "@/app/ui/graphPath/ShortestPathDisplay";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectDashboardPage({ params }) {
  const { id } = await params;
  const edges = await getEdgesByProjectID(id);

  return (
    <main className="p-8">
      <h2>Route Optimizer</h2>
      {/* Example passing IDs directly */}
      <ShortestPathDisplay
        edges={edges}
        startNodeId="cmpy5mb63000f8kqnlvb1uf4b"
        endNodeId="cmpy5mb63000k8kqnktcf5vqw"
      />
    </main>
  );
}
