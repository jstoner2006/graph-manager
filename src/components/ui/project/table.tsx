// projects/table.tsx
import React from "react";
import Link from "next/link"; // ✅ Standard HTML routing link for server safety
import { ProjectData } from "@/types/project";

interface ProjectTableProps {
  projects: ProjectData[];
  // Note: onSelectProject is removed because routing is now handled directly by the URL path
}

export default function ProjectTable({ projects }: ProjectTableProps) {
  return (
    <div>
      <div>
        <div>
          <h1>Workspace Projects</h1>
          <p>All projects.</p>
        </div>
      </div>

      <div>
        <div>
          <div>
            <div>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Project ID</th>
                    <th scope="col">Project Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {projects.map((project) => (
                    <tr
                      key={project.projectId}
                      className="hover:bg-blue-500 dark:hover:bg-slate-800/60 transition-colors duration-150 ease-in-out"
                    >
                      {/* Project ID */}
                      <td>{project.projectId}</td>
                      {/* Project Name */}
                      <td>{project.projectName}</td>
                      {/* Description */}
                      <td>
                        {project.projectDescription || (
                          <span>No description provided</span>
                        )}
                      </td>
                      {/* Actions */}
                      <td>
                        {/* ✅ Pure server-side navigation link targeting your dynamic editNode page */}
                        <Link
                          href={`/project/${project.projectId}/editNode`}
                          className="text-indigo-600 hover:text-indigo-900 font-medium focus:outline-none focus:underline"
                        >
                          Open Workspace
                        </Link>
                      </td>
                    </tr>
                  ))}

                  {projects.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-3 py-12 text-center text-sm text-gray-500"
                      >
                        No projects found. Create a project to get started.
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
