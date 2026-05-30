import React from "react";

// 1. Define the TypeScript interface based on your Prisma Model
export interface Node {
  nodeId: string;
  nodeName: string;
  projectId: string;
  nodeType: string;
  // Relations are omitted here as they are typically fetched separately,
  // but you can add them if your API returns them included.
}

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
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Project Nodes
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all nodes within the network architecture including their
            names, associated projects, and types.
          </p>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg bg-white">
              <table className="min-w-full divide-y divide-gray-300">
                {/* Header using your exact formatting layout */}
                <thead className="bg-gray-50 text-left text-sm font-normal text-gray-900 rounded-lg">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Node ID
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Node Name
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Project ID
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Type
                    </th>
                    <th scope="col" className="relative py-3 pl-6 pr-3">
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
                      <td className="whitespace-nowrap px-4 py-4 text-xs font-mono text-gray-500 sm:pl-6">
                        {node.nodeId}
                      </td>
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
