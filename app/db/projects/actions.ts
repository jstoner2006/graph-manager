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

export async function getProjectNameById(id: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { projectId: id },
      select: {
        projectName: true, // Only returns the name column from the database
      },
    });

    return project ? project.projectName : null;
  } catch (error) {
    console.error(`Failed to fetch project name for ID ${id}:`, error);
    throw new Error("Database query failed.");
  }
}
