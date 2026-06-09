import React from "react";
import { getEdgesByProjectID } from "@/queries/edges/actions";
import EdgeTable from "@/components/ui/edges/table";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditEdgePage({ params }: PageProps) {
  console.log("edit edges page ran");
  const { id } = await params;

  const edges = await getEdgesByProjectID(id);
  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <EdgeTable edges={edges} />
      </div>
    </div>
  );
}
