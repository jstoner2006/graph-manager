// app/api/nodes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  const nodes = await prisma.node.findMany({
    where: { projectId },
    orderBy: { nodeName: "asc" },
  });

  return NextResponse.json(nodes);
}
