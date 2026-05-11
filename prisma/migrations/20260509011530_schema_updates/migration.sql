/*
  Warnings:

  - You are about to drop the column `leave_category_id` on the `HrLeaveDates` table. All the data in the column will be lost.
  - You are about to drop the column `approver_id` on the `HrLeaveRequest` table. All the data in the column will be lost.
  - You are about to drop the column `verifier_id` on the `HrLeaveRequest` table. All the data in the column will be lost.
  - You are about to drop the column `remarks` on the `WorkflowAction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "HrEmployeeEvaluation" DROP CONSTRAINT IF EXISTS "HrEmployeeEvaluation_approver_id_fkey";

-- DropForeignKey
ALTER TABLE "HrEmployeeEvaluation" DROP CONSTRAINT "HrEmployeeEvaluation_verifier_id_fkey";

-- DropForeignKey
ALTER TABLE "HrLeaveDates" DROP CONSTRAINT "HrLeaveDates_leave_category_id_fkey";

-- DropForeignKey
ALTER TABLE "HrLeaveRequest" DROP CONSTRAINT "HrLeaveRequest_approver_id_fkey";

-- DropForeignKey
ALTER TABLE "HrLeaveRequest" DROP CONSTRAINT "HrLeaveRequest_verifier_id_fkey";

-- AlterTable
ALTER TABLE "HrLeaveDates" DROP COLUMN "leave_category_id";

-- AlterTable
ALTER TABLE "HrLeaveRequest" DROP COLUMN "approver_id",
DROP COLUMN "verifier_id",
ADD COLUMN     "leave_category_id" UUID;

-- AlterTable
ALTER TABLE "WorkflowAction" DROP COLUMN "remarks",
ALTER COLUMN "acted_at" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "HrLeaveRequest" ADD CONSTRAINT "HrLeaveRequest_leave_category_id_fkey" FOREIGN KEY ("leave_category_id") REFERENCES "HrLeaveCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
