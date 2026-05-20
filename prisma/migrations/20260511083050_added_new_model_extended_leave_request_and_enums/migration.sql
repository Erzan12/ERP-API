-- CreateEnum
CREATE TYPE "LeaveCompensation" AS ENUM ('with_pay', 'without_pay');

-- CreateTable
CREATE TABLE "HrExtendedLeaveRequest" (
    "id" UUID NOT NULL,
    "leave_request_id" UUID NOT NULL,
    "reliever_id" UUID NOT NULL,
    "extension_date_from " TIMESTAMP(3) NOT NULL,
    "extension_date_to" TIMESTAMP(3) NOT NULL,
    "return_date" TIMESTAMP(3) NULL,
    "extended_leave_request_status" "LeaveRequestStatus" NOT NULL,
    "reason_for_extension" TEXT NOT NULL,
    "address_while_on_leave" TEXT NOT NULL,
    "contact_no_while_on_leave" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,

    CONSTRAINT "HrExtendedLeaveRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HrExtendedLeaveRequest_leave_request_id_idx" ON "HrExtendedLeaveRequest"("leave_request_id");

-- AddForeignKey
ALTER TABLE "HrExtendedLeaveRequest" ADD CONSTRAINT "HrExtendedLeaveRequest_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrExtendedLeaveRequest" ADD CONSTRAINT "HrExtendedLeaveRequest_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrExtendedLeaveRequest" ADD CONSTRAINT "HrExtendedLeaveRequest_reliever_id_fkey" FOREIGN KEY ("reliever_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrExtendedLeaveRequest" ADD CONSTRAINT "HrExtendedLeaveRequest_leave_request_id_fkey" FOREIGN KEY ("leave_request_id") REFERENCES "HrLeaveRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;