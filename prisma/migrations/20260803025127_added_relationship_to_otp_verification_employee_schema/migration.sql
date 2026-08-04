/*
  Warnings:

  - Added the required column `employee_id` to the `OtpVerification` table without a default value. This is not possible if the table is not empty.

*/
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'OtpPurposeTemplate'
    ) THEN
        CREATE TYPE "OtpPurposeTemplate" AS ENUM (
            'forgot_password',
            'login',
            'verify_phone',
            'register_employee'
        );
    END IF;
END $$;

-- AlterTable
ALTER TABLE "OtpVerification" ADD COLUMN     "employee_id" UUID NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "OtpVerification" ADD CONSTRAINT "OtpVerification_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
