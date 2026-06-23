/*
  Warnings:

  - Added the required column `edgeLevel` to the `edges` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "edges" ADD COLUMN     "edgeLevel" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "project_edge_levels" (
    "projectId" TEXT NOT NULL,
    "edgeLevel" TEXT NOT NULL,
    "last_update_dts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "insert_dts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "insert_user_name" TEXT NOT NULL DEFAULT current_user,

    CONSTRAINT "project_edge_levels_pkey" PRIMARY KEY ("projectId","edgeLevel")
);

-- AddForeignKey
ALTER TABLE "project_edge_levels" ADD CONSTRAINT "project_edge_levels_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("projectId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "edges" ADD CONSTRAINT "edges_projectId_edgeLevel_fkey" FOREIGN KEY ("projectId", "edgeLevel") REFERENCES "project_edge_levels"("projectId", "edgeLevel") ON DELETE RESTRICT ON UPDATE CASCADE;
