-- DropForeignKey
ALTER TABLE "HrEmployeeEvaluation" DROP CONSTRAINT "HrEmployeeEvaluation_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "HrEmployeeEvaluation" DROP CONSTRAINT "HrEmployeeEvaluation_evaluator_id_fkey";

-- AddForeignKey
ALTER TABLE "HrEmployeeEvaluation" ADD CONSTRAINT "HrEmployeeEvaluation_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrEmployeeEvaluation" ADD CONSTRAINT "HrEmployeeEvaluation_evaluator_id_fkey" FOREIGN KEY ("evaluator_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
