// app/project/[id]/editNode/page.tsx
"use client"; // We explicitly tell Next.js this is a browser page now

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import NodeTable, { Node } from "@/nodes/table";

export default function ProjectNodesPage() {
  const params = useParams();
  const id = params?.id as string; // Grabs the [id] from your URL folder

  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    // Execute a standard HTTP GET request to the backend server
    fetch(`/api/nodes?projectId=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setNodes(data);
        }
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 text-sm text-gray-500">
        Loading nodes from server...
      </div>
    );
  }

  return (
    <div className="w-full">
      <NodeTable nodes={nodes} />
    </div>
  );
}
