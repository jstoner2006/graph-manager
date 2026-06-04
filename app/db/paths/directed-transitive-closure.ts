import { PrismaClient } from "@prisma/client";

// Define what a returned path segment looks like
interface LineageElement {
  nodeId: string;
  nodeName: string;
  nodeType: string;
  edgeId: string | null;
  edgeName: string | null;
  depth: number;
}
// lib/dependencyAnalysis.ts
export async function getFullDependents(
  prisma: PrismaClient,
  startNodeId: string,
  projectId: string,
) {
  const result = await prisma.$queryRawUnsafe<LineageElement[]>(
    `
    WITH RECURSIVE dependency_chain AS (
      -- Anchor Member
      SELECT 
        n."nodeId", 
        n."nodeName", 
        n."nodeType",
        e."edgeId",
        e."edgeName",
        1 as depth
      FROM public.nodes n
      JOIN public.edges e ON n."nodeId" = e."fromNodeId"
      WHERE e."toNodeId" = $1 AND e."projectId" = $2

      UNION ALL

      -- Recursive Member
      SELECT 
        next_node."nodeId", 
        next_node."nodeName", 
        next_node."nodeType",
        next_edge."edgeId",
        next_edge."edgeName",
        dc.depth + 1
      FROM public.nodes next_node
      JOIN public.edges next_edge ON next_node."nodeId" = next_edge."fromNodeId"
      JOIN dependency_chain dc ON next_edge."toNodeId" = dc."nodeId"
      WHERE next_edge."projectId" = $2
    )
    SELECT DISTINCT ON ("nodeId", "edgeId") * FROM dependency_chain
    ORDER BY "nodeId" ASC, "edgeId" ASC, depth ASC; --  FIXED HERE
  `,
    startNodeId,
    projectId,
  );
  return result;
}
