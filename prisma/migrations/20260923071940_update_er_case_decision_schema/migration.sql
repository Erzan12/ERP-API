-- CreateEnum
CREATE TYPE "HrErDecisionStatus" AS ENUM ('draft', 'issued');

-- AlterEnum
ALTER TYPE "HrErDecisionType" ADD VALUE 'suspension';

-- AlterTable
ALTER TABLE "HrErCaseDecision" ADD COLUMN     "status" "HrErDecisionStatus" NOT NULL DEFAULT 'draft';
