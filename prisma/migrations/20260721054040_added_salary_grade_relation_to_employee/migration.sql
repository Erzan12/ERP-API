/*
  Warnings:

  - You are about to drop the column `computed` on the `HrOvertimeRequest` table. All the data in the column will be lost.
  - You are about to drop the column `ot_date` on the `HrOvertimeRequest` table. All the data in the column will be lost.
  - Added the required column `overtime_date` to the `HrOvertimeRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_position_id_fkey";

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "salary_grade_id" UUID,
ALTER COLUMN "position_id" DROP NOT NULL,
ALTER COLUMN "salary" DROP NOT NULL;

-- AlterTable
ALTER TABLE "HrOvertimeRequest" DROP COLUMN "computed",
DROP COLUMN "ot_date",
ADD COLUMN     "is_computed" BOOLEAN DEFAULT false,
ADD COLUMN     "overtime_date" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "Position"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_salary_grade_id_fkey" FOREIGN KEY ("salary_grade_id") REFERENCES "SalaryGrade"("id") ON DELETE SET NULL ON UPDATE CASCADE;
