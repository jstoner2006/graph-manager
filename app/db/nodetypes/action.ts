import "server-only";
import { prisma } from "@/lib/prisma";
import { ProjectNodeType } from "@/types/ProjectnodeType";

export async function getProjectNodeTypesbyProjectID(
  projectId: string,
): Promise<ProjectNodeType[]> {
  if (!projectId) {
    throw new Error(
      "getProjectNodeTypesbyProjectID requires a valid projectid",
    );
  }

  const rawProjectNodeTypes = await prisma.projectNodeType.findMany({
    where: { projectId },
    orderBy: { nodeType: "asc" },
  });

  return rawProjectNodeTypes.map((nodeType) => ({
    projectId: nodeType.projectId,
    nodeType: nodeType.nodeType,
  }));
}
