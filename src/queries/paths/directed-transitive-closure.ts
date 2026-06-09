import { PrismaClient } from "@prisma/client";

interface LineageElement {
  nodeId: string;
  nodeName: string;
  nodeType: string;

  edgeId: string | null;
  edgeName: string | null;

  sourceNodeId: string | null;
  targetNodeId: string | null;

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

      ----------------------------------------------------------------
      -- ROOT NODE
      ----------------------------------------------------------------
      SELECT
        n."nodeId",
        n."nodeName",
        n."nodeType",

        NULL::text AS "edgeId",
        NULL::text AS "edgeName",

        NULL::text AS "sourceNodeId",
        NULL::text AS "targetNodeId",

        0 AS depth
      FROM public.nodes n
      WHERE
        n."nodeId" = $1
        AND n."projectId" = $2

      UNION ALL

      ----------------------------------------------------------------
      -- FIND NODES THAT DEPEND INTO CURRENT NODE
      ----------------------------------------------------------------
      SELECT
        source_node."nodeId",
        source_node."nodeName",
        source_node."nodeType",

        e."edgeId",
        e."edgeName",

        e."fromNodeId" AS "sourceNodeId",
        e."toNodeId"   AS "targetNodeId",

        dc.depth + 1
      FROM dependency_chain dc

      JOIN public.edges e
        ON e."toNodeId" = dc."nodeId"
       AND e."projectId" = $2

      JOIN public.nodes source_node
        ON source_node."nodeId" = e."fromNodeId"
       AND source_node."projectId" = $2
    )

    SELECT DISTINCT ON ("nodeId", "edgeId")
      *
    FROM dependency_chain
    ORDER BY
      "nodeId",
      "edgeId",
      depth;
    `,
    startNodeId,
    projectId,
  );

  return result;
}