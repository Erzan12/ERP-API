-- AlterTable
ALTER TABLE "HrOvertimeRequest" ADD COLUMN     "user_location_id" UUID;

-- AddForeignKey
ALTER TABLE "HrOvertimeRequest" ADD CONSTRAINT "HrOvertimeRequest_user_location_id_fkey" FOREIGN KEY ("user_location_id") REFERENCES "UserLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
