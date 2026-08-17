import { ProjectEdgeType } from "@prisma/client";
import { ProjectNodeType } from "@prisma/client";
import { useState } from "react";

import EdgeTypePopover from "./EdgeTypePopover";
import NodeTypePopover from "./NodeTypePopover";

interface FiltersProps {
  projectEdgeTypes: ProjectEdgeType[];
  projectNodeTypes: ProjectNodeType[];
  applyFilters: any;
}
export default function TypeFilters({
  projectEdgeTypes,
  projectNodeTypes,
  applyFilters,
}: FiltersProps) {
  const edgeTypes = projectEdgeTypes.map((edgeType) => edgeType.edgeType);
  const nodeTypes = projectNodeTypes.map((nodeType) => nodeType.nodeType);
  const [appliedEdgeTypes, setAppliedEdgeTypes] = useState<string[]>([]);
  const [appliedNodeTypes, setAppliedNodeTypes] = useState<string[]>([]);

  const applyEdgeTypes = (types: string[]) => {
    setAppliedEdgeTypes(types);
  };

  const applyNodeTypes = (types: string[]) => {
    setAppliedNodeTypes(types);
  };

  return (
    <div className="flex items-stretch gap-1.5 py-2">
      <EdgeTypePopover
        EdgeTypes={edgeTypes}
        setEdgeTypes={applyEdgeTypes}
      ></EdgeTypePopover>
      <NodeTypePopover
        NodeTypes={nodeTypes}
        setNodeTypes={applyNodeTypes}
      ></NodeTypePopover>
      <button
        className="px-4 py-2 rounded-sm font-semibold tracking-wide transition-all shadow-lg flex justify-center gap-4 bg-blue-600 hover:bg-blue-500 text-white shadow-blue-950/40 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
        onClick={() => applyFilters(appliedEdgeTypes, appliedNodeTypes)}
      >
        Apply Type filters
      </button>
    </div>
  );
  //import NodeType Popover similarly
}
