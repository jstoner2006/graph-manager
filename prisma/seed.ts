import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

// Setup the Prisma 7 Driver Adapter
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seed...");

  // 1. Create the Project, its Allowed Types, and the Cities simultaneously
  const project = await prisma.project.create({
    data: {
      projectName: "Ticket to Ride",
      projectDescription: "A cross-country train adventure game graph.",

      // Define valid types allowed in this project
      nodeTypes: {
        create: { nodeType: "City" },
      },
      edgeTypes: {
        create: { edgeType: "Route" },
      },

      // Create the structural nodes bound to this project
      nodes: {
        create: [
          { nodeName: "Los Angeles", nodeType: "City" },
          { nodeName: "San Francisco", nodeType: "City" },
        ],
      },
    },
    // Include the generated nodes back in the response so we can read their system IDs
    include: {
      nodes: true,
    },
  });

  console.log(
    `✅ Created project "${project.projectName}" with ID: ${project.projectId}`,
  );

  // Extract the generated IDs for our specific cities
  const losAngeles = project.nodes.find((n) => n.nodeName === "Los Angeles");
  const sanFrancisco = project.nodes.find(
    (n) => n.nodeName === "San Francisco",
  );

  if (!losAngeles || !sanFrancisco) {
    throw new Error(
      "Could not find generated city nodes to establish edge link.",
    );
  }

  // 2. Connect the cities together with a Route edge
  const edge = await prisma.edge.create({
    data: {
      edgeName: "LA to SF Route",
      projectId: project.projectId,
      edgeType: "Route",
      fromNodeId: losAngeles.nodeId,
      toNodeId: sanFrancisco.nodeId,
    },
  });

  console.log(
    `✅ Created edge "${edge.edgeName}" linking the cities successfully.`,
  );
  console.log("🏁 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
