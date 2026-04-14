-- CreateEnum
CREATE TYPE "EvaluationStatus" AS ENUM ('for_evaluation', 'for_verification', 'for_approval', 'for_acknowledgment');

-- AlterTable
ALTER TABLE "EmployeeEvaluation" ADD COLUMN     "status" "EvaluationStatus" NOT NULL DEFAULT 'for_evaluation';

-- AlterTable
ALTER TABLE "EmploymentHistory" ADD COLUMN     "evaluation_status" "EvaluationStatus" NOT NULL DEFAULT 'for_evaluation';
