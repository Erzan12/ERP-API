/*
  Warnings:

  - You are about to drop the column `case_id` on the `HrErCaseStageLog` table. All the data in the column will be lost.
  - You are about to drop the column `hrErCasePartyId` on the `HrErCaseStageLog` table. All the data in the column will be lost.
  - Added the required column `party_id` to the `HrErCaseStageLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "HrErHearingStatus" ADD VALUE 'no_show';

-- DropForeignKey
ALTER TABLE "HrErCaseStageLog" DROP CONSTRAINT "HrErCaseStageLog_case_id_fkey";

-- DropForeignKey
ALTER TABLE "HrErCaseStageLog" DROP CONSTRAINT "HrErCaseStageLog_hrErCasePartyId_fkey";

-- DropIndex
DROP INDEX "HrErCaseStageLog_case_id_idx";

-- AlterTable
ALTER TABLE "HrErCaseStageLog" DROP COLUMN "case_id",
DROP COLUMN "hrErCasePartyId",
ADD COLUMN     "party_id" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "HrErCaseStageLog_party_id_idx" ON "HrErCaseStageLog"("party_id");

-- AddForeignKey
ALTER TABLE "HrErCaseStageLog" ADD CONSTRAINT "HrErCaseStageLog_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "HrErCaseParty"("id") ON DELETE CASCADE ON UPDATE CASCADE;
