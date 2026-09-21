/*
  Warnings:

  - You are about to drop the column `incident_location` on the `HrErCase` table. All the data in the column will be lost.
  - Added the required column `incident_location_id` to the `HrErCase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `incident_location_type` to the `HrErCase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HrErCase" DROP COLUMN "incident_location",
ADD COLUMN     "incident_location_id" UUID NOT NULL,
ADD COLUMN     "incident_location_type" TEXT NOT NULL,
ADD COLUMN     "subject" TEXT,
ADD COLUMN     "type" "HrErIntakeType";
