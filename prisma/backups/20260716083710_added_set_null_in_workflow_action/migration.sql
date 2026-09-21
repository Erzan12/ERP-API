-- DropForeignKey
ALTER TABLE "WorkflowAction" DROP CONSTRAINT "WorkflowAction_acted_by_fkey";

-- AddForeignKey
ALTER TABLE "WorkflowAction" ADD CONSTRAINT "WorkflowAction_acted_by_fkey" FOREIGN KEY ("acted_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
