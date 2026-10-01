/*
  Warnings:

  - A unique constraint covering the columns `[decision_payroll_deduction_id]` on the table `HrErCaseAttachment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "HrErCaseAttachment" ADD COLUMN     "decision_payroll_deduction_id" UUID;

-- CreateTable
CREATE TABLE "HrErNodPayrollAdjustment" (
    "id" UUID NOT NULL,
    "decision_id" UUID NOT NULL,
    "deduction_start" TIMESTAMP(3),
    "deduction_end" TIMESTAMP(3),
    "total_deduction" DECIMAL(10,2),
    "semi_monthly_deduction" DECIMAL(10,2),
    "decision_remarks" TEXT,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HrErNodPayrollAdjustment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HrErNodPayrollAdjustment_decision_id_key" ON "HrErNodPayrollAdjustment"("decision_id");

-- CreateIndex
CREATE UNIQUE INDEX "HrErCaseAttachment_decision_payroll_deduction_id_key" ON "HrErCaseAttachment"("decision_payroll_deduction_id");

-- AddForeignKey
ALTER TABLE "HrErNodPayrollAdjustment" ADD CONSTRAINT "HrErNodPayrollAdjustment_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErNodPayrollAdjustment" ADD CONSTRAINT "HrErNodPayrollAdjustment_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErNodPayrollAdjustment" ADD CONSTRAINT "HrErNodPayrollAdjustment_decision_id_fkey" FOREIGN KEY ("decision_id") REFERENCES "HrErCaseDecision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseAttachment" ADD CONSTRAINT "HrErCaseAttachment_decision_payroll_deduction_id_fkey" FOREIGN KEY ("decision_payroll_deduction_id") REFERENCES "HrErNodPayrollAdjustment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
