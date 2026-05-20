/*
  Warnings:

  - You are about to drop the column `extension_date_from ` on the `HrExtendedLeaveRequest` table. All the data in the column will be lost.
  - Added the required column `extension_date_from` to the `HrExtendedLeaveRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leave_compensation` to the `HrLeaveDates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HrExtendedLeaveRequest" DROP COLUMN "extension_date_from ",
ADD COLUMN     "extension_date_from" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "HrLeaveDates" ADD COLUMN     "hr_extended_leave_request_id" UUID,
ADD COLUMN     "leave_compensation" "LeaveCompensation" NOT NULL;

-- AddForeignKey
ALTER TABLE "HrLeaveDates" ADD CONSTRAINT "HrLeaveDates_hr_extended_leave_request_id_fkey" FOREIGN KEY ("hr_extended_leave_request_id") REFERENCES "HrExtendedLeaveRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
