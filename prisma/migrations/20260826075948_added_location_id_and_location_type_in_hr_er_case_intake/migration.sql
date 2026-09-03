/*
  Warnings:

  - You are about to drop the column `incident_location` on the `HrErCaseIntake` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HrErCaseIntake" DROP COLUMN "incident_location",
ADD COLUMN     "incident_location_id" UUID,
ADD COLUMN     "incident_location_type" TEXT;
