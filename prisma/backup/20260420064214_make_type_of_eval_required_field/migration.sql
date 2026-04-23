/*
  Warnings:

  - Made the column `type_of_evaluation` on table `HrEmployeeEvaluation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "HrEmployeeEvaluation" ALTER COLUMN "type_of_evaluation" SET NOT NULL;
