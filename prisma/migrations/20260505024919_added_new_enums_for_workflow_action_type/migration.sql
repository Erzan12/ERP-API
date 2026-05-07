-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EvaluationStatus" ADD VALUE 'approved';
ALTER TYPE "EvaluationStatus" ADD VALUE 'rejected';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "WorkflowActionType" ADD VALUE 'create';
ALTER TYPE "WorkflowActionType" ADD VALUE 'submit';
ALTER TYPE "WorkflowActionType" ADD VALUE 'acknowledge';
ALTER TYPE "WorkflowActionType" ADD VALUE 'completed';

-- AlterTable
ALTER TABLE "HrEmployeeEvaluation" ADD COLUMN     "approver_id" UUID,
ADD COLUMN     "verifier_id" UUID;

-- AddForeignKey
ALTER TABLE "HrEmployeeEvaluation" ADD CONSTRAINT "HrEmployeeEvaluation_verifier_id_fkey" FOREIGN KEY ("verifier_id") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrEmployeeEvaluation" ADD CONSTRAINT "HrEmployeeEvaluation_approver_id_fkey" FOREIGN KEY ("approver_id") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
