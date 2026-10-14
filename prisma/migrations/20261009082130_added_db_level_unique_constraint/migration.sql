/*
  Warnings:

  - A unique constraint covering the columns `[employee_id,stage]` on the table `HrEvaluationMonitoring` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "HrEvaluationMonitoring_employee_id_stage_key" ON "HrEvaluationMonitoring"("employee_id", "stage");
