/*
  Warnings:

  - You are about to drop the column `location_name` on the `UserLocation` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "UserLocation_location_name_idx";

-- AlterTable
ALTER TABLE "UserLocation" DROP COLUMN "location_name",
ADD COLUMN     "locationName" TEXT;

-- CreateIndex
CREATE INDEX "UserLocation_locationName_idx" ON "UserLocation"("locationName");
