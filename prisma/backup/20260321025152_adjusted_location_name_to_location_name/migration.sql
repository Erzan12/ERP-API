/*
  Warnings:

  - Made the column `address_line_1` on table `UserLocation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `UserLocation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `UserLocation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `location_name` on table `UserLocation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `province` on table `UserLocation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UserLocation" ALTER COLUMN "address_line_1" SET NOT NULL,
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "country" SET NOT NULL,
ALTER COLUMN "location_name" SET NOT NULL,
ALTER COLUMN "province" SET NOT NULL;
