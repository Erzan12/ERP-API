/*
  Warnings:

  - You are about to drop the column `evaluation_stage` on the `EmploymentHistory` table. All the data in the column will be lost.
  - You are about to drop the column `evaluation_status` on the `EmploymentHistory` table. All the data in the column will be lost.
  - You are about to drop the column `from_date` on the `EmploymentHistory` table. All the data in the column will be lost.
  - You are about to drop the column `from_val` on the `EmploymentHistory` table. All the data in the column will be lost.
  - You are about to drop the column `to_date` on the `EmploymentHistory` table. All the data in the column will be lost.
  - You are about to drop the column `to_val` on the `EmploymentHistory` table. All the data in the column will be lost.
  - You are about to drop the column `value_changed` on the `EmploymentHistory` table. All the data in the column will be lost.
  - You are about to drop the column `probation_date` on the `HrEmployeeEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `regularization_date` on the `HrEmployeeEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `computed` on the `HrOvertimeRequest` table. All the data in the column will be lost.
  - You are about to drop the column `ot_date` on the `HrOvertimeRequest` table. All the data in the column will be lost.
  - Added the required column `evaluation_period_end` to the `HrEmployeeEvaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evaluation_period_start` to the `HrEmployeeEvaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `overtime_date` to the `HrOvertimeRequest` table without a default value. This is not possible if the table is not empty.

*/
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'EmploymentHistoryType'
    ) THEN
        CREATE TYPE "EmploymentHistoryType" AS ENUM (
            'company',
            'division',
            'department',
            'section',
            'sub_section',
            'position',
            'salary_grade',
            'employment_status',
            'vessel',
            'employee_location',
            'developmental_assignment'
        );
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'EmployeeStatusPeriodType'
    ) THEN
        CREATE TYPE "EmployeeStatusPeriodType" AS ENUM (
            'active',
            'leave',
            'suspension',
            'floating',
            'training',
            'maternity_leave',
            'paternity_leave'
        );
    END IF;
END
$$;

-- AlterTable
ALTER TABLE "CareerPosting" 
ADD COLUMN IF NOT EXISTS "approver_id" UUID;

-- AlterTable
ALTER TABLE "CareerPosting" 
ADD COLUMN IF NOT EXISTS "verifier_id" UUID;

-- AlterTable
ALTER TABLE "Employee" 
ADD COLUMN IF NOT EXISTS "salary_grade_id" UUID,
ALTER COLUMN "salary" DROP NOT NULL;

-- AlterTable
ALTER TABLE "EmploymentHistory" DROP COLUMN IF EXISTS "evaluation_stage",
DROP COLUMN IF EXISTS "evaluation_status",
DROP COLUMN IF EXISTS "from_date",
DROP COLUMN IF EXISTS "from_val",
DROP COLUMN IF EXISTS "to_date",
DROP COLUMN IF EXISTS "to_val",
DROP COLUMN IF EXISTS "value_changed",
ADD COLUMN IF NOT EXISTS "current_id" UUID,
ADD COLUMN IF NOT EXISTS "previous_id" UUID,
ALTER COLUMN "remarks" DROP NOT NULL;

-- AlterTable
ALTER TABLE "HrEmployeeEvaluation" DROP COLUMN IF EXISTS "probation_date",
DROP COLUMN IF EXISTS "regularization_date",
ADD COLUMN IF NOT EXISTS "evaluation_period_end" TIMESTAMP(3) NOT NULL,
ADD COLUMN IF NOT EXISTS "evaluation_period_start" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "HrExtendedLeaveRequest" 
ADD COLUMN IF NOT EXISTS "approver_id" UUID,
ADD COLUMN IF NOT EXISTS "verifier_id" UUID;

-- AlterTable
ALTER TABLE "HrLeaveRequest" 
ADD COLUMN IF NOT EXISTS "approver_id" UUID,
ADD COLUMN IF NOT EXISTS "verifier_id" UUID;

-- AlterTable
ALTER TABLE "HrOvertimeRequest" DROP IF EXISTS COLUMN "computed",
DROP IF EXISTS COLUMN "ot_date",
ADD COLUMN IF NOT EXISTS "approver_id" UUID,
ADD COLUMN IF NOT EXISTS "is_computed" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "overtime_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN IF NOT EXISTS "verifier_id" UUID;

-- CreateTable
CREATE TABLE "HrEmployeeStatusPeriod" (
    "id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "employment_history_id" UUID,
    "status" "EmployeeStatusPeriodType" NOT NULL,
    "from_date" TIMESTAMP(3) NOT NULL,
    "to_date" TIMESTAMP(3),
    "remarks" TEXT,
    "created_by" UUID,
    "updated_by" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HrEmployeeStatusPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HrEmployeeStatusPeriod_employee_id_idx" ON "HrEmployeeStatusPeriod"("employee_id");

-- CreateIndex
CREATE INDEX "HrEmployeeStatusPeriod_from_date_idx" ON "HrEmployeeStatusPeriod"("from_date");

-- CreateIndex
CREATE INDEX "HrEmployeeStatusPeriod_to_date_idx" ON "HrEmployeeStatusPeriod"("to_date");

-- CreateIndex
CREATE INDEX "EmploymentHistory_employee_id_idx" ON "EmploymentHistory"("employee_id");

-- CreateIndex
CREATE INDEX "EmploymentHistory_effective_date_idx" ON "EmploymentHistory"("effective_date");

-- CreateIndex
CREATE INDEX "EmploymentHistory_employee_id_effective_date_idx" ON "EmploymentHistory"("employee_id", "effective_date");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_salary_grade_id_fkey" FOREIGN KEY ("salary_grade_id") REFERENCES "SalaryGrade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrEmployeeStatusPeriod" ADD CONSTRAINT "HrEmployeeStatusPeriod_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrEmployeeStatusPeriod" ADD CONSTRAINT "HrEmployeeStatusPeriod_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrEmployeeStatusPeriod" ADD CONSTRAINT "HrEmployeeStatusPeriod_employment_history_id_fkey" FOREIGN KEY ("employment_history_id") REFERENCES "EmploymentHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrEmployeeStatusPeriod" ADD CONSTRAINT "HrEmployeeStatusPeriod_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrEmployeeEvaluation" ADD CONSTRAINT "HrEmployeeEvaluation_verifier_id_fkey" FOREIGN KEY ("verifier_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrEmployeeEvaluation" ADD CONSTRAINT "HrEmployeeEvaluation_approver_id_fkey" FOREIGN KEY ("approver_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerPosting" ADD CONSTRAINT "CareerPosting_verifier_id_fkey" FOREIGN KEY ("verifier_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerPosting" ADD CONSTRAINT "CareerPosting_approver_id_fkey" FOREIGN KEY ("approver_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrLeaveRequest" ADD CONSTRAINT "HrLeaveRequest_verifier_id_fkey" FOREIGN KEY ("verifier_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrLeaveRequest" ADD CONSTRAINT "HrLeaveRequest_approver_id_fkey" FOREIGN KEY ("approver_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrExtendedLeaveRequest" ADD CONSTRAINT "HrExtendedLeaveRequest_verifier_id_fkey" FOREIGN KEY ("verifier_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrExtendedLeaveRequest" ADD CONSTRAINT "HrExtendedLeaveRequest_approver_id_fkey" FOREIGN KEY ("approver_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrOvertimeRequest" ADD CONSTRAINT "HrOvertimeRequest_verifier_id_fkey" FOREIGN KEY ("verifier_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrOvertimeRequest" ADD CONSTRAINT "HrOvertimeRequest_approver_id_fkey" FOREIGN KEY ("approver_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
