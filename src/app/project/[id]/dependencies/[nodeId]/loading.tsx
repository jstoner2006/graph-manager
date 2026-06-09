// app/project/[id]/dependencies/[nodeId]/loading.tsx
import React from "react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 text-slate-400">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-medium">
          Executing Recursive Dependency Analysis CTE...
        </p>
      </div>
    </div>
  );
}
