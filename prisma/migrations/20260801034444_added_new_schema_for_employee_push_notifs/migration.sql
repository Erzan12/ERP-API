-- CreateTable
CREATE TABLE "HrEmployeeSmsSubscription" (
    "id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "mobile_number_id" UUID,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "subscribed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HrEmployeeSmsSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeNotificationPreference" (
    "id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "sms_enabled" BOOLEAN NOT NULL DEFAULT false,
    "email_enabled" BOOLEAN NOT NULL DEFAULT true,
    "push_enabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EmployeeNotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HrEmployeeSmsSubscription_employee_id_key" ON "HrEmployeeSmsSubscription"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeNotificationPreference_employee_id_key" ON "EmployeeNotificationPreference"("employee_id");

-- AddForeignKey
ALTER TABLE "HrEmployeeSmsSubscription" ADD CONSTRAINT "HrEmployeeSmsSubscription_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrEmployeeSmsSubscription" ADD CONSTRAINT "HrEmployeeSmsSubscription_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrEmployeeSmsSubscription" ADD CONSTRAINT "HrEmployeeSmsSubscription_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrEmployeeSmsSubscription" ADD CONSTRAINT "HrEmployeeSmsSubscription_mobile_number_id_fkey" FOREIGN KEY ("mobile_number_id") REFERENCES "MobileNumber"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeNotificationPreference" ADD CONSTRAINT "EmployeeNotificationPreference_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
