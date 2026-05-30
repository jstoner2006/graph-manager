// app/dashboard/page.tsx
import React from "react";
import { getAllProjects } from "../db/projects/actions";
import ProjectTable from "../ui/project/table";

export default async function DashboardPage() {
  // Directly executes your PostgreSQL call securely on the server
  const projects = await getAllProjects();

  return (
    <div className="py-10">
      <div className="mx-auto max-w-7xl">
        <ProjectTable projects={projects} />
      </div>
    </div>
  );
}
