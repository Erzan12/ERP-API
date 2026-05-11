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
ALTER TABLE "HrEmployeeEvaluation" DROP CONSTRAINT IF EXISTS "HrEmployeeEvaluation_verifier_id_fkey";

-- DropForeignKey
ALTER TABLE "HrLeaveDates" DROP CONSTRAINT IF EXISTS "HrLeaveDates_leave_category_id_fkey";

-- DropForeignKey
ALTER TABLE "HrLeaveRequest" DROP CONSTRAINT IF EXISTS "HrLeaveRequest_approver_id_fkey";

-- DropForeignKey
ALTER TABLE "HrLeaveRequest" DROP CONSTRAINT IF EXISTS "HrLeaveRequest_verifier_id_fkey";

-- AlterTable
ALTER TABLE "HrLeaveDates" DROP COLUMN IF EXISTS "leave_category_id";

-- AlterTable
ALTER TABLE "HrLeaveRequest" DROP COLUMN IF EXISTS "approver_id",
DROP COLUMN IF EXISTS "verifier_id",
ADD COLUMN IF NOT EXISTS "leave_category_id" UUID;

-- AlterTable
ALTER TABLE "WorkflowAction" DROP COLUMN "remarks",
ALTER COLUMN "acted_at" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "HrLeaveRequest" ADD CONSTRAINT "HrLeaveRequest_leave_category_id_fkey" FOREIGN KEY ("leave_category_id") REFERENCES "HrLeaveCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
