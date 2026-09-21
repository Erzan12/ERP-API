-- CreateEnum
CREATE TYPE "TypeOfEvaluation" AS ENUM ('for_regularization', 'for_appraisal', 'for_promotion');

-- AlterTable
ALTER TABLE "HrEmployeeEvaluation" ADD COLUMN     "type_of_evaluation" "TypeOfEvaluation";
