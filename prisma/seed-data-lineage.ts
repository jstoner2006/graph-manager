import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg"; // Adaptive placeholder matching your schema configuration
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

// Setup the Prisma Driver Adapter
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function main() {
  // 1. Create the Project, its Allowed Types, and the Data Lineage Nodes simultaneously
  const project = await prisma.project.create({
    data: {
      projectName: "Data Lineage",
      projectDescription:
        "Logistics pipeline mapping data flows, servers, procedures, tables, and reporting metrics.",

      // Define valid types allowed in this project
      nodeTypes: {
        create: [
          { nodeType: "server" },
          { nodeType: "database object" },
          { nodeType: "report metric" },
        ],
      },
      edgeTypes: {
        create: { edgeType: "depends on" },
      },

      // Create the 25 structural nodes bound to this project
      nodes: {
        create: [
          // --- SERVERS (2 Nodes - Top Level Infrastructure targets) ---
          { nodeName: "SVR-PROD-ERP", nodeType: "server" },
          { nodeName: "SVR-PROD-WMS", nodeType: "server" },

          // --- TABLES / PROCEDURES (18 Nodes Total) ---
          // Source Tables
          { nodeName: "TBL_RAW_ORDERS", nodeType: "database object" },
          { nodeName: "TBL_RAW_INVENTORY", nodeType: "database object" },
          { nodeName: "TBL_RAW_PRODUCT", nodeType: "database object" },
          { nodeName: "TBL_RAW_LOCATION", nodeType: "database object" },
          { nodeName: "TBL_RAW_JOURNAL", nodeType: "database object" },
          { nodeName: "TBL_RAW_SHIPMENTS", nodeType: "database object" },
          { nodeName: "TBL_DIM_CARRIERS", nodeType: "database object" },
          { nodeName: "TBL_DIM_CUSTOMERS", nodeType: "database object" },

          { nodeName: "TBL_SUM_PRODUCT", nodeType: "database object" },
          { nodeName: "TBL_SUM_LOCATION", nodeType: "database object" },
          { nodeName: "TBL_SUM_JOURNAL", nodeType: "database object" },

          { nodeName: "2-TBL_SUM_PRODUCT", nodeType: "database object" },
          { nodeName: "2-TBL_SUM_LOCATION", nodeType: "database object" },
          { nodeName: "2-TBL_SUM_JOURNAL", nodeType: "database object" },

          { nodeName: "3-TBL_SUM_PRODUCT", nodeType: "database object" },
          { nodeName: "3-TBL_SUM_LOCATION", nodeType: "database object" },
          { nodeName: "3-TBL_SUM_JOURNAL", nodeType: "database object" },

          { nodeName: "4-TBL_SUM_PRODUCT", nodeType: "database object" },
          { nodeName: "4-TBL_SUM_LOCATION", nodeType: "database object" },
          { nodeName: "4-TBL_SUM_JOURNAL", nodeType: "database object" },

          // Alternating Staging, Fact, Logs, and Procedures
          { nodeName: "SP_ETL_PROCESS_DISPATCH", nodeType: "database object" }, // Procedure 1
          { nodeName: "TBL_STG_DISPATCH", nodeType: "database object" }, // Table 6

          {
            nodeName: "SP_CALC_DAILY_FULFILLMENT",
            nodeType: "database object",
          }, // Procedure 2
          { nodeName: "TBL_FACT_FULFILLMENT", nodeType: "database object" }, // Table 7

          { nodeName: "SP_SNAPSHOT_INVENTORY", nodeType: "database object" }, // Procedure 3
          { nodeName: "TBL_FACT_INV_SNAPSHOT", nodeType: "database object" }, // Table 8
          { nodeName: "TBL_WMS_REPLENISHMENT", nodeType: "database object" }, // Table 9

          {
            nodeName: "SP_SCORE_CARRIER_PERFORMANCE",
            nodeType: "database object",
          }, // Procedure 4
          {
            nodeName: "TBL_AGG_CARRIER_PERFORMANCE",
            nodeType: "database object",
          }, // Table 10
          { nodeName: "TBL_AGG_DELIVERY_SLA", nodeType: "database object" }, // Table 11

          { nodeName: "SP_ARCHIVE_OLD_DATA", nodeType: "database object" }, // Procedure 5
          { nodeName: "TBL_ARCHIVE_ORDERS", nodeType: "database object" }, // Table 12
          { nodeName: "TBL_PROCEDURE_LOGS", nodeType: "database object" }, // Table 13

          // --- REPORT METRICS (5 Nodes) ---
          {
            nodeName: "RPT_Warehouse_Efficiency_Dashboard",
            nodeType: "report metric",
          },
          { nodeName: "RPT_Carrier_SLA_Scorecard", nodeType: "report metric" },
          {
            nodeName: "RPT_Executive_Shipping_Summary",
            nodeType: "report metric",
          },
          {
            nodeName: "RPT_Stock_Out_Risk_Analysis",
            nodeType: "report metric",
          },
          {
            nodeName: "RPT_Delivery_Delay_Deep_Dive",
            nodeType: "report metric",
          },
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

  // 2. Map structural layout dependencies (Lineage Track)
  // Logic Flow rules applied:
  // - Servers do not depend on anything (no "from" items pointing away from them)
  // - Alternating flows: Tables feed Procedures, Procedures feed Target Tables
  // - Reports ONLY depend on downstream target tables generated by Procedures
  const rawEdges = [
    // --- Data Assets mapping back to Infrastructure Servers ---
    { from: "TBL_RAW_ORDERS", to: "SVR-PROD-ERP" },
    { from: "TBL_RAW_INVENTORY", to: "SVR-PROD-WMS" },
    { from: "TBL_RAW_PRODUCT", to: "SVR-PROD-WMS" },
    { from: "TBL_RAW_LOCATION", to: "SVR-PROD-WMS" },
    { from: "TBL_RAW_JOURNAL", to: "SVR-PROD-WMS" },

    { from: "TBL_SUM_PRODUCT", to: "TBL_RAW_PRODUCT" },
    { from: "TBL_SUM_LOCATION", to: "TBL_RAW_LOCATION" },
    { from: "TBL_SUM_JOURNAL", to: "TBL_RAW_JOURNAL" },

    { from: "2-TBL_SUM_PRODUCT", to: "TBL_SUM_PRODUCT" },
    { from: "2-TBL_SUM_LOCATION", to: "TBL_SUM_LOCATION" },
    { from: "2-TBL_SUM_JOURNAL", to: "TBL_SUM_JOURNAL" },

    { from: "3-TBL_SUM_PRODUCT", to: "2-TBL_SUM_PRODUCT" },
    { from: "3-TBL_SUM_LOCATION", to: "2-TBL_SUM_LOCATION" },
    { from: "3-TBL_SUM_JOURNAL", to: "2-TBL_SUM_JOURNAL" },

    { from: "4-TBL_SUM_PRODUCT", to: "3-TBL_SUM_PRODUCT" },
    { from: "4-TBL_SUM_LOCATION", to: "3-TBL_SUM_LOCATION" },
    { from: "4-TBL_SUM_JOURNAL", to: "3-TBL_SUM_JOURNAL" },

    // --- Lineage Track 1: Orders & Dispatch Alternating Flow ---
    { from: "SP_ETL_PROCESS_DISPATCH", to: "TBL_RAW_ORDERS" },
    { from: "SP_ETL_PROCESS_DISPATCH", to: "TBL_RAW_SHIPMENTS" },

    { from: "TBL_STG_DISPATCH", to: "SP_ETL_PROCESS_DISPATCH" }, // Target table depends on procedure

    // --- Lineage Track 2: Fulfillment Metrics Chaining ---
    { from: "SP_CALC_DAILY_FULFILLMENT", to: "TBL_STG_DISPATCH" },
    { from: "SP_CALC_DAILY_FULFILLMENT", to: "TBL_DIM_CUSTOMERS" },
    { from: "TBL_FACT_FULFILLMENT", to: "SP_CALC_DAILY_FULFILLMENT" }, // Target table depends on procedure
    { from: "TBL_AGG_DELIVERY_SLA", to: "TBL_FACT_FULFILLMENT" },

    // --- Lineage Track 3: Inventory Snapshot Alternating Flow ---
    { from: "SP_SNAPSHOT_INVENTORY", to: "TBL_RAW_INVENTORY" },
    { from: "TBL_FACT_INV_SNAPSHOT", to: "SP_SNAPSHOT_INVENTORY" }, // Target table depends on procedure
    { from: "TBL_WMS_REPLENISHMENT", to: "TBL_FACT_INV_SNAPSHOT" },

    // --- Lineage Track 4: Carrier Scorecards & Calculations ---
    { from: "SP_SCORE_CARRIER_PERFORMANCE", to: "TBL_RAW_SHIPMENTS" },
    { from: "SP_SCORE_CARRIER_PERFORMANCE", to: "TBL_DIM_CARRIERS" },
    { from: "TBL_AGG_CARRIER_PERFORMANCE", to: "SP_SCORE_CARRIER_PERFORMANCE" }, // Target table depends on procedure

    // --- Lineage Track 5: Maintenance & Audits Alternating Flow ---
    { from: "SP_ARCHIVE_OLD_DATA", to: "TBL_RAW_ORDERS" },
    { from: "TBL_ARCHIVE_ORDERS", to: "SP_ARCHIVE_OLD_DATA" }, // Target table depends on procedure
    { from: "TBL_PROCEDURE_LOGS", to: "SP_ARCHIVE_OLD_DATA" }, // Target table depends on procedure

    // --- Report Layer Dependencies ---
    // Reports depend *only* on downstream target tables calculated via procedures
    { from: "RPT_Executive_Shipping_Summary", to: "TBL_FACT_FULFILLMENT" },
    { from: "RPT_Delivery_Delay_Deep_Dive", to: "TBL_AGG_DELIVERY_SLA" },
    { from: "RPT_Carrier_SLA_Scorecard", to: "TBL_AGG_CARRIER_PERFORMANCE" },
    { from: "RPT_Stock_Out_Risk_Analysis", to: "TBL_FACT_INV_SNAPSHOT" },
    { from: "RPT_Warehouse_Efficiency_Dashboard", to: "TBL_FACT_INV_SNAPSHOT" },
  ];

  // 3. Map existing project node IDs into memory
  const nodeMap = new Map(
    project.nodes.map((node) => [node.nodeName, node.nodeId]),
  );

  // 4. Process records into the structure Prisma expects
  const edgeDataToInsert = rawEdges.map((edge) => {
    const fromNodeId = nodeMap.get(edge.from);
    const toNodeId = nodeMap.get(edge.to);

    if (!fromNodeId || !toNodeId) {
      throw new Error(
        `Failed to map edge. Missing ID for either "${edge.from}" or "${edge.to}".`,
      );
    }

    return {
      edgeName: `${edge.from} to ${edge.to} Link`,
      projectId: project.projectId,
      edgeType: "depends on",
      fromNodeId: fromNodeId,
      toNodeId: toNodeId,
    };
  });

  // 5. Fire the single batch query for edges
  await prisma.edge.createMany({
    data: edgeDataToInsert,
  });

  console.log(`Successfully seeded ${edgeDataToInsert.length} edges.`);
  console.log("🏁 Seeding complete!");
}

if (require.main === module) {
  main()
    .catch((e) => {
      console.error("❌ Seeding failed:", e);
      process.exit(1);
    })
    .finally(async () => {
      await pool.end();
    });
}
