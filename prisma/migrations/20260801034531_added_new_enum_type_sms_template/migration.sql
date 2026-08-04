-- CreateEnum
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'OtpPurposeTemplate'
    ) THEN
        CREATE TYPE "SmsTemplate" AS ENUM (
            'welcome', 
            'otp', 
            'leave_approved', 
            'leave_rejected', 
            'payslip_ready', 
            'regularization', 
            'overtime_approved'
        );
    END IF;
END $$;