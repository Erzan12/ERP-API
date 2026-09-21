-- DropIndex
DROP INDEX "HrErCaseActivityLog_case_id_idx";

-- AlterTable
ALTER TABLE "HrErCaseActivityLog" ADD COLUMN     "stage" "HrErCaseStage";

-- CreateIndex
CREATE INDEX "HrErCaseActivityLog_case_id_stage_idx" ON "HrErCaseActivityLog"("case_id", "stage");
