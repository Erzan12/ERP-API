/*
  Warnings:

  - You are about to drop the column `employmentHistoryId` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the `ApplicantDocument` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "LeaveRequestStatus" AS ENUM ('draft', 'for_verification', 'for_approval', 'for_processing', 'processed', 'cancelled', 'rejected');

-- CreateEnum
CREATE TYPE "LeaveTransactionType" AS ENUM ('add', 'deduct');

-- CreateEnum
CREATE TYPE "WorkflowActionType" AS ENUM ('draft', 'created', 'submitted', 'verify', 'verified', 'approve', 'approved', 'reject', 'rejected', 'cancel', 'cancelled', 'process', 'processed', 'return', 'returned', 'escalate', 'reopen', 'hold', 'resume', 'screen', 'shortlist', 'set_interview', 'accept', 'onboard');

-- DropForeignKey
ALTER TABLE "ApplicantDocument" DROP CONSTRAINT "ApplicantDocument_applicant_id_fkey";

-- DropForeignKey
ALTER TABLE "ApplicantDocument" DROP CONSTRAINT "ApplicantDocument_created_by_fkey";

-- DropForeignKey
ALTER TABLE "ApplicantDocument" DROP CONSTRAINT "ApplicantDocument_updated_by_fkey";

-- AlterTable
ALTER TABLE "Applicant" ALTER COLUMN "application_status" SET DEFAULT 'applied';

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "employmentHistoryId",
ADD COLUMN     "user_id" UUID;

-- AlterTable
ALTER TABLE "HrEmployeeEvaluation" ALTER COLUMN "type_of_evaluation" DROP NOT NULL;

-- DropTable
DROP TABLE "ApplicantDocument";

-- CreateTable
CREATE TABLE "Attachments" (
    "id" UUID NOT NULL,
    "transaction_type" TEXT NOT NULL,
    "transaction_id" UUID NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "mime_type" TEXT,
    "file_desc" TEXT,
    "file_size" INTEGER,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrLeaveCategory" (
    "id" UUID NOT NULL,
    "category_name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HrLeaveCategory_pkey" PRIMARY KEY ("id")
);

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
    "is_active" BOOLEAN NOT NULL DEFAULT true,
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
CREATE INDEX "Attachments_transaction_type_transaction_id_idx" ON "Attachments"("transaction_type", "transaction_id");

-- CreateIndex
CREATE INDEX "HrLeaveBalance_employee_id_year_idx" ON "HrLeaveBalance"("employee_id", "year");

-- CreateIndex
CREATE UNIQUE INDEX "HrLeaveBalance_employee_id_leave_category_id_year_key" ON "HrLeaveBalance"("employee_id", "leave_category_id", "year");

-- CreateIndex
CREATE INDEX "Employee_employment_status_id_idx" ON "Employee"("employment_status_id");

-- AddForeignKey
ALTER TABLE "Attachments" ADD CONSTRAINT "Attachments_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachments" ADD CONSTRAINT "Attachments_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrLeaveCategory" ADD CONSTRAINT "HrLeaveCategory_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrLeaveCategory" ADD CONSTRAINT "HrLeaveCategory_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
