/*
  Warnings:

  - A unique constraint covering the columns `[explanation_id]` on the table `HrErCaseAttachment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "HrErCaseAttachment" ADD COLUMN     "explanation_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "HrErCaseAttachment_explanation_id_key" ON "HrErCaseAttachment"("explanation_id");

-- AddForeignKey
ALTER TABLE "HrErCaseAttachment" ADD CONSTRAINT "HrErCaseAttachment_explanation_id_fkey" FOREIGN KEY ("explanation_id") REFERENCES "HrErCaseExplanation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
