import { getEdgesByProjectID } from "@/app/db/edges/actions";
import { getNodesbyProjectID } from "@/app/db/nodes/action";
import RouteOptimizerSection from "@/app/ui/graphPath/RouteOptimizerSection";

export default async function ProjectDashboardPage({ params }) {
  const { id } = await params;
  const edges = await getEdgesByProjectID(id);
  const nodes = await getNodesbyProjectID(id);

  return (
    <main className="p-8">
      <h2>Route Optimizer</h2>
      {/* The client wrapper takes over the state interaction */}
      <RouteOptimizerSection edges={edges} nodes={nodes} />
    </main>
  );
}
