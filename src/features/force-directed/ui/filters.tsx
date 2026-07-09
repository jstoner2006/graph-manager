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
export default function Filters({
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
    <div style={{ display: "flex" }}>
      <EdgeTypePopover
        EdgeTypes={edgeTypes}
        setEdgeTypes={applyEdgeTypes}
      ></EdgeTypePopover>
      <NodeTypePopover
        NodeTypes={nodeTypes}
        setNodeTypes={applyNodeTypes}
      ></NodeTypePopover>
      <button onClick={() => applyFilters(appliedEdgeTypes, appliedNodeTypes)}>
        Submit
      </button>
    </div>
  );
  //import NodeType Popover similarly
}
