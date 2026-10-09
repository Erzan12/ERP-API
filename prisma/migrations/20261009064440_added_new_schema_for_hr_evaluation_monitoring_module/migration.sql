/*
  Warnings:

  - You are about to drop the column `date_evaluated` on the `HrEmployeeEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `recommendation` on the `HrEmployeeEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `scheduled_evaluation_date` on the `HrEmployeeEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `evaluation_id` on the `HrEmployeeRegularizationActivityLog` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[evaluation_monitoring_id]` on the table `HrEvaluationAttachment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `evaluation_monitoring_id` to the `HrEmployeeRegularizationActivityLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evaluation_monitoring_id` to the `HrEvaluationAttachment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EvaluationMonitoringStatus" AS ENUM ('draft', 'submitted', 'pending', 'completed', 'overdue');

-- DropForeignKey
ALTER TABLE "HrEmployeeRegularizationActivityLog" DROP CONSTRAINT "HrEmployeeRegularizationActivityLog_evaluation_id_fkey";

-- DropIndex
DROP INDEX "HrEmployeeEvaluation_scheduled_evaluation_date_idx";

-- DropIndex
DROP INDEX "HrEmployeeRegularizationActivityLog_evaluation_id_occurred__idx";

-- AlterTable
ALTER TABLE "HrEmployeeEvaluation" DROP COLUMN "date_evaluated",
DROP COLUMN "recommendation",
DROP COLUMN "scheduled_evaluation_date";

-- AlterTable
ALTER TABLE "HrEmployeeRegularizationActivityLog" DROP COLUMN "evaluation_id",
ADD COLUMN     "evaluation_monitoring_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "HrEvaluationAttachment" ADD COLUMN     "evaluation_monitoring_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "HrEvaluationMonitoring" (
    "id" UUID NOT NULL,
    "evaluation_id" UUID,
    "employee_id" UUID,
    "status" "EvaluationMonitoringStatus" NOT NULL DEFAULT 'draft',
    "date_evaluated" TIMESTAMP(3),
    "scheduled_evaluation_date" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "recommendation" "EvaluationRecommendation",
    "is_reviewed" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,

    CONSTRAINT "HrEvaluationMonitoring_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HrEvaluationMonitoring_evaluation_id_key" ON "HrEvaluationMonitoring"("evaluation_id");

-- CreateIndex
CREATE UNIQUE INDEX "HrEvaluationMonitoring_employee_id_key" ON "HrEvaluationMonitoring"("employee_id");

-- CreateIndex
CREATE INDEX "HrEvaluationMonitoring_evaluation_id_idx" ON "HrEvaluationMonitoring"("evaluation_id");

-- CreateIndex
CREATE INDEX "HrEvaluationMonitoring_status_idx" ON "HrEvaluationMonitoring"("status");

-- CreateIndex
CREATE INDEX "HrEvaluationMonitoring_scheduled_evaluation_date_idx" ON "HrEvaluationMonitoring"("scheduled_evaluation_date");

-- CreateIndex
CREATE INDEX "HrEmployeeRegularizationActivityLog_evaluation_monitoring_i_idx" ON "HrEmployeeRegularizationActivityLog"("evaluation_monitoring_id", "occurred_at");

-- CreateIndex
CREATE UNIQUE INDEX "HrEvaluationAttachment_evaluation_monitoring_id_key" ON "HrEvaluationAttachment"("evaluation_monitoring_id");

-- AddForeignKey
ALTER TABLE "HrEvaluationMonitoring" ADD CONSTRAINT "HrEvaluationMonitoring_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrEvaluationMonitoring" ADD CONSTRAINT "HrEvaluationMonitoring_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrEvaluationMonitoring" ADD CONSTRAINT "HrEvaluationMonitoring_evaluation_id_fkey" FOREIGN KEY ("evaluation_id") REFERENCES "HrEmployeeEvaluation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrEvaluationMonitoring" ADD CONSTRAINT "HrEvaluationMonitoring_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrEvaluationAttachment" ADD CONSTRAINT "HrEvaluationAttachment_evaluation_monitoring_id_fkey" FOREIGN KEY ("evaluation_monitoring_id") REFERENCES "HrEvaluationMonitoring"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrEmployeeRegularizationActivityLog" ADD CONSTRAINT "HrEmployeeRegularizationActivityLog_evaluation_monitoring__fkey" FOREIGN KEY ("evaluation_monitoring_id") REFERENCES "HrEvaluationMonitoring"("id") ON DELETE CASCADE ON UPDATE CASCADE;
