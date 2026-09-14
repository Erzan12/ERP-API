/*
  Warnings:

  - A unique constraint covering the columns `[nte_id]` on the table `HrErCaseAttachment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "HrErCaseAttachment" ADD COLUMN     "nte_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "HrErCaseAttachment_nte_id_key" ON "HrErCaseAttachment"("nte_id");

-- AddForeignKey
ALTER TABLE "HrErCaseAttachment" ADD CONSTRAINT "HrErCaseAttachment_nte_id_fkey" FOREIGN KEY ("nte_id") REFERENCES "HrErCaseNte"("id") ON DELETE CASCADE ON UPDATE CASCADE;
