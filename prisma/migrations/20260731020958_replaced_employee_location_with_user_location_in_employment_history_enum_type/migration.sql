/*
  Warnings:

  - The values [employee_location] on the enum `EmploymentHistoryType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EmploymentHistoryType_new" AS ENUM ('company', 'division', 'department', 'section', 'sub_section', 'position', 'salary_grade', 'employment_status', 'vessel', 'user_location', 'developmental_assignment');
ALTER TABLE "EmploymentHistory" ALTER COLUMN "type" TYPE "EmploymentHistoryType_new" USING ("type"::text::"EmploymentHistoryType_new");
ALTER TYPE "EmploymentHistoryType" RENAME TO "EmploymentHistoryType_old";
ALTER TYPE "EmploymentHistoryType_new" RENAME TO "EmploymentHistoryType";
DROP TYPE "public"."EmploymentHistoryType_old";
COMMIT;
