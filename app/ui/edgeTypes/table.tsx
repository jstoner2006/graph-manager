import React from "react";
import { EdgeType } from "@/types/edgeType";
interface EdgeTableProps {
  edgetype?: EdgeType[];
  onEdit?: (edgeType: EdgeType) => void;
}

// Mock data to ensure the table renders out of the box
const mockEdgeTypes: EdgeType[] = [
  {
    projectId: "proj_987654",
    edgeType: "test edge type",
  },
];

export default function EdgeTypeTable({
  edgetype = mockEdgeTypes,
  //onEdit,
}: EdgeTableProps) {
  return (
    <div>
      <div>
        <div>
          <h1>The available edge types for this project</h1>
          <p>A list of all a projects edge types.</p>
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
                    <th scope="col">Edge Type</th>

                    <th scope="col">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>

                {/* Body mapped directly to the Prisma schema fields */}
                <tbody>
                  {edgetype.map((edgeType) => (
                    <tr key={edgeType.projectId}>
                      {/* edge ID */}
                      <td>{edgeType.edgeType}</td>

                      {/* Actions */}
                      <td>
                        <button
                          type="button"
                          // onClick={() => onEdit?.(node)}
                        >
                          Edit
                          <span className="sr-only">, {edgeType.edgeType}</span>
                        </button>
                      </td>
                    </tr>
                  ))}

                  {edgetype.length === 0 && (
                    <tr>
                      <td colSpan={5}>No edges found.</td>
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
