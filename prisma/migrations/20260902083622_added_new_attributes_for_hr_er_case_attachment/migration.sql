/*
  Warnings:

  - Added the required column `transaction_type` to the `HrErCaseAttachment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HrErCaseAttachment" ADD COLUMN     "file_desc" TEXT,
ADD COLUMN     "file_size" INTEGER,
ADD COLUMN     "transaction_type" TEXT NOT NULL;
