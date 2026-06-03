import React from "react";
import { ProjectNodeType } from "@/types/nodeType";
interface NodeTypesTableProps {
  nodeTypes?: ProjectNodeType[];
  onEdit?: (nodetypes: ProjectNodeType) => void;
}

// Mock data to ensure the table renders out of the box
const mockNodeTypes: ProjectNodeType[] = [
  {
    projectId: "proj_987654",
    nodeType: "API_GATEWAY",
  },
];

export default function NodeTypesTable({
  nodeTypes = mockNodeTypes,
  //onEdit,
}: NodeTypesTableProps) {
  return (
    <div>
      <div>
        <div>
          <h1>Node Types</h1>
          <p>A list of all available node types for this project</p>
        </div>
      </div>

      <div>
        <div>
          <div>
            <div>
              <table>
                {/* Header using your exact formatting layout */}
                <thead>
                  <tr>
                    <th scope="col">Project ID</th>
                    <th scope="col">Node Type</th>
                    <th scope="col">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>

                {/* Body mapped directly to the Prisma schema fields */}
                <tbody>
                  {nodeTypes.map((nodetypes) => (
                    <tr key={nodetypes.nodeType}>
                      {/* Node ID */}
                      <td>{nodetypes.nodeType}</td>

                      {/* Node Type Status Badge */}
                      <td>
                        <span>{nodetypes.nodeType}</span>
                      </td>
                      {/* Actions */}
                      <td>
                        <button
                          type="button"
                          // onClick={() => onEdit?.(node)}
                          className="text-indigo-600 hover:text-indigo-900 focus:outline-none focus:underline"
                        >
                          Edit
                          <span className="sr-only">
                            , {nodetypes.nodeType}
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}

                  {nodeTypes.length === 0 && (
                    <tr>
                      <td colSpan={5}>No nodes found.</td>
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
