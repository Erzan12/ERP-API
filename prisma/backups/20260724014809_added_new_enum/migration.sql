/*
  Warnings:

  - Added the required column `type` to the `EmploymentHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EmploymentHistory" ADD COLUMN IF NOT EXISTS "type" "EmploymentHistoryType" NOT NULL;
