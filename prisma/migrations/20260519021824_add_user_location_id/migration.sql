-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "user_location_id" UUID;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_user_location_id_fkey" FOREIGN KEY ("user_location_id") REFERENCES "UserLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
