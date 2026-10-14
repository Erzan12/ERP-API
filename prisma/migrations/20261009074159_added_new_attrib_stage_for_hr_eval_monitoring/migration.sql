/*
  Warnings:

  - Added the required column `stage` to the `HrEvaluationMonitoring` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HrEvaluationMonitoring" ADD COLUMN     "stage" "EvaluationStage" NOT NULL;
