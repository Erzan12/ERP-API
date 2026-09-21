/*
  Warnings:

  - You are about to drop the `ApplicantDocument` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ApplicantDocument" DROP CONSTRAINT "ApplicantDocument_applicant_id_fkey";

-- DropForeignKey
ALTER TABLE "ApplicantDocument" DROP CONSTRAINT "ApplicantDocument_created_by_fkey";

-- DropForeignKey
ALTER TABLE "ApplicantDocument" DROP CONSTRAINT "ApplicantDocument_updated_by_fkey";

-- AlterTable
ALTER TABLE "HrLeaveRequest" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "ApplicantDocument";

-- CreateTable
CREATE TABLE "Attachments" (
    "id" UUID NOT NULL,
    "transaction_type" TEXT NOT NULL,
    "transaction_id" UUID NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "mime_type" TEXT,
    "file_desc" TEXT,
    "file_size" INTEGER,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Attachments_transaction_type_transaction_id_idx" ON "Attachments"("transaction_type", "transaction_id");

-- AddForeignKey
ALTER TABLE "Attachments" ADD CONSTRAINT "Attachments_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachments" ADD CONSTRAINT "Attachments_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
