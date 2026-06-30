// db/edges/action.ts

"use server";
import { prisma } from "@/lib/prisma";
import { Edge } from "@prisma/client";

export async function getEdgesByProjectIDandEdgeType(
  projectId: string,
  edgeTypes: string[],
): Promise<Edge[]> {
  if (!projectId) {
    throw new Error("getEdgesByProjectID requires a valid projectId string");
  }

  const whereClause: any = {
    projectId,
  };

  // 3. Only filter by edgeType if the user has actively selected specific filters.
  // If the array is empty, Prisma fetches all edge types matching the projectId.
  if (edgeTypes && edgeTypes.length > 0) {
    whereClause.edgeType = {
      in: edgeTypes, // Uses Prisma's "IN" operator SQL syntax: WHERE edgeType IN ('TypeA', 'TypeB')
    };
  }

  const edges = await prisma.edge.findMany({
    where: whereClause,
    orderBy: { edgeName: "asc" },
  });

  return edges;
}
