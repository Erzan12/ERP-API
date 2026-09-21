/*
  Warnings:

  - You are about to drop the column `company_id` on the `SequenceCounter` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sequence_key,year]` on the table `SequenceCounter` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "SequenceCounter" DROP CONSTRAINT "SequenceCounter_company_id_fkey";

-- DropIndex
DROP INDEX "SequenceCounter_company_id_idx";

-- DropIndex
DROP INDEX "SequenceCounter_company_id_sequence_key_year_key";

-- AlterTable
ALTER TABLE "SequenceCounter" DROP COLUMN "company_id";

-- CreateIndex
CREATE UNIQUE INDEX "SequenceCounter_sequence_key_year_key" ON "SequenceCounter"("sequence_key", "year");
