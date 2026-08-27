/*
  Warnings:

  - You are about to drop the column `case_id` on the `HrErCaseIntake` table. All the data in the column will be lost.
  - You are about to drop the column `reported_by` on the `HrErCaseIntake` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[intake_id]` on the table `HrErCase` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `HrErCaseIntake` table without a default value. This is not possible if the table is not empty.
  - Made the column `incident_date` on table `HrErCaseIntake` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "HrErIntakeType" AS ENUM ('incident', 'employee');

-- DropForeignKey
ALTER TABLE "HrErCaseIntake" DROP CONSTRAINT "HrErCaseIntake_case_id_fkey";

-- DropForeignKey
ALTER TABLE "HrErCaseIntake" DROP CONSTRAINT "HrErCaseIntake_reported_by_fkey";

-- DropIndex
DROP INDEX "HrErCaseIntake_case_id_key";

-- AlterTable
ALTER TABLE "HrErCase" ADD COLUMN     "intake_id" UUID;

-- AlterTable
ALTER TABLE "HrErCaseIntake" DROP COLUMN "case_id",
DROP COLUMN "reported_by",
ADD COLUMN     "subject" TEXT,
ADD COLUMN     "type" "HrErIntakeType" NOT NULL,
ALTER COLUMN "incident_date" SET NOT NULL;

-- CreateTable
CREATE TABLE "HrErCaseIntakeOffense" (
    "id" UUID NOT NULL,
    "intake_id" UUID NOT NULL,
    "offense_id" UUID NOT NULL,

    CONSTRAINT "HrErCaseIntakeOffense_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HrErCaseIntakeOffense_intake_id_idx" ON "HrErCaseIntakeOffense"("intake_id");

-- CreateIndex
CREATE UNIQUE INDEX "HrErCaseIntakeOffense_intake_id_offense_id_key" ON "HrErCaseIntakeOffense"("intake_id", "offense_id");

-- CreateIndex
CREATE UNIQUE INDEX "HrErCase_intake_id_key" ON "HrErCase"("intake_id");

-- AddForeignKey
ALTER TABLE "HrErCaseIntakeOffense" ADD CONSTRAINT "HrErCaseIntakeOffense_intake_id_fkey" FOREIGN KEY ("intake_id") REFERENCES "HrErCaseIntake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseIntakeOffense" ADD CONSTRAINT "HrErCaseIntakeOffense_offense_id_fkey" FOREIGN KEY ("offense_id") REFERENCES "HrErCaseTypeOfOffense"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCase" ADD CONSTRAINT "HrErCase_intake_id_fkey" FOREIGN KEY ("intake_id") REFERENCES "HrErCaseIntake"("id") ON DELETE SET NULL ON UPDATE CASCADE;
