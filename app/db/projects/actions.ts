// db/projects/action.ts
import "server-only"; // 🛡️ Safely lock this file to the backend
import { prisma } from "@/lib/prisma";
import { ProjectData } from "@/types/project";

/**
 * Fetches all projects from the database ordered by name.
 */
export async function getAllProjects(): Promise<ProjectData[]> {
  const projects = await prisma.project.findMany({
    orderBy: {
      projectName: "asc",
    },
  });

  // Map the Prisma model data cleanly to your interface fields
  return projects.map((project) => ({
    projectId: project.projectId,
    projectName: project.projectName,
    projectDescription: project.projectDescription,
  }));
}
