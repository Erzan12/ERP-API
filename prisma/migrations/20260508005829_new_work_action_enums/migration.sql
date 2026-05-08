/*
  Warnings:

  - You are about to drop the column `leave_category_id` on the `HrLeaveDates` table. All the data in the column will be lost.
  - You are about to drop the column `approver_id` on the `HrLeaveRequest` table. All the data in the column will be lost.
  - You are about to drop the column `verifier_id` on the `HrLeaveRequest` table. All the data in the column will be lost.
  - You are about to drop the column `remarks` on the `WorkflowAction` table. All the data in the column will be lost.

*/

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.

ALTER TYPE "WorkflowActionType" ADD VALUE 'evaluation';
ALTER TYPE "WorkflowActionType" ADD VALUE 'creation';
ALTER TYPE "WorkflowActionType" ADD VALUE 'submission';
ALTER TYPE "WorkflowActionType" ADD VALUE 'verification';
ALTER TYPE "WorkflowActionType" ADD VALUE 'approval';
ALTER TYPE "WorkflowActionType" ADD VALUE 'acknowledgment';
ALTER TYPE "WorkflowActionType" ADD VALUE 'rejection';
ALTER TYPE "WorkflowActionType" ADD VALUE 'cancellation';
ALTER TYPE "WorkflowActionType" ADD VALUE 'processing';
ALTER TYPE "WorkflowActionType" ADD VALUE 'escalation';
ALTER TYPE "WorkflowActionType" ADD VALUE 'reopening';
ALTER TYPE "WorkflowActionType" ADD VALUE 'resumption';
ALTER TYPE "WorkflowActionType" ADD VALUE 'screening';
ALTER TYPE "WorkflowActionType" ADD VALUE 'shortlisting';
ALTER TYPE "WorkflowActionType" ADD VALUE 'interview_scheduling';
ALTER TYPE "WorkflowActionType" ADD VALUE 'acceptance';
ALTER TYPE "WorkflowActionType" ADD VALUE 'onboarding';

-- DropForeignKey
ALTER TABLE "HrEmployeeEvaluation" DROP CONSTRAINT "HrEmployeeEvaluation_approver_id_fkey";

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
