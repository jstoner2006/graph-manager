"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface ProjectNode {
  nodeId: string;
  nodeName: string;
  nodeType: string;
}

export default function DependencySelectionPage() {
  const params = useParams();
  const router = useRouter();
  console.log("dep page found");
  // Extract the project dynamic ID parameter token
  const id = params.id as string;

  const [nodes, setNodes] = useState<ProjectNode[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the project nodes on mount to populate the dropdown selection
  useEffect(() => {
    async function fetchProjectNodes() {
      try {
        setLoading(true);
        const res = await fetch(`/api/project/${id}/nodes`);

        if (!res.ok) {
          throw new Error(
            `Failed to load project node configuration. Status: ${res.status}`,
          );
        }

        const json = await res.json();
        setNodes(json.nodes || []);
      } catch (err: any) {
        setError(
          err.message ||
            "An unexpected network error occurred fetching workspace assets.",
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProjectNodes();
    }
  }, [id]);

  // Handle routing navigation to the transitive closure lineage table layout page
  const handleAnalyzeDependencies = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNodeId) return;

    // Directs the browser straight to your table display component route tree:
    // app/project/[id]/dependencies/[nodeId]/page/page.tsx
    router.push(`/project/${id}/dependencies/${selectedNodeId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-400">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm">Mapping project directory nodes...</p>
        </div>
      </div>
    );
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        {/* Header Block */}
        <div className="mb-6">
          <div className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-1">
            Graph Analysis Portal
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Select Root Lineage Node
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Choose any asset inside Project{" "}
            <span className="font-mono text-slate-300 bg-slate-950 px-1.5 py-0.5 rounded text-xs">
              {id}
            </span>{" "}
            to construct its complete downstream forward reachability dependency
            closure path.
          </p>
        </div>

        {/* Input Selector Form */}
        <form onSubmit={handleAnalyzeDependencies} className="space-y-6">
          <div>
            <label
              htmlFor="node-select"
              className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2"
            >
              Available Graph Targets
            </label>
            <div className="relative">
              <select
                id="node-select"
                value={selectedNodeId}
                onChange={(e) => setSelectedNodeId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>
                  -- Select an asset target --
                </option>
                {nodes.map((node) => (
                  <option
                    key={node.nodeId}
                    value={node.nodeId}
                    className="text-slate-300 bg-slate-950"
                  >
                    {node.nodeName} ({node.nodeType.toUpperCase()})
                  </option>
                ))}
              </select>
              {/* Custom SVG dropdown caret arrow */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Execution Button Action */}
          <button
            type="submit"
            disabled={!selectedNodeId}
            className={`w-full py-3 px-4 rounded-lg font-semibold tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 ${
              selectedNodeId
                ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-950/40 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                : "bg-slate-800 text-slate-500 shadow-none cursor-not-allowed"
            }`}
          >
            <span>Analyze Downstream Dependencies</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </form>

        {/* Dynamic Context Empty State Flag */}
        {nodes.length === 0 && (
          <div className="mt-6 p-4 bg-slate-950/40 border border-dashed border-slate-800 text-center rounded-lg text-xs text-slate-500">
            No topology elements loaded. Ensure the graph is populated with
            nodes inside your master seed scripts.
          </div>
        )}
      </div>
    </div>
  );
}
