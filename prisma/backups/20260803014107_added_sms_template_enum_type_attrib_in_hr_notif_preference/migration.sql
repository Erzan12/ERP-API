/*
  Warnings:

  - A unique constraint covering the columns `[employee_id,template]` on the table `HrEmployeeSmsSubscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `template` to the `HrEmployeeSmsSubscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HrEmployeeSmsSubscription" ADD COLUMN IF NOT EXISTS "template" "SmsTemplate" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "HrEmployeeSmsSubscription_employee_id_template_key" ON "HrEmployeeSmsSubscription"("employee_id", "template");
