-- DropForeignKey
ALTER TABLE "EmploymentHistory" DROP CONSTRAINT "EmploymentHistory_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "HrLeaveBalance" DROP CONSTRAINT "HrLeaveBalance_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "HrLeaveDates" DROP CONSTRAINT "HrLeaveDates_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "HrLeaveRequest" DROP CONSTRAINT "HrLeaveRequest_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "HrOvertimeRequest" DROP CONSTRAINT "HrOvertimeRequest_employee_id_fkey";

-- AddForeignKey
ALTER TABLE "EmploymentHistory" ADD CONSTRAINT "EmploymentHistory_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrLeaveRequest" ADD CONSTRAINT "HrLeaveRequest_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrOvertimeRequest" ADD CONSTRAINT "HrOvertimeRequest_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrLeaveBalance" ADD CONSTRAINT "HrLeaveBalance_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrLeaveDates" ADD CONSTRAINT "HrLeaveDates_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
