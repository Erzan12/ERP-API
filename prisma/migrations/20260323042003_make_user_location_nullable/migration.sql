/*
  Warnings:

  - Made the column `location_name` on table `UserLocation` required. This step will fail if there are existing NULL values in that column.

*/

-- AlterTable
ALTER TABLE "UserLocation" ALTER COLUMN "location_name" SET NOT NULL;
