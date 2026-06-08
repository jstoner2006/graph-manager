// app/project/[id]/dependencies/[nodeId]/page.tsx
import React from "react";
import Link from "next/link";
import { getDependentsData } from "@/lib/getDependentsData";

interface PageProps {
  // Matches your folder tokens exactly, keeping 'id' unchanged
  params: Promise<{ id: string; nodeId: string }>;
}

// Notice the component is marked as standard async! No client hooks needed.
export default async function LineageTablePage({ params }: PageProps) {
  const { id, nodeId } = await params;

  let graph = null;
  let metrics = null;
  let error: string | null = null;

  try {
    // Await the data directly in the cloud infrastructure
    const json = await getDependentsData(id, nodeId);
    if (json.success) {
      graph = json.data;
      metrics = json.metrics;
    } else {
      throw new Error("Data retrieval returned an unsuccessful state flag.");
    }
  } catch (err: any) {
    error = err.message || "An unexpected error occurred running analysis";
  }

  // Error State Layout View
  if (error) {
    return (
      <div className="p-8 max-w-2xl mx-auto my-12 bg-red-950/40 border border-red-800 rounded-lg text-red-200">
        <h2 className="text-lg font-bold mb-2">❌ Analysis Module Failed</h2>
        <p className="text-sm bg-red-950/60 p-3 rounded font-mono break-all">
          {error}
        </p>
      </div>
    );
  }

  // Pure Server Render — Completely zero client loading states required here!
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      {/* Header Area */}
      <header className="mb-8 border-b border-slate-800 pb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider bg-emerald-950/50 px-2 py-1 rounded border border-emerald-800/60">
              Transitive Closure Layer
            </span>
            <h1 className="text-2xl font-bold tracking-tight mt-2 text-white">
              Lineage Dependency Inventory
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Project Workspace ID:{" "}
              <span className="font-mono text-slate-300 mr-4">{id}</span> Target
              Node ID:{" "}
              <span className="font-mono text-slate-300">{nodeId}</span>
            </p>
          </div>

          {/* Metadata Badges */}
          {metrics && (
            <div className="flex gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg min-w-[120px]">
                <div className="text-xs text-slate-400">Downstream Nodes</div>
                <div className="text-2xl font-bold text-white mt-1">
                  {metrics.totalNodes}
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg min-w-[120px]">
                <div className="text-xs text-slate-400">Dependency Edges</div>
                <div className="text-2xl font-bold text-white mt-1">
                  {metrics.totalEdges}
                </div>
              </div>
              <Link
                href={`/project/${id}/dependencies/${nodeId}/dep-viz`}
                className="block"
              >
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg min-w-[120px] hover:bg-slate-800 transition-colors cursor-pointer">
                  <div className="text-xs text-slate-400">Go to Visual</div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Grid Tables Split */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* 1. NODES INVENTORY TABLE */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-850 border-b border-slate-800 flex justify-between items-center">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              DownStream Nodes ({graph?.nodes.length || 0})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-medium">
                  <th className="p-4">Name Mapping</th>
                  <th className="p-4">Object Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {graph?.nodes.map((node) => (
                  <tr
                    key={node.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="p-4 font-semibold text-slate-200">
                      {node.label}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium border capitalize ${
                          node.type === "server"
                            ? "bg-red-950/40 text-red-400 border-red-900/50"
                            : node.type === "report metric"
                              ? "bg-blue-950/40 text-blue-400 border-blue-900/50"
                              : "bg-slate-950/60 text-emerald-400 border-emerald-900/40"
                        }`}
                      >
                        {node.type}
                      </span>
                    </td>
                  </tr>
                ))}
                {graph?.nodes.length === 0 && (
                  <tr>
                    <td colSpan={2} className="p-8 text-center text-slate-500">
                      No downstream dependents found for this node.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. EDGES RELATIONSHIP TABLE */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-850 border-b border-slate-800 flex justify-between items-center">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              Dependency Relationships ({graph?.edges.length || 0})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-medium">
                  <th className="p-4">Dependency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {graph?.edges.map((edge) => (
                  <tr
                    key={edge.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="p-4 text-slate-300 font-medium">
                      {edge.label}
                    </td>
                  </tr>
                ))}
                {graph?.edges.length === 0 && (
                  <tr>
                    <td colSpan={1} className="p-8 text-center text-slate-500">
                      No intermediate relationship vectors map from this node.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
