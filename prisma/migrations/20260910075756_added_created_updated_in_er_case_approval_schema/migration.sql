-- AlterTable
ALTER TABLE "HrErCaseApproval" ADD COLUMN     "created_by" UUID,
ADD COLUMN     "updated_by" UUID;

-- AddForeignKey
ALTER TABLE "HrErCaseApproval" ADD CONSTRAINT "HrErCaseApproval_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseApproval" ADD CONSTRAINT "HrErCaseApproval_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
