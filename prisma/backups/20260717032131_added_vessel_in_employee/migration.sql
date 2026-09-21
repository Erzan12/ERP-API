-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "vessel_id" UUID;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "Vessel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
