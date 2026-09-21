/*
  Warnings:

  - The `decision` column on the `HrEmployeeEvaluation` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "EvaluationDecision" AS ENUM ('for_reevaluation', 'for_regularization', 'for_rehire', 'for_promotion', 'for_dismissal');

-- AlterTable
ALTER TABLE "HrEmployeeEvaluation" DROP COLUMN "decision",
ADD COLUMN     "decision" "EvaluationDecision";
