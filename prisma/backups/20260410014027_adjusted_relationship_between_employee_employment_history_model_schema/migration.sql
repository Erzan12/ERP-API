-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_employmentHistoryId_fkey";

-- AddForeignKey
ALTER TABLE "EmploymentHistory" ADD CONSTRAINT "EmploymentHistory_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
