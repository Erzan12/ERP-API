/*
  Warnings:

  - The `employment_type` column on the `CareerPosting` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `employee_type` column on the `CareerPosting` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "SeaBasedCategory" AS ENUM ('all_ranks', 'all_officers', 'top_2_master_chief_engineer');

-- CreateEnum
CREATE TYPE "LandBasedCategory" AS ENUM ('rank_and_file', 'managerial_and_supervisory');

-- CreateEnum
CREATE TYPE "TypeOfEvaluation" AS ENUM ('for_regularization', 'for_appraisal', 'for_promotion');

-- CreateEnum
CREATE TYPE "EvaluationDecision" AS ENUM ('for_reevaluation', 'for_regularization', 'for_rehire', 'for_promotion', 'for_dismissal');

-- CreateEnum
CREATE TYPE "PerformanceRating" AS ENUM ('unsatisfactory', 'needs_improvement', 'meets_expectations', 'exceed_expectations', 'exceptional');

-- AlterTable
ALTER TABLE "CareerPosting" DROP COLUMN "employment_type",
ADD COLUMN     "employment_type" "EmploymentType",
DROP COLUMN "employee_type",
ADD COLUMN     "employee_type" "EmployeeType";

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "employee_type" "EmployeeType",
ADD COLUMN     "employmentHistoryId" UUID,
ADD COLUMN     "employment_type" "EmploymentType";

-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "address_line_2" TEXT;

-- CreateTable
CREATE TABLE "HrEmployeeEvaluation" (
    "id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "evaluator_id" UUID NOT NULL,
    "stage" "EvaluationStage" NOT NULL,
    "status" "EvaluationStatus" NOT NULL DEFAULT 'for_evaluation',
    "probation_date" TIMESTAMP(3) NOT NULL,
    "regularization_date" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "overall_rating" INTEGER,
    "decision" "EvaluationDecision",
    "comments" TEXT,
    "type_of_evaluation" "TypeOfEvaluation" NOT NULL,
    "response" TEXT,
    "evaluated_on" TIMESTAMP(3),
    "acknowledged_on" TIMESTAMP(3),
    "approved_on" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,

    CONSTRAINT "HrEmployeeEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrPerformanceCompetency" (
    "id" UUID NOT NULL,
    "department_group" "EmployeeType" NOT NULL,
    "sea_category" "SeaBasedCategory",
    "land_category" "LandBasedCategory",
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "highest_score_limit" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HrPerformanceCompetency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrPerformanceEvaluationDetails" (
    "id" UUID NOT NULL,
    "evaluation_id" UUID NOT NULL,
    "competency_id" UUID NOT NULL,
    "rating" "PerformanceRating" NOT NULL,
    "remarks" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HrPerformanceEvaluationDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HrEmployeeEvaluation_evaluator_id_idx" ON "HrEmployeeEvaluation"("evaluator_id");

-- CreateIndex
CREATE INDEX "HrEmployeeEvaluation_employee_id_idx" ON "HrEmployeeEvaluation"("employee_id");

-- CreateIndex
CREATE INDEX "HrEmployeeEvaluation_stage_idx" ON "HrEmployeeEvaluation"("stage");

-- CreateIndex
CREATE INDEX "HrEmployeeEvaluation_status_idx" ON "HrEmployeeEvaluation"("status");

-- CreateIndex
CREATE INDEX "HrPerformanceCompetency_department_group_idx" ON "HrPerformanceCompetency"("department_group");

-- CreateIndex
CREATE INDEX "HrPerformanceCompetency_title_idx" ON "HrPerformanceCompetency"("title");

-- CreateIndex
CREATE INDEX "HrPerformanceEvaluationDetails_evaluation_id_idx" ON "HrPerformanceEvaluationDetails"("evaluation_id");

-- CreateIndex
CREATE INDEX "HrPerformanceEvaluationDetails_competency_id_idx" ON "HrPerformanceEvaluationDetails"("competency_id");

-- AddForeignKey
ALTER TABLE "HrEmployeeEvaluation" ADD CONSTRAINT "HrEmployeeEvaluation_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrEmployeeEvaluation" ADD CONSTRAINT "HrEmployeeEvaluation_evaluator_id_fkey" FOREIGN KEY ("evaluator_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrEmployeeEvaluation" ADD CONSTRAINT "HrEmployeeEvaluation_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrEmployeeEvaluation" ADD CONSTRAINT "HrEmployeeEvaluation_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrPerformanceCompetency" ADD CONSTRAINT "HrPerformanceCompetency_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrPerformanceCompetency" ADD CONSTRAINT "HrPerformanceCompetency_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrPerformanceEvaluationDetails" ADD CONSTRAINT "HrPerformanceEvaluationDetails_evaluation_id_fkey" FOREIGN KEY ("evaluation_id") REFERENCES "HrEmployeeEvaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrPerformanceEvaluationDetails" ADD CONSTRAINT "HrPerformanceEvaluationDetails_competency_id_fkey" FOREIGN KEY ("competency_id") REFERENCES "HrPerformanceCompetency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
