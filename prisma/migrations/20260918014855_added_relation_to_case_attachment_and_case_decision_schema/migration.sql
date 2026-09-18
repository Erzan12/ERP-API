-- AlterTable
ALTER TABLE "HrErCaseAttachment" ADD COLUMN     "decision_id" UUID;

-- AddForeignKey
ALTER TABLE "HrErCaseAttachment" ADD CONSTRAINT "HrErCaseAttachment_decision_id_fkey" FOREIGN KEY ("decision_id") REFERENCES "HrErCaseDecision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
