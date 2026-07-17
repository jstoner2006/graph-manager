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
    <div>
      <div>
        <div>
          <h1>Project Edges</h1>
          <p>A list of all a projects edges.</p>
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
                    <th scope="col">Edge Name</th>

                    <th scope="col">Edge Type</th>

                    <th scope="col">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>

                {/* Body mapped directly to the Prisma schema fields */}
                <tbody>
                  {edges.map((edge) => (
                    <tr key={edge.edgeId}>
                      {/* edge ID */}

                      {/* Node Name */}
                      <td>{edge.edgeName}</td>
                      {/* Project ID */}

                      <td>{edge.edgeType}</td>
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
