import React from "react";
import { Node } from "@/types/node";
interface NodeTableProps {
  nodes?: Node[];
  onEdit?: (node: Node) => void;
}

// Mock data to ensure the table renders out of the box
const mockNodes: Node[] = [
  {
    nodeId: "clj123456000008mn8z2b9xyz",
    nodeName: "Primary Authentication API",
    projectId: "proj_987654",
    nodeType: "API_GATEWAY",
  },
  {
    nodeId: "clj789012000108mn8z2b9abc",
    nodeName: "Users PostgreSQL Cache",
    projectId: "proj_987654",
    nodeType: "DATABASE",
  },
];

export default function NodeTable({
  nodes = mockNodes,
  //onEdit,
}: NodeTableProps) {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
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
                    <th scope="col">Node ID</th>
                    <th scope="col">Node Name</th>
                    <th scope="col">Project ID</th>
                    <th scope="col">Type</th>
                    <th scope="col">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>

                {/* Body mapped directly to the Prisma schema fields */}
                <tbody className="divide-y divide-gray-200 bg-white text-sm text-gray-700">
                  {nodes.map((node) => (
                    <tr
                      key={node.nodeId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Node ID */}
                      <td>{node.nodeId}</td>
                      {/* Node Name */}
                      <td className="whitespace-nowrap px-3 py-4 font-medium text-gray-900">
                        {node.nodeName}
                      </td>
                      {/* Project ID */}
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">
                        {node.projectId}
                      </td>
                      {/* Node Type Status Badge */}
                      <td className="whitespace-nowrap px-3 py-4">
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800 ring-1 ring-inset ring-slate-600/10">
                          {node.nodeType}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          type="button"
                          // onClick={() => onEdit?.(node)}
                          className="text-indigo-600 hover:text-indigo-900 focus:outline-none focus:underline"
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
