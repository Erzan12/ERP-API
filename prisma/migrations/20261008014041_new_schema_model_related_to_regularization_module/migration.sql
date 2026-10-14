/*
  Warnings:

  - Added the required column `scheduled_evaluation_date` to the `HrEmployeeEvaluation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EvaluationRecommendation" AS ENUM ('pass', 'fail');

-- CreateEnum
CREATE TYPE "RegularizationActivityLogAction" AS ENUM ('evaluated', 'submitted_for_verification', 'verified', 'approved', 'rejected', 'acknowledged', 'completed');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EvaluationStatus" ADD VALUE 'draft';
ALTER TYPE "EvaluationStatus" ADD VALUE 'submitted';
ALTER TYPE "EvaluationStatus" ADD VALUE 'pending';
ALTER TYPE "EvaluationStatus" ADD VALUE 'overdue';
ALTER TYPE "EvaluationStatus" ADD VALUE 'completed';

-- AlterTable
ALTER TABLE "HrEmployeeEvaluation" ADD COLUMN     "recommendation" "EvaluationRecommendation",
ADD COLUMN     "scheduled_evaluation_date" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "HrEvaluationAttachment" (
    "id" UUID NOT NULL,
    "transaction_type" TEXT NOT NULL,
    "evaluation_id" UUID NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_type" TEXT,
    "file_desc" TEXT,
    "file_size" INTEGER,
    "uploaded_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HrEvaluationAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrEmployeeRegularizationActivityLog" (
    "id" UUID NOT NULL,
    "evaluation_id" UUID NOT NULL,
    "actor_id" UUID NOT NULL,
    "stage" "EvaluationStage",
    "action" "RegularizationActivityLogAction" NOT NULL,
    "metadata" JSONB,
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HrEmployeeRegularizationActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HrEvaluationAttachment_evaluation_id_key" ON "HrEvaluationAttachment"("evaluation_id");

-- CreateIndex
CREATE UNIQUE INDEX "HrEvaluationAttachment_uploaded_by_key" ON "HrEvaluationAttachment"("uploaded_by");

-- CreateIndex
CREATE INDEX "HrEvaluationAttachment_evaluation_id_idx" ON "HrEvaluationAttachment"("evaluation_id");

-- CreateIndex
CREATE INDEX "HrEmployeeRegularizationActivityLog_evaluation_id_occurred__idx" ON "HrEmployeeRegularizationActivityLog"("evaluation_id", "occurred_at");

-- CreateIndex
CREATE INDEX "HrEmployeeEvaluation_scheduled_evaluation_date_idx" ON "HrEmployeeEvaluation"("scheduled_evaluation_date");

-- AddForeignKey
ALTER TABLE "HrEvaluationAttachment" ADD CONSTRAINT "HrEvaluationAttachment_evaluation_id_fkey" FOREIGN KEY ("evaluation_id") REFERENCES "HrEmployeeEvaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrEvaluationAttachment" ADD CONSTRAINT "HrEvaluationAttachment_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrEmployeeRegularizationActivityLog" ADD CONSTRAINT "HrEmployeeRegularizationActivityLog_evaluation_id_fkey" FOREIGN KEY ("evaluation_id") REFERENCES "HrEmployeeEvaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrEmployeeRegularizationActivityLog" ADD CONSTRAINT "HrEmployeeRegularizationActivityLog_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
