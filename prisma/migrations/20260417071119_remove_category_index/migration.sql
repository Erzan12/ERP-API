/*
  Warnings:

  - You are about to drop the column `category` on the `HrPerformanceCompetency` table. All the data in the column will be lost.
  - Changed the type of `department_group` on the `HrPerformanceCompetency` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "HrPerformanceCompetency_category_idx";

-- AlterTable
ALTER TABLE "HrPerformanceCompetency" DROP COLUMN "category",
ADD COLUMN     "land_category" "LandBasedCategory",
ADD COLUMN     "sea_category" "SeaBasedCategory",
DROP COLUMN "department_group",
ADD COLUMN     "department_group" "EmployeeType" NOT NULL;

-- CreateIndex
CREATE INDEX "HrPerformanceCompetency_department_group_idx" ON "HrPerformanceCompetency"("department_group");
