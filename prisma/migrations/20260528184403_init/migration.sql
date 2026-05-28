/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "projects" (
    "projectId" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "projectDescription" TEXT,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("projectId")
);

-- CreateTable
CREATE TABLE "project_node_types" (
    "projectId" TEXT NOT NULL,
    "nodeType" TEXT NOT NULL,

    CONSTRAINT "project_node_types_pkey" PRIMARY KEY ("projectId","nodeType")
);

-- CreateTable
CREATE TABLE "project_edge_types" (
    "projectId" TEXT NOT NULL,
    "edgeType" TEXT NOT NULL,

    CONSTRAINT "project_edge_types_pkey" PRIMARY KEY ("projectId","edgeType")
);

-- CreateTable
CREATE TABLE "nodes" (
    "nodeId" TEXT NOT NULL,
    "nodeName" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "nodeType" TEXT NOT NULL,

    CONSTRAINT "nodes_pkey" PRIMARY KEY ("nodeId")
);

-- CreateTable
CREATE TABLE "edges" (
    "edgeId" TEXT NOT NULL,
    "edgeName" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "edgeType" TEXT NOT NULL,
    "fromNodeId" TEXT NOT NULL,
    "toNodeId" TEXT NOT NULL,

    CONSTRAINT "edges_pkey" PRIMARY KEY ("edgeId")
);

-- CreateIndex
CREATE UNIQUE INDEX "nodes_projectId_nodeId_key" ON "nodes"("projectId", "nodeId");

-- AddForeignKey
ALTER TABLE "project_node_types" ADD CONSTRAINT "project_node_types_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("projectId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_edge_types" ADD CONSTRAINT "project_edge_types_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("projectId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("projectId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_projectId_nodeType_fkey" FOREIGN KEY ("projectId", "nodeType") REFERENCES "project_node_types"("projectId", "nodeType") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "edges" ADD CONSTRAINT "edges_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("projectId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "edges" ADD CONSTRAINT "edges_projectId_edgeType_fkey" FOREIGN KEY ("projectId", "edgeType") REFERENCES "project_edge_types"("projectId", "edgeType") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "edges" ADD CONSTRAINT "edges_projectId_fromNodeId_fkey" FOREIGN KEY ("projectId", "fromNodeId") REFERENCES "nodes"("projectId", "nodeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "edges" ADD CONSTRAINT "edges_projectId_toNodeId_fkey" FOREIGN KEY ("projectId", "toNodeId") REFERENCES "nodes"("projectId", "nodeId") ON DELETE RESTRICT ON UPDATE CASCADE;
