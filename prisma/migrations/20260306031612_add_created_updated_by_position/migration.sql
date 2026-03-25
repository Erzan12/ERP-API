-- AlterTable
ALTER TABLE "Position" ADD COLUMN     "created_by" UUID,
ADD COLUMN     "updated_by" UUID;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
