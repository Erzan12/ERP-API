/*
  Warnings:

  - You are about to drop the column `employmentHistoryId` on the `Employee` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "LeaveRequestStatus" AS ENUM ('draft', 'for_verification', 'for_approval', 'for_processing', 'processed', 'cancelled', 'rejected');

-- CreateEnum
CREATE TYPE "LeaveTransactionType" AS ENUM ('add', 'deduct');

-- CreateEnum
CREATE TYPE "WorkflowActionType" AS ENUM ('draft', 'created', 'submitted', 'verify', 'verified', 'approve', 'approved', 'reject', 'rejected', 'cancel', 'cancelled', 'process', 'processed', 'return', 'returned', 'escalate', 'reopen', 'hold', 'resume', 'for_acknowledgment', 'for_approval', 'for_evaluation', 'for_interview', 'for_reevaluation', 'for_regularization', 'for_promotion', 'for_processing', 'for_verification', 'evaluate', 'evaluated');

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "employmentHistoryId",
ADD COLUMN     "user_id" UUID;

-- CreateTable
CREATE TABLE "HrLeaveRequest" (
    "id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "date_from" TIMESTAMP(3) NOT NULL,
    "date_to" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "contact_number" TEXT NOT NULL,
    "address_on_leave" TEXT,
    "no_of_days" DOUBLE PRECISION,
    "status" "LeaveRequestStatus" NOT NULL DEFAULT 'draft',
    "reliever_id" UUID NOT NULL,
    "verifier_id" UUID NOT NULL,
    "approver_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,

    CONSTRAINT "HrLeaveRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrLeaveBalance" (
    "id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "leave_category_id" UUID NOT NULL,
    "year" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "used" INTEGER NOT NULL DEFAULT 0,
    "transaction_type" "LeaveTransactionType" NOT NULL,

    CONSTRAINT "HrLeaveBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrLeaveDates" (
    "id" UUID NOT NULL,
    "hr_leave_request_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "leave_category_id" UUID NOT NULL,
    "fraction" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "leave_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HrLeaveDates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowAction" (
    "id" UUID NOT NULL,
    "actionable_type" TEXT NOT NULL,
    "actionable_id" UUID NOT NULL,
    "action" "WorkflowActionType" NOT NULL,
    "acted_by" UUID NOT NULL,
    "acted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "remarks" TEXT,
    "metadata" JSONB,

    CONSTRAINT "WorkflowAction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HrLeaveBalance_employee_id_year_idx" ON "HrLeaveBalance"("employee_id", "year");

-- CreateIndex
CREATE UNIQUE INDEX "HrLeaveBalance_employee_id_leave_category_id_year_key" ON "HrLeaveBalance"("employee_id", "leave_category_id", "year");

-- CreateIndex
CREATE INDEX "Employee_employment_status_id_idx" ON "Employee"("employment_status_id");

-- AddForeignKey
ALTER TABLE "HrLeaveRequest" ADD CONSTRAINT "HrLeaveRequest_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrLeaveRequest" ADD CONSTRAINT "HrLeaveRequest_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrLeaveRequest" ADD CONSTRAINT "HrLeaveRequest_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrLeaveRequest" ADD CONSTRAINT "HrLeaveRequest_reliever_id_fkey" FOREIGN KEY ("reliever_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrLeaveRequest" ADD CONSTRAINT "HrLeaveRequest_verifier_id_fkey" FOREIGN KEY ("verifier_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrLeaveRequest" ADD CONSTRAINT "HrLeaveRequest_approver_id_fkey" FOREIGN KEY ("approver_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrLeaveBalance" ADD CONSTRAINT "HrLeaveBalance_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrLeaveBalance" ADD CONSTRAINT "HrLeaveBalance_leave_category_id_fkey" FOREIGN KEY ("leave_category_id") REFERENCES "HrLeaveCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrLeaveDates" ADD CONSTRAINT "HrLeaveDates_hr_leave_request_id_fkey" FOREIGN KEY ("hr_leave_request_id") REFERENCES "HrLeaveRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrLeaveDates" ADD CONSTRAINT "HrLeaveDates_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrLeaveDates" ADD CONSTRAINT "HrLeaveDates_leave_category_id_fkey" FOREIGN KEY ("leave_category_id") REFERENCES "HrLeaveCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowAction" ADD CONSTRAINT "WorkflowAction_acted_by_fkey" FOREIGN KEY ("acted_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
