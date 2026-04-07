/*
  Warnings:

  - You are about to drop the column `isPublished` on the `CareerPosting` table. All the data in the column will be lost.
  - The `status` column on the `CareerPosting` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "CareerPostingStatus" AS ENUM ('draft', 'submitted', 'verified', 'approved', 'rejected');

-- AlterEnum
ALTER TYPE "ApplicationStatus" ADD VALUE 'shortlisted';

-- AlterTable
ALTER TABLE "CareerPosting" DROP COLUMN "isPublished",
ADD COLUMN     "is_published" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "status",
ADD COLUMN     "status" "CareerPostingStatus" NOT NULL DEFAULT 'draft';

-- DropEnum
DROP TYPE "CareerPosingStatus";
