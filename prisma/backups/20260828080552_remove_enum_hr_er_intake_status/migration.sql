-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "HrErIntakeStatus" ADD VALUE 'draft';
ALTER TYPE "HrErIntakeStatus" ADD VALUE 'submitted';
ALTER TYPE "HrErIntakeStatus" ADD VALUE 'processed';

-- AlterTable
ALTER TABLE "HrErCaseIntake" ALTER COLUMN "status" SET DEFAULT 'draft';
