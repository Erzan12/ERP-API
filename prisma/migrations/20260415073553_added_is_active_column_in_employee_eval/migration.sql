-- AlterTable
ALTER TABLE "EmployeeEvaluation" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "EmployeeEvaluation_status_idx" ON "EmployeeEvaluation"("status");
