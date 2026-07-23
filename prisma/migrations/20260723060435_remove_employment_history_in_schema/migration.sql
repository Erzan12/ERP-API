/*
  Warnings:

  - You are about to drop the column `probation_date` on the `HrEmployeeEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `regularization_date` on the `HrEmployeeEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `computed` on the `HrOvertimeRequest` table. All the data in the column will be lost.
  - You are about to drop the column `ot_date` on the `HrOvertimeRequest` table. All the data in the column will be lost.
  - You are about to drop the `EmploymentHistory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `evaluation_period_end` to the `HrEmployeeEvaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evaluation_period_start` to the `HrEmployeeEvaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `overtime_date` to the `HrOvertimeRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_position_id_fkey";

-- DropForeignKey
ALTER TABLE "EmploymentHistory" DROP CONSTRAINT "EmploymentHistory_created_by_fkey";

-- DropForeignKey
ALTER TABLE "EmploymentHistory" DROP CONSTRAINT "EmploymentHistory_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "EmploymentHistory" DROP CONSTRAINT "EmploymentHistory_updated_by_fkey";

-- AlterTable
ALTER TABLE "CareerPosting" ADD COLUMN     "approver_id" UUID,
ADD COLUMN     "verifier_id" UUID;

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "salary_grade_id" UUID,
ALTER COLUMN "position_id" DROP NOT NULL,
ALTER COLUMN "salary" DROP NOT NULL;

-- AlterTable
ALTER TABLE "HrEmployeeEvaluation" DROP COLUMN "probation_date",
DROP COLUMN "regularization_date",
ADD COLUMN     "evaluation_period_end" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "evaluation_period_start" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "HrExtendedLeaveRequest" ADD COLUMN     "approver_id" UUID,
ADD COLUMN     "verifier_id" UUID;

-- AlterTable
ALTER TABLE "HrLeaveRequest" ADD COLUMN     "approver_id" UUID,
ADD COLUMN     "verifier_id" UUID;

-- AlterTable
ALTER TABLE "HrOvertimeRequest" DROP COLUMN "computed",
DROP COLUMN "ot_date",
ADD COLUMN     "approver_id" UUID,
ADD COLUMN     "is_computed" BOOLEAN DEFAULT false,
ADD COLUMN     "overtime_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "verifier_id" UUID;

-- DropTable
DROP TABLE "EmploymentHistory";

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "Position"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_salary_grade_id_fkey" FOREIGN KEY ("salary_grade_id") REFERENCES "SalaryGrade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
