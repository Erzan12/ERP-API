/*
  Warnings:

  - You are about to drop the column `isPublished` on the `CareerPosting` table. All the data in the column will be lost.
  - The `employment_type` column on the `CareerPosting` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `employee_type` column on the `CareerPosting` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "CareerPosting" DROP COLUMN "isPublished",
ADD COLUMN     "is_published" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "employment_type",
ADD COLUMN     "employment_type" "EmploymentType",
DROP COLUMN "employee_type",
ADD COLUMN     "employee_type" "EmployeeType";

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "employmentHistoryId" UUID;

-- CreateTable
CREATE TABLE "EmploymentHistory" (
    "id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "effective_date" TIMESTAMP(3) NOT NULL,
    "value_changed" TEXT NOT NULL,
    "from_val" TEXT NOT NULL,
    "to_val" TEXT NOT NULL,
    "from_date" TIMESTAMP(3) NOT NULL,
    "to_date" TIMESTAMP(3) NOT NULL,
    "remarks" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmploymentHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_employmentHistoryId_fkey" FOREIGN KEY ("employmentHistoryId") REFERENCES "EmploymentHistory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmploymentHistory" ADD CONSTRAINT "EmploymentHistory_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmploymentHistory" ADD CONSTRAINT "EmploymentHistory_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
