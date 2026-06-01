// app/project/[id]/editNode/page.tsx
import React from "react";
import EdgeTypeTable from "@/app/ui/edgeTypes/table";
import { getEdgeTypesByProjectID } from "@/app/db/edgetypes/actions";

interface PageProps {
  params: Promise<{
    id: string; // Must match your folder segment [id] exactly
  }>;
}

export default async function EditEdgeTypePage({ params }: PageProps) {
  // 1. Resolve the parameter from the dynamic URL route path
  console.log("edit edge type page ran");
  const { id } = await params;

  // 2. Safely fetch the array right on the server
  const edgetypes = await getEdgeTypesByProjectID(id);

  // 3. Hand the raw array straight down to your presentation table
  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <EdgeTypeTable edgetype={edgetypes} />
      </div>
    </div>
  );
}
