-- AlterEnum
ALTER TYPE "LeaveRequestStatus" ADD VALUE 'approved';
-- AlterEnum
ALTER TYPE "CareerPostingStatus" ADD VALUE 'all';
-- CreateEnum
CREATE TYPE "EvaluationStageStatus" AS ENUM ('pending', 'overdue', 'complete');
