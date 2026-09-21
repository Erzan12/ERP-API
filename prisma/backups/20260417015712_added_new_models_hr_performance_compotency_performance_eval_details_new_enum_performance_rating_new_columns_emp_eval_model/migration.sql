/*
  Warnings:

  - You are about to drop the `EmployeeEvaluation` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PerformanceRating" AS ENUM ('unsatisfactory', 'needs_improvement', 'meets_expectations', 'exceed_expectations', 'exceptional');

-- DropForeignKey
ALTER TABLE "EmployeeEvaluation" DROP CONSTRAINT "EmployeeEvaluation_created_by_fkey";

-- DropForeignKey
ALTER TABLE "EmployeeEvaluation" DROP CONSTRAINT "EmployeeEvaluation_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "EmployeeEvaluation" DROP CONSTRAINT "EmployeeEvaluation_evaluator_id_fkey";

-- DropForeignKey
ALTER TABLE "EmployeeEvaluation" DROP CONSTRAINT "EmployeeEvaluation_updated_by_fkey";

-- DropTable
DROP TABLE "EmployeeEvaluation";

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
    "decision" TEXT,
    "comments" TEXT,
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
    "department_group" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "highest_score_limit" INTEGER,
    "performanceRating" "PerformanceRating",
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
    "rating" TEXT NOT NULL,
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
CREATE INDEX "HrPerformanceCompetency_category_idx" ON "HrPerformanceCompetency"("category");

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
