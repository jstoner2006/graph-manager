import React from "react";
import { Node } from "@prisma/client";
interface NodeTableProps {
  nodes?: Node[];
  onEdit?: (node: Node) => void;
}

// Mock data to ensure the table renders out of the box
const mockNodes: Node[] = [
  {
    nodeId: "clj123456000008mn8z2b9xyz",
    nodeName: "Primary Authentication API",
    nodeDisplayName: "Primary Authentication API",
    projectId: "proj_987654",
    nodeType: "API_GATEWAY",
    url: "",
    attributes: "",
    last_update_dts: new Date(),
    insert_dts: new Date(),
    insert_user_name: "",
  },
];

export default function NodeTable({
  nodes = mockNodes,
  //onEdit,
}: NodeTableProps) {
  return (
    <div>
      <div>
        <div>
          <h1>Project Nodes</h1>
          <p>
            A list of all nodes within the network architecture including their
            names, associated projects, and types.
          </p>
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
                    <th scope="col">Name</th>
                    <th scope="col">Node Type</th>
                    <th scope="col">Last Updated</th>
                    <th scope="col">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>

                {/* Body mapped directly to the Prisma schema fields */}
                <tbody>
                  {nodes.map((node) => (
                    <tr
                      key={node.nodeId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Node ID */}

                      {/* Node Name */}
                      <td>{node.nodeDisplayName}</td>
                      {/* Project ID */}

                      {/* Node Type Status Badge */}
                      <td>
                        <span>{node.nodeType}</span>
                      </td>
                      <td>
                        <span>{node.last_update_dts.toString()}</span>
                      </td>

                      {/* Actions */}
                      <td>
                        <button
                          type="button"
                          // onClick={() => onEdit?.(node)}
                        >
                          Edit<span className="sr-only">, {node.nodeName}</span>
                        </button>
                      </td>
                    </tr>
                  ))}

                  {nodes.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-3 py-8 text-center text-sm text-gray-500"
                      >
                        No nodes found.
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
