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
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Workspace Projects
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all network architecture environments including their
            names, descriptions, and structural unique identifiers.
          </p>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg bg-white">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50 text-left text-sm font-normal text-gray-900 rounded-lg">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Project ID
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Project Name
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Description
                    </th>
                    <th scope="col" className="relative py-3 pl-6 pr-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white text-sm text-gray-700">
                  {projects.map((project) => (
                    <tr
                      key={project.projectId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Project ID */}
                      <td className="whitespace-nowrap px-4 py-4 text-xs font-mono text-gray-500 sm:pl-6">
                        {project.projectId}
                      </td>
                      {/* Project Name */}
                      <td className="whitespace-nowrap px-3 py-4 font-medium text-gray-900">
                        {project.projectName}
                      </td>
                      {/* Description */}
                      <td className="px-3 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {project.projectDescription || (
                          <span className="italic text-gray-400">
                            No description provided
                          </span>
                        )}
                      </td>
                      {/* Actions */}
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
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
