-- AlterTable
ALTER TABLE "edges" ADD COLUMN     "attributes" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "nodes" ADD COLUMN     "attributes" JSONB NOT NULL DEFAULT '{}';
