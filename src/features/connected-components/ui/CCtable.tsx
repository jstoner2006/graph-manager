import React from "react";
import { Graph } from "@/types/graph";
import { ccSummary } from "@/types/ccSummary";

type ccTableProp = {
  cc?: ccSummary[];
  setSelectedConnectedComponentName: (name: string) => void;
  setShowViz: (showViz: boolean) => void;
};

// Mock data to ensure the table renders out of the box
const mockCC: ccSummary[] = [
  {
    name: "Mock Graph",
    nodeCount: "0",
    edgeCount: "0",
  },
];

export default function CCTable({
  cc = mockCC,
  setSelectedConnectedComponentName,
  setShowViz,
}: ccTableProp) {
  const applySelectName = (e: string) => {
    console.log("apply clicked with ", e);
    setSelectedConnectedComponentName(e);
    setShowViz(true);
  };
  return (
    <div>
      <div></div>

      <div>
        <div>
          <div>
            <div>
              <table>
                {/* Header using your exact formatting layout */}
                <thead>
                  <tr>
                    <th scope="col">Name</th>

                    <th scope="col">Nodes</th>
                    <th scope="col">Edges</th>

                    <th scope="col">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>

                {/* Body mapped directly to the Prisma schema fields */}
                <tbody>
                  {cc.map((cc: ccSummary) => (
                    <tr
                      key={cc.name}
                      onClick={() => applySelectName(cc.name || "")}
                    >
                      {/* edge ID */}
                      <td>{cc.name}</td>
                      {/* Node Name */}
                      <td>{cc.nodeCount}</td>
                      {/* Project ID */}

                      <td>{cc.edgeCount}</td>
                    </tr>
                  ))}

                  {cc.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-3 py-8 text-center text-sm text-gray-500"
                      >
                        No Connected Components found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
