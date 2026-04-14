/*
  Warnings:

  - Made the column `probation_date` on table `EmployeeEvaluation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `regularization_date` on table `EmployeeEvaluation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "EmployeeEvaluation" ALTER COLUMN "probation_date" SET NOT NULL,
ALTER COLUMN "regularization_date" SET NOT NULL;
