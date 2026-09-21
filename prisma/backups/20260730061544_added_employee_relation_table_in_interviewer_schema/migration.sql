-- AddForeignKey
ALTER TABLE "Interviewer" ADD CONSTRAINT "Interviewer_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
