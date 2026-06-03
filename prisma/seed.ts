import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

// Setup the Prisma 7 Driver Adapter
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Cleaning up existing database records...");

  // Clear dependent tables first to avoid foreign key constraint violations

  await prisma.project.deleteMany({});
  await prisma.projectNodeType.deleteMany({});
  await prisma.projectEdgeType.deleteMany({});
  await prisma.edge.deleteMany({});
  await prisma.node.deleteMany({});

  console.log("Database cleared. Starting seed execution...");
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
          { nodeName: "Atlanta", nodeType: "City" },
          { nodeName: "Boston", nodeType: "City" },
          { nodeName: "Calgary", nodeType: "City" },
          { nodeName: "Charleston", nodeType: "City" },
          { nodeName: "Chicago", nodeType: "City" },
          { nodeName: "Dallas", nodeType: "City" },
          { nodeName: "Denver", nodeType: "City" },
          { nodeName: "Duluth", nodeType: "City" },
          { nodeName: "El Paso", nodeType: "City" },
          { nodeName: "Helena", nodeType: "City" },
          { nodeName: "Houston", nodeType: "City" },
          { nodeName: "Kansas City", nodeType: "City" },
          { nodeName: "Las Vegas", nodeType: "City" },
          { nodeName: "Little Rock", nodeType: "City" },
          { nodeName: "Los Angeles", nodeType: "City" },
          { nodeName: "Miami", nodeType: "City" },
          { nodeName: "Montreal", nodeType: "City" },
          { nodeName: "Nashville", nodeType: "City" },
          { nodeName: "New Orleans", nodeType: "City" },
          { nodeName: "New York", nodeType: "City" },
          { nodeName: "Oklahoma City", nodeType: "City" },
          { nodeName: "Omaha", nodeType: "City" },
          { nodeName: "Phoenix", nodeType: "City" },
          { nodeName: "Pittsburgh", nodeType: "City" },
          { nodeName: "Portland", nodeType: "City" },
          { nodeName: "Raleigh", nodeType: "City" },
          { nodeName: "Saint Louis", nodeType: "City" },
          { nodeName: "Salt Lake City", nodeType: "City" },
          { nodeName: "San Francisco", nodeType: "City" },
          { nodeName: "Santa Fe", nodeType: "City" },
          { nodeName: "Sault St Marie", nodeType: "City" },
          { nodeName: "Seattle", nodeType: "City" },
          { nodeName: "Toronto", nodeType: "City" },
          { nodeName: "Vancouver", nodeType: "City" },
          { nodeName: "Washington", nodeType: "City" },
          { nodeName: "Winnipeg", nodeType: "City" },
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

  //store the edges in an object

  // Extract the generated IDs for our specific cities
  // 1. Cleaned edge data mapping only the layout connections
  const rawEdges = [
    { from: "Vancouver", to: "Seattle" },
    { from: "Vancouver", to: "Calgary" },
    { from: "Calgary", to: "Seattle" },
    { from: "Calgary", to: "Winnipeg" },
    { from: "Calgary", to: "Helena" },
    { from: "Helena", to: "Seattle" },
    { from: "Portland", to: "Seattle" },
    { from: "Portland", to: "San Francisco" },
    { from: "Portland", to: "Salt Lake City" },
    { from: "Salt Lake City", to: "San Francisco" },
    { from: "Los Angeles", to: "San Francisco" },
    { from: "Los Angeles", to: "Las Vegas" },
    { from: "Los Angeles", to: "Phoenix" },
    { from: "Las Vegas", to: "Salt Lake City" },
    { from: "Salt Lake City", to: "Helena" },
    { from: "Helena", to: "Winnipeg" },
    { from: "Helena", to: "Denver" },
    { from: "Salt Lake City", to: "Denver" },
    { from: "Phoenix", to: "Santa Fe" },
    { from: "Los Angeles", to: "El Paso" },
    { from: "Phoenix", to: "El Paso" },
    { from: "El Paso", to: "Santa Fe" },
    { from: "Santa Fe", to: "Denver" },
    { from: "Helena", to: "Duluth" },
    { from: "Helena", to: "Omaha" },
    { from: "Winnipeg", to: "Duluth" },
    { from: "Winnipeg", to: "Sault St Marie" },
    { from: "Denver", to: "Omaha" },
    { from: "Denver", to: "Kansas City" },
    { from: "Denver", to: "Oklahoma City" },
    { from: "Santa Fe", to: "Oklahoma City" },
    { from: "El Paso", to: "Oklahoma City" },
    { from: "El Paso", to: "Dallas" },
    { from: "El Paso", to: "Houston" },
    { from: "Houston", to: "Dallas" },
    { from: "Dallas", to: "Oklahoma City" },
    { from: "Oklahoma City", to: "Kansas City" },
    { from: "Omaha", to: "Kansas City" },
    { from: "Omaha", to: "Duluth" },
    { from: "Duluth", to: "Sault St Marie" },
    { from: "Duluth", to: "Toronto" },
    { from: "Duluth", to: "Chicago" },
    { from: "Omaha", to: "Chicago" },
    { from: "Dallas", to: "Little Rock" },
    { from: "Oklahoma City", to: "Little Rock" },
    { from: "Houston", to: "New Orleans" },
    { from: "New Orleans", to: "Little Rock" },
    { from: "Little Rock", to: "Saint Louis" },
    { from: "Kansas City", to: "Saint Louis" },
    { from: "Little Rock", to: "Nashville" },
    { from: "Nashville", to: "Saint Louis" },
    { from: "Saint Louis", to: "Chicago" },
    { from: "Sault St Marie", to: "Toronto" },
    { from: "Sault St Marie", to: "Montreal" },
    { from: "Montreal", to: "Toronto" },
    { from: "Montreal", to: "Boston" },
    { from: "Montreal", to: "New York" },
    { from: "Toronto", to: "Pittsburgh" },
    { from: "Toronto", to: "Chicago" },
    { from: "Boston", to: "New York" },
    { from: "New York", to: "Pittsburgh" },
    { from: "New York", to: "Washington" },
    { from: "Pittsburgh", to: "Chicago" },
    { from: "Pittsburgh", to: "Saint Louis" },
    { from: "Pittsburgh", to: "Nashville" },
    { from: "Pittsburgh", to: "Raleigh" },
    { from: "Pittsburgh", to: "Washington" },
    { from: "Washington", to: "Raleigh" },
    { from: "Raleigh", to: "Nashville" },
    { from: "Nashville", to: "Atlanta" },
    { from: "Atlanta", to: "Raleigh" },
    { from: "Raleigh", to: "Charleston" },
    { from: "Atlanta", to: "New Orleans" },
    { from: "Atlanta", to: "Charleston" },
    { from: "Miami", to: "Charleston" },
    { from: "Miami", to: "Atlanta" },
    { from: "Miami", to: "New Orleans" },
  ];

  // 2. Map existing project node IDs into memory
  const nodeMap = new Map(
    project.nodes.map((node) => [node.nodeName, node.nodeId]),
  );

  // 3. Process records into the structure Prisma expects
  const edgeDataToInsert = rawEdges.map((edge) => {
    const fromNodeId = nodeMap.get(edge.from);
    const toNodeId = nodeMap.get(edge.to);

    if (!fromNodeId || !toNodeId) {
      throw new Error(
        `Failed to map edge. Missing ID for either "${edge.from}" or "${edge.to}".`,
      );
    }

    return {
      edgeName: `${edge.from} to ${edge.to} Route`,
      projectId: project.projectId,
      edgeType: "Route",
      fromNodeId: fromNodeId,
      toNodeId: toNodeId,
    };
  });

  // 4. Fire the single batch query
  await prisma.edge.createMany({
    data: edgeDataToInsert,
  });

  console.log(`Successfully seeded ${edgeDataToInsert.length} edges.`);

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
