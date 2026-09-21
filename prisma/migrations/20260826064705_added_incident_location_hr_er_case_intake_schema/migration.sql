/*
  Warnings:

  - Added the required column `incident_location` to the `HrErCaseIntake` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HrErCaseIntake" ADD COLUMN     "incident_location" TEXT NOT NULL,
ALTER COLUMN "incident_narrative" DROP NOT NULL;
