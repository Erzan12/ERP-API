/*
  Warnings:

  - A unique constraint covering the columns `[hearing_id]` on the table `HrErCaseAttachment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "HrErCaseAttachment" ADD COLUMN     "hearing_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "HrErCaseAttachment_hearing_id_key" ON "HrErCaseAttachment"("hearing_id");

-- AddForeignKey
ALTER TABLE "HrErCaseAttachment" ADD CONSTRAINT "HrErCaseAttachment_hearing_id_fkey" FOREIGN KEY ("hearing_id") REFERENCES "HrErCaseHearing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
