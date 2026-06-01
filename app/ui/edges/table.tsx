import React from "react";
import { Edge } from "@/types/edge";
interface EdgeTableProps {
  edges?: Edge[];
  onEdit?: (edge: Edge) => void;
}

// Mock data to ensure the table renders out of the box
const mockEdges: Edge[] = [
  {
    edgeId: "clj123456000008mn8z2b9xyz",
    edgeName: "test edge",
    projectId: "proj_987654",
    edgeType: "test edge type",
    fromNodeId: "from nodeid",
    toNodeId: "to nodeid",
  },
];

export default function EdgeTable({
  edges = mockEdges,
  //onEdit,
}: EdgeTableProps) {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Project Edges
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all a projects edges.
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
                      Edge ID
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Edge Name
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Project ID
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Edge Type
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      From Node Id
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      to Node Id
                    </th>
                    <th scope="col" className="relative py-3 pl-6 pr-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>

                {/* Body mapped directly to the Prisma schema fields */}
                <tbody className="divide-y divide-gray-200 bg-white text-sm text-gray-700">
                  {edges.map((edge) => (
                    <tr
                      key={edge.edgeId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* edge ID */}
                      <td className="whitespace-nowrap px-4 py-4 text-xs font-mono text-gray-500 sm:pl-6">
                        {edge.edgeId}
                      </td>
                      {/* Node Name */}
                      <td className="whitespace-nowrap px-3 py-4 font-medium text-gray-900">
                        {edge.edgeName}
                      </td>
                      {/* Project ID */}
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">
                        {edge.projectId}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">
                        {edge.edgeType}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">
                        {edge.fromNodeId}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">
                        {edge.toNodeId}
                      </td>

                      {/* Actions */}
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          type="button"
                          // onClick={() => onEdit?.(node)}
                          className="text-indigo-600 hover:text-indigo-900 focus:outline-none focus:underline"
                        >
                          Edit<span className="sr-only">, {edge.edgeName}</span>
                        </button>
                      </td>
                    </tr>
                  ))}

                  {edges.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-3 py-8 text-center text-sm text-gray-500"
                      >
                        No edges found.
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
