// app/dashboard/page.tsx
import React from "react";
import { getAllProjects } from "@/queries/projects/actions";

import ProjectTable from "@/components/ui/project/table";

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
