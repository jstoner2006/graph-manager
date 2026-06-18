-- AlterTable
ALTER TABLE "edges" ADD COLUMN     "edgeWeight" DOUBLE PRECISION,
ADD COLUMN     "edgeWeightMeasure" TEXT,
ADD COLUMN     "edgeWeightUnit" TEXT,
ADD COLUMN     "url" TEXT;

-- AlterTable
ALTER TABLE "nodes" ADD COLUMN     "url" TEXT;
