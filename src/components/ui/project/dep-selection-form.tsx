// src/features/dependency-graph/components/SelectionFormClient.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface ProjectNode {
  nodeId: string;
  nodeName: string;
  nodeType: string;
}

interface SelectionFormClientProps {
  id: string;
  initialNodes: ProjectNode[];
}

export default function DepSelectionFormClient({
  id,
  initialNodes,
}: SelectionFormClientProps) {
  const router = useRouter();
  const [selectedNodeId, setSelectedNodeId] = useState<string>("");
  const [traversalDirection, setTraversalDirection]=useState<string>("");

  const handleAnalyzeDependencies = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNodeId) return;

    // Redirects browser natively to your next Server Component table layout
    router.push(`/project/${id}/dependencies/${selectedNodeId}`);
  };

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
            Choose a node to see all of its ancestors, descendants, or both.
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
                {initialNodes.map((node) => (
                  <option
                    key={node.nodeId}
                    value={node.nodeId}
                    className="text-slate-300 bg-slate-950"
                  >
                    {node.nodeName} ({node.nodeType.toUpperCase()})
                  </option>
                ))}
              </select>
              <select
              value={traversalDirection}
              onChange={(e)=> setTraversalDirection(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none cursor-pointer"
              >
                  <option value ="" disabled>
                Select Direction
                </option>
                <option value ="descendants">
                See Descendants
                </option>
                <option value="ancestors">
                See Ancestors
                </option>
                <option value="both">
                See Ancestors & Descendents
                </option>
              </select>
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

        {/* Empty State Boundary */}
        {initialNodes.length === 0 && (
          <div className="mt-6 p-4 bg-slate-950/40 border border-dashed border-slate-800 text-center rounded-lg text-xs text-slate-500">
            No topology elements loaded. Ensure the graph is populated with
            nodes inside your master seed scripts.
          </div>
        )}
      </div>
    </div>
  );
}
