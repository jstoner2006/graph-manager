// app/project/[id]/editNode/page.tsx
import React from "react";
import { getProjectNodeTypesbyProjectID } from "@/app/db/nodetypes/action";
import NodeTypesTable from "@/app/ui/nodeTypes/table";

interface PageProps {
  params: Promise<{
    id: string; // Must match your folder segment [id] exactly
  }>;
}

export default async function EditNodePage({ params }: PageProps) {
  // 1. Resolve the parameter from the dynamic URL route path
  console.log("edit node page ran");
  const { id } = await params;

  // 2. Safely fetch the array right on the server
  const nodeTypes = await getProjectNodeTypesbyProjectID(id);

  // 3. Hand the raw array straight down to your presentation table
  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <NodeTypesTable nodeTypes={nodeTypes} />
      </div>
    </div>
  );
}
