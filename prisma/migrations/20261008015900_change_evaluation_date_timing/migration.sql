/*
  Warnings:

  - Added the required column `date_evaluated` to the `HrEmployeeEvaluation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HrEmployeeEvaluation" ADD COLUMN     "date_evaluated" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "evaluation_period_end" DROP NOT NULL,
ALTER COLUMN "evaluation_period_start" DROP NOT NULL;
