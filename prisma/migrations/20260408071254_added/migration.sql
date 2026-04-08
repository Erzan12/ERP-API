-- CreateEnum
CREATE TYPE "EvaluationStage" AS ENUM ('third_month_evaluation', 'fifth_month_evaluation');

-- CreateEnum
CREATE TYPE "EvaluationStatus" AS ENUM ('pending', 'overdue', 'completed');

-- AlterTable
ALTER TABLE "EmploymentHistory" ADD COLUMN     "evaluation_stage" "EvaluationStage" NOT NULL DEFAULT 'third_month_evaluation',
ADD COLUMN     "evaluation_status" "EvaluationStatus" NOT NULL DEFAULT 'pending';
