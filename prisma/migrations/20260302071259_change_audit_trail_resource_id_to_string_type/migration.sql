/*
  Warnings:

  - The `resource_id` column on the `AuditTrail` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "AuditTrail" DROP COLUMN "resource_id",
ADD COLUMN     "resource_id" UUID;

-- CreateIndex
CREATE INDEX "AuditTrail_resource_resource_id_idx" ON "AuditTrail"("resource", "resource_id");
