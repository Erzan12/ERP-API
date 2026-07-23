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
  - Added the required column `type` to the `EmploymentHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evaluation_period_end` to the `HrEmployeeEvaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evaluation_period_start` to the `HrEmployeeEvaluation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EmployeeStatusPeriodType" AS ENUM ('active', 'leave', 'suspension', 'floating', 'training', 'maternity_leave', 'paternity_leave');

-- AlterTable
ALTER TABLE "EmploymentHistory" DROP COLUMN "evaluation_stage",
DROP COLUMN "evaluation_status",
DROP COLUMN "from_date",
DROP COLUMN "from_val",
DROP COLUMN "to_date",
DROP COLUMN "to_val",
DROP COLUMN "value_changed",
DROP COLUMN    "type",
ADD COLUMN     "current_id" UUID,
ADD COLUMN     "previous_id" UUID,
ALTER COLUMN "remarks" DROP NOT NULL;

-- AlterTable
ALTER TABLE "HrEmployeeEvaluation" DROP COLUMN "probation_date",
DROP COLUMN "regularization_date",
ADD COLUMN     "evaluation_period_end" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "evaluation_period_start" TIMESTAMP(3) NOT NULL;

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
CREATE INDEX "EmploymentHistory_effectivity_date_idx" ON "EmploymentHistory"("effectivity_date");

-- CreateIndex
CREATE INDEX "EmploymentHistory_employee_id_effectivity_date_idx" ON "EmploymentHistory"("employee_id", "effectivity_date");

-- AddForeignKey
ALTER TABLE "HrEmployeeStatusPeriod" ADD CONSTRAINT "HrEmployeeStatusPeriod_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrEmployeeStatusPeriod" ADD CONSTRAINT "HrEmployeeStatusPeriod_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrEmployeeStatusPeriod" ADD CONSTRAINT "HrEmployeeStatusPeriod_employment_history_id_fkey" FOREIGN KEY ("employment_history_id") REFERENCES "EmploymentHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrEmployeeStatusPeriod" ADD CONSTRAINT "HrEmployeeStatusPeriod_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
