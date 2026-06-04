// app/api/project/[id]/nodes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg"; // Adaptive placeholder matching your schema configuration
import { PrismaClient } from "@prisma/client";

// 💡 FIX: Initialize using the custom driver adapter pool just like your working route
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    console.log(`📡 Fetching dropdown inventory for Project ID: ${id}`);

    // Adjust 'prisma.node' if your schema configuration uses a different plural/singular name
    const nodes = await prisma.node.findMany({
      where: { projectId: id },
      select: {
        nodeId: true,
        nodeName: true,
        nodeType: true,
      },
      orderBy: { nodeName: "asc" },
    });

    return NextResponse.json({ success: true, nodes });
  } catch (error: any) {
    console.error("❌ Nodes List API Crash:", error);
    return NextResponse.json(
      {
        error: "Internal server error fetching project mapping index",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
