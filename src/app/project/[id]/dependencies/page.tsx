// app/project/[id]/dependencies/page.tsx
import React from "react";
import { getProjectNodesDep } from "@/queries/nodes/actionDeps";

import DepSelectionFormClient from "@/components/ui/project/dep-selection-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DependencySelectionPage({ params }: PageProps) {
  const { id } = await params;

  let nodes = [];
  let error: string | null = null;

  try {
    // Fetch data over ultra-fast cloud network layer
    nodes = await getProjectNodesDep(id);
  } catch (err: any) {
    error = err.message || "An unexpected error occurred fetching assets.";
  }

  if (error) {
    return (
      <div className="p-8 max-w-xl mx-auto my-12 bg-red-950/40 border border-red-800 rounded-lg text-red-200">
        <h2 className="text-md font-bold mb-1">
          ⚠️ Configuration Loading Defect
        </h2>
        <p className="text-xs font-mono">{error}</p>
      </div>
    );
  }

  // Pass the raw data straight into the interactive client layout
  return <DepSelectionFormClient id={id} initialNodes={nodes} />;
}
