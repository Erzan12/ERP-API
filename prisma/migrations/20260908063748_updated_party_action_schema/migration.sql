/*
  Warnings:

  - A unique constraint covering the columns `[party_id]` on the table `HrErCasePartyAction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `HrErCasePartyAction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HrErCasePartyAction" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_by" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "HrErCasePartyAction_party_id_key" ON "HrErCasePartyAction"("party_id");

-- AddForeignKey
ALTER TABLE "HrErCasePartyAction" ADD CONSTRAINT "HrErCasePartyAction_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
