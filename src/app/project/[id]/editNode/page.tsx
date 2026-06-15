// app/project/[id]/editNode/page.tsx
import React from "react";
import { getNodesbyProjectID } from "@/queries/nodes/action";
import NodeTable from "@/components/ui/nodes/table";

interface PageProps {
  params: Promise<{
    id: string; // Must match your folder segment [id] exactly
  }>;
}

export default async function EditNodePage({ params }: PageProps) {
  // 1. Resolve the parameter from the dynamic URL route path

  const { id } = await params;

  // 2. Safely fetch the array right on the server
  const nodes = await getNodesbyProjectID(id);

  // 3. Hand the raw array straight down to your presentation table
  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <NodeTable nodes={nodes} />
      </div>
    </div>
  );
}
