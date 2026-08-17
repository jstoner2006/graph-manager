import { ProjectEdgeType } from "@prisma/client";
import { ProjectNodeType } from "@prisma/client";
import { useState } from "react";

import ConnectedComponentPopover from "./ConnectedComponentPopover";

interface ConnectedComponentFilterProps {
  ConnectedComponents: any;
  applyConnectedComponentfilter: any;
  setShowViz: any;
}
//takes the connected components to filter
//and function to promote the selection
// on button press
export default function ConnectedComponentFilter({
  ConnectedComponents,
  applyConnectedComponentfilter,
  setShowViz,
}: ConnectedComponentFilterProps) {
  const [selectedConnectedComponent, setselectedConnectedComponent] = useState(
    [],
  );

  const applyFilter = () => {
    console.log(
      "attempt to render ",
      selectedConnectedComponent?.edges?.length,
      " edges",
    );
    applyConnectedComponentfilter(selectedConnectedComponent);
    if (selectedConnectedComponent?.edges?.length > 0) {
      setShowViz(true);
    } else setShowViz(true);
  };

  return (
    <div className="flex items-stretch gap-1.5 py-2">
      <ConnectedComponentPopover
        ConnectedComponents={ConnectedComponents}
        setConnectedComponent={setselectedConnectedComponent}
      ></ConnectedComponentPopover>
      <button
        className="px-4 py-2 rounded-sm font-semibold tracking-wide transition-all shadow-lg flex justify-center gap-4 bg-blue-600 hover:bg-blue-500 text-white shadow-blue-950/40 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
        onClick={applyFilter}
      >
        Render Connected Component
      </button>
      {ConnectedComponents[0].name !== "og name" ? (
        <div>Total Number of components {ConnectedComponents.length}</div>
      ) : (
        <div>Nothing rendered yet</div>
      )}
    </div>
  );
  //import NodeType Popover similarly
}
