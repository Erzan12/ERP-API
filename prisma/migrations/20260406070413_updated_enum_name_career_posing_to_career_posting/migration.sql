/*
  Warnings:

  - The `status` column on the `CareerPosting` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "CareerPostingStatus" AS ENUM ('draft', 'submitted', 'for_verification', 'verified', 'for_approval', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "CareerPosting" DROP COLUMN "status",
ADD COLUMN     "status" "CareerPostingStatus" NOT NULL DEFAULT 'draft';

-- DropEnum
DROP TYPE "CareerPosingStatus";
