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
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Node Types
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all available node types for this project
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
                    <th scope="col" className="px-3 py-5 font-medium">
                      Project ID
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Node Type
                    </th>
                    <th scope="col" className="relative py-3 pl-6 pr-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>

                {/* Body mapped directly to the Prisma schema fields */}
                <tbody className="divide-y divide-gray-200 bg-white text-sm text-gray-700">
                  {nodeTypes.map((nodetypes) => (
                    <tr
                      key={nodetypes.nodeType}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Node ID */}
                      <td className="whitespace-nowrap px-4 py-4 text-xs font-mono text-gray-500 sm:pl-6">
                        {nodetypes.nodeType}
                      </td>

                      {/* Node Type Status Badge */}
                      <td className="whitespace-nowrap px-3 py-4">
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800 ring-1 ring-inset ring-slate-600/10">
                          {nodetypes.nodeType}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
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
