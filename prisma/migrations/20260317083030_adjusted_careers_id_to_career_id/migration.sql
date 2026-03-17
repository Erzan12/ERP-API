/*
  Warnings:

  - You are about to drop the column `careers_id` on the `Applicant` table. All the data in the column will be lost.
  - Added the required column `career_id` to the `Applicant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Applicant" DROP CONSTRAINT "Applicant_careers_id_fkey";

-- AlterTable
ALTER TABLE "Applicant" DROP COLUMN "careers_id",
ADD COLUMN     "career_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_career_id_fkey" FOREIGN KEY ("career_id") REFERENCES "CareerPosting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
