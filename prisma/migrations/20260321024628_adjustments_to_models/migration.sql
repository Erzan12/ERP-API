/*
  Warnings:

  - You are about to drop the column `interviewerId` on the `ExaminationRating` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `UserLocation` table. All the data in the column will be lost.
  - You are about to drop the column `locationName` on the `UserLocation` table. All the data in the column will be lost.
  - Added the required column `stage` to the `Interviewer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InterviewStage" AS ENUM ('initial', 'second', 'final');

-- DropForeignKey
ALTER TABLE "ExaminationRating" DROP CONSTRAINT "ExaminationRating_interviewerId_fkey";

-- DropIndex
DROP INDEX "UserLocation_address_idx";

-- DropIndex
DROP INDEX "UserLocation_locationName_idx";

-- AlterTable
ALTER TABLE "ExaminationRating" DROP COLUMN "interviewerId";

-- AlterTable
ALTER TABLE "Interviewer" ADD COLUMN     "stage" "InterviewStage" NOT NULL,
ALTER COLUMN "remarks" DROP NOT NULL,
ALTER COLUMN "total_points" DROP NOT NULL,
ALTER COLUMN "recommendations" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserLocation" DROP COLUMN "address",
DROP COLUMN "locationName",
ADD COLUMN     "address_line_1" TEXT,
ADD COLUMN     "address_line_2" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "location_name" TEXT,
ADD COLUMN     "province" TEXT;

-- CreateIndex
CREATE INDEX "UserLocation_location_name_idx" ON "UserLocation"("location_name");

-- CreateIndex
CREATE INDEX "UserLocation_address_line_1_idx" ON "UserLocation"("address_line_1");

-- CreateIndex
CREATE INDEX "UserLocation_province_idx" ON "UserLocation"("province");

-- CreateIndex
CREATE INDEX "UserLocation_country_idx" ON "UserLocation"("country");

-- CreateIndex
CREATE INDEX "UserLocation_city_idx" ON "UserLocation"("city");

-- AddForeignKey
ALTER TABLE "ExaminationRating" ADD CONSTRAINT "ExaminationRating_interviewer_id_fkey" FOREIGN KEY ("interviewer_id") REFERENCES "Interviewer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
