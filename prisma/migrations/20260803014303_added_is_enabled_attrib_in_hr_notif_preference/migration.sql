-- AlterTable
ALTER TABLE "HrEmployeeSmsSubscription" ADD COLUMN IF NOT EXISTS "is_enabled" BOOLEAN NOT NULL DEFAULT true;
