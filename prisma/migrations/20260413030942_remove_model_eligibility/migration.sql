/*
  Warnings:

  - You are about to drop the column `status` on the `EmployeeEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `evaluation_status` on the `EmploymentHistory` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "EmployeeEvaluation_status_idx";

-- AlterTable
ALTER TABLE "EmployeeEvaluation" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "EmploymentHistory" DROP COLUMN "evaluation_status";
