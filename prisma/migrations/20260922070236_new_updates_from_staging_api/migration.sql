/*
  Warnings:

  - You are about to drop the column `evaluation_stage` on the `EmploymentHistory` table. All the data in the column will be lost.
  - You are about to drop the column `evaluation_status` on the `EmploymentHistory` table. All the data in the column will be lost.
  - You are about to drop the column `from_date` on the `EmploymentHistory` table. All the data in the column will be lost.
  - You are about to drop the column `from_val` on the `EmploymentHistory` table. All the data in the column will be lost.
  - You are about to drop the column `to_date` on the `EmploymentHistory` table. All the data in the column will be lost.
  - You are about to drop the column `to_val` on the `EmploymentHistory` table. All the data in the column will be lost.
  - You are about to drop the column `value_changed` on the `EmploymentHistory` table. All the data in the column will be lost.
  - You are about to drop the column `probation_date` on the `HrEmployeeEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `regularization_date` on the `HrEmployeeEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `leave_category_id` on the `HrLeaveDates` table. All the data in the column will be lost.
  - You are about to drop the column `action` on the `RolePermission` table. All the data in the column will be lost.
  - You are about to drop the column `department_id` on the `RolePermission` table. All the data in the column will be lost.
  - You are about to drop the column `position_id` on the `RolePermission` table. All the data in the column will be lost.
  - You are about to drop the column `role_name` on the `RolePermission` table. All the data in the column will be lost.
  - You are about to drop the column `sub_module_id` on the `RolePermission` table. All the data in the column will be lost.
  - You are about to drop the column `remarks` on the `WorkflowAction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Module` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[role_id,sub_module_permission_id]` on the table `RolePermission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `SubModule` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `SubModuleAction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `SubModulePermission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sub_module_action_id,sub_module_id]` on the table `SubModulePermission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,sub_module_permission_id]` on the table `UserPermission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `EmploymentHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evaluation_period_end` to the `HrEmployeeEvaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evaluation_period_start` to the `HrEmployeeEvaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leave_compensation` to the `HrLeaveDates` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PermissionSource" AS ENUM ('role', 'direct');

-- CreateEnum
CREATE TYPE "EmploymentHistoryType" AS ENUM ('company', 'division', 'department', 'section', 'sub_section', 'position', 'salary_grade', 'employment_status', 'vessel', 'user_location', 'developmental_assignment');

-- CreateEnum
CREATE TYPE "EmployeeStatusPeriodType" AS ENUM ('active', 'leave', 'suspension', 'floating', 'training', 'maternity_leave', 'paternity_leave');

-- CreateEnum
CREATE TYPE "SmsTemplate" AS ENUM ('welcome', 'otp', 'leave_approved', 'leave_rejected', 'payslip_ready', 'regularization', 'overtime_approved');

-- CreateEnum
CREATE TYPE "OtpPurposeTemplate" AS ENUM ('forgot_password', 'login', 'verify_phone', 'register_employee');

-- CreateEnum
CREATE TYPE "EvaluationStageStatus" AS ENUM ('pending', 'overdue', 'complete');

-- CreateEnum
CREATE TYPE "LeaveCompensation" AS ENUM ('with_pay', 'without_pay');

-- CreateEnum
CREATE TYPE "VesselType" AS ENUM ('vessel_cargo', 'tugboat', 'barge');

-- CreateEnum
CREATE TYPE "OvertimeStatus" AS ENUM ('draft', 'submitted', 'for_verification', 'verified', 'for_approval', 'approved', 'for_processing', 'processed', 'cancelled', 'rejected');

-- CreateEnum
CREATE TYPE "HrErCasePartyRole" AS ENUM ('respondent', 'complainant', 'witness');

-- CreateEnum
CREATE TYPE "HrErCaseLevel" AS ENUM ('minor', 'major');

-- CreateEnum
CREATE TYPE "HrErCaseStage" AS ENUM ('notice_to_explain', 'written_explanation', 'administrative_hearing', 'notice_of_decision', 'case_closed');

-- CreateEnum
CREATE TYPE "HrErCaseStatus" AS ENUM ('open', 'closed');

-- CreateEnum
CREATE TYPE "HrErIntakeStatus" AS ENUM ('pending_review', 'converted', 'ignored', 'cancelled', 'draft', 'submitted', 'processed');

-- CreateEnum
CREATE TYPE "HrErIntakeType" AS ENUM ('incident', 'employee');

-- CreateEnum
CREATE TYPE "HrErApprovalStepType" AS ENUM ('nte_review', 'decision_approval');

-- CreateEnum
CREATE TYPE "HrErApprovalStatus" AS ENUM ('pending', 'approved', 'revise', 'rejected', 'verified');

-- CreateEnum
CREATE TYPE "HrErActionType" AS ENUM ('preventive_suspension');

-- CreateEnum
CREATE TYPE "HrErDecisionType" AS ENUM ('written_reprimand', 'stern_warning', 'suspension_7d', 'suspension_15d', 'dismissal', 'acquitted', 'rehabilitation');

-- CreateEnum
CREATE TYPE "HrErRecommendedPenalty" AS ENUM ('acquitted', 'written_reprimand', 'stern_warning', 'suspension', 'dismissal');

-- CreateEnum
CREATE TYPE "HrErNteServiceChannel" AS ENUM ('nra_office', 'personal', 'postal_mail');

-- CreateEnum
CREATE TYPE "HrErExplanationChannel" AS ENUM ('viber', 'email', 'letter', 'did_not_proceed');

-- CreateEnum
CREATE TYPE "HrErExplanationStatus" AS ENUM ('awaiting_response', 'received', 'no_response');

-- CreateEnum
CREATE TYPE "HrErHearingChannel" AS ENUM ('in_person', 'online', 'viber', 'postal_mail', 'call', 'text');

-- CreateEnum
CREATE TYPE "HrErHearingStatus" AS ENUM ('scheduled', 'conducted', 'rescheduled', 'no_show');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CareerPostingStatus" ADD VALUE 'all';
ALTER TYPE "CareerPostingStatus" ADD VALUE 'for_verification';
ALTER TYPE "CareerPostingStatus" ADD VALUE 'for_approval';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EvaluationStatus" ADD VALUE 'approved';
ALTER TYPE "EvaluationStatus" ADD VALUE 'rejected';

-- AlterEnum
ALTER TYPE "InterviewStage" ADD VALUE 'completed';

-- AlterEnum
ALTER TYPE "LeaveRequestStatus" ADD VALUE 'approved';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "WorkflowActionType" ADD VALUE 'for_acknowledgment';
ALTER TYPE "WorkflowActionType" ADD VALUE 'for_approval';
ALTER TYPE "WorkflowActionType" ADD VALUE 'for_evaluation';
ALTER TYPE "WorkflowActionType" ADD VALUE 'for_interview';
ALTER TYPE "WorkflowActionType" ADD VALUE 'for_reevaluation';
ALTER TYPE "WorkflowActionType" ADD VALUE 'for_regularization';
ALTER TYPE "WorkflowActionType" ADD VALUE 'for_promotion';
ALTER TYPE "WorkflowActionType" ADD VALUE 'for_processing';
ALTER TYPE "WorkflowActionType" ADD VALUE 'for_verification';
ALTER TYPE "WorkflowActionType" ADD VALUE 'evaluate';
ALTER TYPE "WorkflowActionType" ADD VALUE 'evaluated';
ALTER TYPE "WorkflowActionType" ADD VALUE 'evaluation';
ALTER TYPE "WorkflowActionType" ADD VALUE 'create';
ALTER TYPE "WorkflowActionType" ADD VALUE 'creation';
ALTER TYPE "WorkflowActionType" ADD VALUE 'update';
ALTER TYPE "WorkflowActionType" ADD VALUE 'submit';
ALTER TYPE "WorkflowActionType" ADD VALUE 'submission';
ALTER TYPE "WorkflowActionType" ADD VALUE 'verification';
ALTER TYPE "WorkflowActionType" ADD VALUE 'approval';
ALTER TYPE "WorkflowActionType" ADD VALUE 'acknowledgment';
ALTER TYPE "WorkflowActionType" ADD VALUE 'completed';
ALTER TYPE "WorkflowActionType" ADD VALUE 'rejection';
ALTER TYPE "WorkflowActionType" ADD VALUE 'cancellation';
ALTER TYPE "WorkflowActionType" ADD VALUE 'processing';
ALTER TYPE "WorkflowActionType" ADD VALUE 'escalation';
ALTER TYPE "WorkflowActionType" ADD VALUE 'reopening';
ALTER TYPE "WorkflowActionType" ADD VALUE 'resumption';
ALTER TYPE "WorkflowActionType" ADD VALUE 'screening';
ALTER TYPE "WorkflowActionType" ADD VALUE 'shortlisting';
ALTER TYPE "WorkflowActionType" ADD VALUE 'interview_scheduling';
ALTER TYPE "WorkflowActionType" ADD VALUE 'acceptance';
ALTER TYPE "WorkflowActionType" ADD VALUE 'onboarding';

-- DropForeignKey
ALTER TABLE "EmploymentHistory" DROP CONSTRAINT "EmploymentHistory_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "HrEmployeeEvaluation" DROP CONSTRAINT "HrEmployeeEvaluation_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "HrEmployeeEvaluation" DROP CONSTRAINT "HrEmployeeEvaluation_evaluator_id_fkey";

-- DropForeignKey
ALTER TABLE "HrLeaveBalance" DROP CONSTRAINT "HrLeaveBalance_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "HrLeaveDates" DROP CONSTRAINT "HrLeaveDates_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "HrLeaveDates" DROP CONSTRAINT "HrLeaveDates_leave_category_id_fkey";

-- DropForeignKey
ALTER TABLE "HrLeaveRequest" DROP CONSTRAINT "HrLeaveRequest_approver_id_fkey";

-- DropForeignKey
ALTER TABLE "HrLeaveRequest" DROP CONSTRAINT "HrLeaveRequest_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "HrLeaveRequest" DROP CONSTRAINT "HrLeaveRequest_verifier_id_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_department_id_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_position_id_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_sub_module_id_fkey";

-- DropForeignKey
ALTER TABLE "WorkflowAction" DROP CONSTRAINT "WorkflowAction_acted_by_fkey";

-- DropIndex
DROP INDEX "RolePermission_department_id_idx";

-- DropIndex
DROP INDEX "unique_role_permission";

-- DropIndex
DROP INDEX "UserPermission_user_role_id_role_permission_id_key";

-- AlterTable
ALTER TABLE "Applicant" ADD COLUMN     "completed_interview" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "CareerPosting" ADD COLUMN     "approver_id" UUID,
ADD COLUMN     "verifier_id" UUID;

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "user_location_id" UUID;

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "salary_grade_id" UUID,
ADD COLUMN     "user_location_id" UUID,
ADD COLUMN     "vessel_id" UUID,
ALTER COLUMN "salary" DROP NOT NULL;

-- AlterTable
ALTER TABLE "EmploymentHistory" DROP COLUMN "evaluation_stage",
DROP COLUMN "evaluation_status",
DROP COLUMN "from_date",
DROP COLUMN "from_val",
DROP COLUMN "to_date",
DROP COLUMN "to_val",
DROP COLUMN "value_changed",
ADD COLUMN     "current_id" UUID,
ADD COLUMN     "previous_id" UUID,
ADD COLUMN     "type" "EmploymentHistoryType" NOT NULL,
ALTER COLUMN "remarks" DROP NOT NULL;

-- AlterTable
ALTER TABLE "HrEmployeeEvaluation" DROP COLUMN "probation_date",
DROP COLUMN "regularization_date",
ADD COLUMN     "approver_id" UUID,
ADD COLUMN     "evaluation_period_end" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "evaluation_period_start" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "verifier_id" UUID;

-- AlterTable
ALTER TABLE "HrLeaveDates" DROP COLUMN "leave_category_id",
ADD COLUMN     "hr_extended_leave_request_id" UUID,
ADD COLUMN     "leave_compensation" "LeaveCompensation" NOT NULL;

-- AlterTable
ALTER TABLE "HrLeaveRequest" ADD COLUMN     "leave_category_id" UUID,
ADD COLUMN     "return_date" TIMESTAMP(3),
ALTER COLUMN "verifier_id" DROP NOT NULL,
ALTER COLUMN "approver_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Interviewer" ADD COLUMN     "is_completed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Module" ADD COLUMN     "slug" TEXT;

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "department_id" UUID;

-- AlterTable
ALTER TABLE "RolePermission" DROP COLUMN "action",
DROP COLUMN "department_id",
DROP COLUMN "position_id",
DROP COLUMN "role_name",
DROP COLUMN "sub_module_id";

-- AlterTable
ALTER TABLE "SubModule" ADD COLUMN     "slug" TEXT;

-- AlterTable
ALTER TABLE "SubModuleAction" ADD COLUMN     "slug" TEXT;

-- AlterTable
ALTER TABLE "SubModulePermission" ADD COLUMN     "code" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT;

-- AlterTable
ALTER TABLE "UserPermission" ADD COLUMN     "source" "PermissionSource",
ADD COLUMN     "sub_module_permission_id" UUID,
ALTER COLUMN "role_permission_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "WorkflowAction" DROP COLUMN "remarks",
ALTER COLUMN "acted_at" DROP NOT NULL;

-- CreateTable
CREATE TABLE "MobileNumber" (
    "id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "mobile_number" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT true,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MobileNumber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordHistory" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PasswordHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrEmployeeStatusPeriod" (
    "id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "employment_history_id" UUID,
    "status" "EmployeeStatusPeriodType" NOT NULL,
    "from_date" TIMESTAMP(3) NOT NULL,
    "to_date" TIMESTAMP(3),
    "remarks" TEXT,
    "created_by" UUID,
    "updated_by" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HrEmployeeStatusPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrEmployeeSmsSubscription" (
    "id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "mobile_number_id" UUID,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "template" "SmsTemplate" NOT NULL,
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

-- CreateTable
CREATE TABLE "Vessel" (
    "id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "photo" TEXT,
    "name" TEXT NOT NULL,
    "type" "VesselType" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vessel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VesselDetails" (
    "id" UUID NOT NULL,
    "vessel_id" UUID NOT NULL,
    "price_sold" TEXT,
    "price_paid" TEXT,
    "length_loa" TEXT,
    "length_lbp" TEXT,
    "breadth" TEXT,
    "depth" TEXT,
    "draft" TEXT,
    "year_built" TEXT,
    "builder" TEXT,
    "place_built" TEXT,
    "jap_dwt" TEXT,
    "bale_capacity" TEXT,
    "grain_capacity" TEXT,
    "hatch_size" TEXT,
    "hatch_type" TEXT,
    "hull_type" TEXT,
    "hull_number" TEXT,
    "fuel_type" TEXT,
    "gearbox_ratio" TEXT,
    "year_last_drydocked" TEXT,
    "place_last_drydocked" TEXT,
    "phil_dwt" DECIMAL(65,30),
    "gross_tonnage" TEXT,
    "net_tonnage" TEXT,
    "main_engine" TEXT,
    "main_engine_rating" TEXT,
    "main_engine_actual_rating" TEXT,
    "model_serial_no" TEXT,
    "estimated_fuel_consumption" TEXT,
    "bow_thrusters" TEXT,
    "propeller" TEXT,
    "call_sign" TEXT,
    "imo_no" TEXT,
    "mmsi_no" TEXT,
    "maiden_voyage" TIMESTAMP(3),
    "min_main_engine_rating" DOUBLE PRECISION,
    "max_main_engine_rating" DOUBLE PRECISION,
    "auxillary_engine_1_rating" DOUBLE PRECISION,
    "auxillary_engine_2_rating" DOUBLE PRECISION,
    "auxillary_engine_3_rating" DOUBLE PRECISION,
    "generator_set_rating" DOUBLE PRECISION,
    "crane_rating" DOUBLE PRECISION,
    "is_coupled_generator" BOOLEAN,
    "min_service_knots" DOUBLE PRECISION,
    "max_service_knots" DOUBLE PRECISION,
    "bank_account_number" TEXT,
    "bank_account_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VesselDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrExtendedLeaveRequest" (
    "id" UUID NOT NULL,
    "leave_request_id" UUID NOT NULL,
    "reliever_id" UUID NOT NULL,
    "extension_date_from" TIMESTAMP(3) NOT NULL,
    "extension_date_to" TIMESTAMP(3) NOT NULL,
    "return_date" TIMESTAMP(3),
    "extended_leave_request_status" "LeaveRequestStatus" NOT NULL DEFAULT 'draft',
    "reason_for_extension" TEXT NOT NULL,
    "address_while_on_leave" TEXT NOT NULL,
    "no_of_days" DOUBLE PRECISION,
    "contact_no_while_on_leave" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "verifier_id" UUID,
    "approver_id" UUID,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HrExtendedLeaveRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrOvertimeRequest" (
    "id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "vessel_id" UUID,
    "user_location_id" UUID,
    "overtime_rate_id" UUID,
    "date_filed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "overtime_date" TIMESTAMP(3) NOT NULL,
    "time_from" TIME,
    "time_to" TIME,
    "total_hours" DOUBLE PRECISION NOT NULL,
    "rate" DECIMAL(10,2),
    "reason" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "status" "OvertimeStatus" NOT NULL DEFAULT 'draft',
    "is_computed" BOOLEAN DEFAULT false,
    "verifier_id" UUID,
    "approver_id" UUID,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HrOvertimeRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrOvertimeRate" (
    "id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HrOvertimeRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalaryGrade" (
    "id" UUID NOT NULL,
    "grade" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "level" INTEGER NOT NULL,
    "is_confidential" BOOLEAN NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalaryGrade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrErCaseArticle" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HrErCaseArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrErCaseViolation" (
    "id" UUID NOT NULL,
    "article_id" UUID NOT NULL,
    "section" INTEGER NOT NULL,
    "behavior" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HrErCaseViolation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrErCaseTypeOfOffense" (
    "id" UUID NOT NULL,
    "type_of_offense" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HrErCaseTypeOfOffense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrErCaseIntake" (
    "id" UUID NOT NULL,
    "incident_narrative" TEXT,
    "incident_location_id" UUID,
    "incident_location_type" TEXT,
    "incident_date" TIMESTAMP(3) NOT NULL,
    "type" "HrErIntakeType" NOT NULL,
    "status" "HrErIntakeStatus" NOT NULL DEFAULT 'draft',
    "subject" TEXT,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HrErCaseIntake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrErCaseIntakeParty" (
    "id" UUID NOT NULL,
    "intake_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "role" "HrErCasePartyRole" NOT NULL,

    CONSTRAINT "HrErCaseIntakeParty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrErCaseIntakeViolation" (
    "id" UUID NOT NULL,
    "intake_id" UUID NOT NULL,
    "violation_id" UUID NOT NULL,

    CONSTRAINT "HrErCaseIntakeViolation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrErCaseIntakeOffense" (
    "id" UUID NOT NULL,
    "intake_id" UUID NOT NULL,
    "offense_id" UUID NOT NULL,

    CONSTRAINT "HrErCaseIntakeOffense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrErCase" (
    "id" UUID NOT NULL,
    "company_id" UUID,
    "intake_id" UUID,
    "control_number" INTEGER,
    "case_code" TEXT,
    "incident_location_id" UUID NOT NULL,
    "incident_location_type" TEXT NOT NULL,
    "assigned_location" TEXT,
    "incident_narrative" TEXT,
    "closing_remarks" TEXT,
    "type" "HrErIntakeType",
    "subject" TEXT,
    "incident_date" TIMESTAMP(3) NOT NULL,
    "report_date" TIMESTAMP(3) NOT NULL,
    "stage" "HrErCaseStage" NOT NULL DEFAULT 'notice_to_explain',
    "stage_started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "HrErCaseStatus" NOT NULL DEFAULT 'open',
    "closed_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HrErCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrErCaseParty" (
    "id" UUID NOT NULL,
    "case_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "role" "HrErCasePartyRole" NOT NULL,
    "level" "HrErCaseLevel",
    "remarks" TEXT,
    "stage" "HrErCaseStage",
    "stage_started_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HrErCaseParty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrErCasePartyViolation" (
    "id" UUID NOT NULL,
    "party_id" UUID NOT NULL,
    "violation_id" UUID NOT NULL,

    CONSTRAINT "HrErCasePartyViolation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrErCasePartyOffense" (
    "id" UUID NOT NULL,
    "party_id" UUID NOT NULL,
    "offense_id" UUID NOT NULL,

    CONSTRAINT "HrErCasePartyOffense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrErCasePartyAction" (
    "id" UUID NOT NULL,
    "party_id" UUID NOT NULL,
    "action_type" "HrErActionType" NOT NULL,
    "effectivity_start" TIMESTAMP(3) NOT NULL,
    "effectivity_end" TIMESTAMP(3) NOT NULL,
    "remarks" TEXT,
    "created_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" UUID,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HrErCasePartyAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrErCaseNte" (
    "id" UUID NOT NULL,
    "party_id" UUID NOT NULL,
    "issued_at" TIMESTAMP(3),
    "due_date" TIMESTAMP(3),
    "form_url" TEXT,
    "status" "HrErApprovalStatus" NOT NULL DEFAULT 'revise',
    "service_channel" "HrErNteServiceChannel",
    "reference_number" TEXT,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HrErCaseNte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrErCaseExplanation" (
    "id" UUID NOT NULL,
    "party_id" UUID NOT NULL,
    "status" "HrErExplanationStatus" NOT NULL DEFAULT 'awaiting_response',
    "channel" "HrErExplanationChannel",
    "response_text" TEXT,
    "file_url" TEXT,
    "received_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HrErCaseExplanation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrErCaseHearing" (
    "id" UUID NOT NULL,
    "party_id" UUID NOT NULL,
    "scheduled_at" TIMESTAMP(3),
    "channel" "HrErHearingChannel",
    "status" "HrErHearingStatus" NOT NULL DEFAULT 'scheduled',
    "scheduled_start_at" TIMESTAMP(3),
    "scheduled_end_at" TIMESTAMP(3),
    "minutes_file_url" TEXT,
    "minutes_started_at" TIMESTAMP(3),
    "minutes_ended_at" TIMESTAMP(3),
    "respondent_statement" TEXT,
    "remarks" TEXT,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HrErCaseHearing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrErCaseHearingCommittee" (
    "id" UUID NOT NULL,
    "hearing_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "notified_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HrErCaseHearingCommittee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrErCaseHearingDeliberation" (
    "id" UUID NOT NULL,
    "committee_id" UUID NOT NULL,
    "recommended_penalty" "HrErRecommendedPenalty" NOT NULL,
    "remarks" TEXT,
    "submitted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HrErCaseHearingDeliberation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrErCaseHearingAttendee" (
    "id" UUID NOT NULL,
    "hearing_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT,
    "signature_url" TEXT,
    "signed_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HrErCaseHearingAttendee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrErCaseDecision" (
    "id" UUID NOT NULL,
    "party_id" UUID NOT NULL,
    "decision_type" "HrErDecisionType" NOT NULL,
    "effectivity_start" TIMESTAMP(3),
    "effectivity_end" TIMESTAMP(3),
    "issued_at" TIMESTAMP(3),
    "signed_file_url" TEXT,
    "remarks" TEXT,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HrErCaseDecision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrErCaseApproval" (
    "id" UUID NOT NULL,
    "step_type" "HrErApprovalStepType" NOT NULL,
    "nte_id" UUID,
    "decision_id" UUID,
    "reviewer_id" UUID NOT NULL,
    "status" "HrErApprovalStatus" NOT NULL DEFAULT 'revise',
    "remarks" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "sequence" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HrErCaseApproval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrErCaseAttachment" (
    "id" UUID NOT NULL,
    "transaction_type" TEXT NOT NULL,
    "intake_id" UUID,
    "case_id" UUID,
    "nte_id" UUID,
    "explanation_id" UUID,
    "hearing_id" UUID,
    "decision_id" UUID,
    "file_name" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_type" TEXT,
    "file_desc" TEXT,
    "file_size" INTEGER,
    "uploaded_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HrErCaseAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrErCaseActivityLog" (
    "id" UUID NOT NULL,
    "case_id" UUID NOT NULL,
    "party_id" UUID,
    "actor_id" UUID NOT NULL,
    "stage" "HrErCaseStage",
    "action" TEXT NOT NULL,
    "metadata" JSONB,
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HrErCaseActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrErCaseStageLog" (
    "id" UUID NOT NULL,
    "party_id" UUID NOT NULL,
    "stage" "HrErCaseStage" NOT NULL,
    "sla_days" INTEGER NOT NULL,
    "entered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exited_at" TIMESTAMP(3),

    CONSTRAINT "HrErCaseStageLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SequenceCounter" (
    "id" UUID NOT NULL,
    "sequence_key" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "last_number" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SequenceCounter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtpVerification" (
    "id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "user_id" UUID,
    "code" TEXT NOT NULL,
    "purpose" "OtpPurposeTemplate" NOT NULL,
    "is_used" BOOLEAN NOT NULL DEFAULT false,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OtpVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MobileNumber_mobile_number_key" ON "MobileNumber"("mobile_number");

-- CreateIndex
CREATE INDEX "MobileNumber_employee_id_idx" ON "MobileNumber"("employee_id");

-- CreateIndex
CREATE INDEX "PasswordHistory_user_id_idx" ON "PasswordHistory"("user_id");

-- CreateIndex
CREATE INDEX "HrEmployeeStatusPeriod_employee_id_idx" ON "HrEmployeeStatusPeriod"("employee_id");

-- CreateIndex
CREATE INDEX "HrEmployeeStatusPeriod_from_date_idx" ON "HrEmployeeStatusPeriod"("from_date");

-- CreateIndex
CREATE INDEX "HrEmployeeStatusPeriod_to_date_idx" ON "HrEmployeeStatusPeriod"("to_date");

-- CreateIndex
CREATE UNIQUE INDEX "HrEmployeeSmsSubscription_employee_id_template_key" ON "HrEmployeeSmsSubscription"("employee_id", "template");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeNotificationPreference_employee_id_key" ON "EmployeeNotificationPreference"("employee_id");

-- CreateIndex
CREATE INDEX "Vessel_company_id_idx" ON "Vessel"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "VesselDetails_vessel_id_key" ON "VesselDetails"("vessel_id");

-- CreateIndex
CREATE INDEX "HrExtendedLeaveRequest_leave_request_id_idx" ON "HrExtendedLeaveRequest"("leave_request_id");

-- CreateIndex
CREATE INDEX "HrOvertimeRequest_employee_id_vessel_id_overtime_rate_id_idx" ON "HrOvertimeRequest"("employee_id", "vessel_id", "overtime_rate_id");

-- CreateIndex
CREATE INDEX "HrErCaseViolation_article_id_idx" ON "HrErCaseViolation"("article_id");

-- CreateIndex
CREATE INDEX "HrErCaseIntake_status_idx" ON "HrErCaseIntake"("status");

-- CreateIndex
CREATE INDEX "HrErCaseIntakeParty_intake_id_idx" ON "HrErCaseIntakeParty"("intake_id");

-- CreateIndex
CREATE UNIQUE INDEX "HrErCaseIntakeParty_intake_id_employee_id_role_key" ON "HrErCaseIntakeParty"("intake_id", "employee_id", "role");

-- CreateIndex
CREATE UNIQUE INDEX "HrErCaseIntakeViolation_intake_id_violation_id_key" ON "HrErCaseIntakeViolation"("intake_id", "violation_id");

-- CreateIndex
CREATE INDEX "HrErCaseIntakeOffense_intake_id_idx" ON "HrErCaseIntakeOffense"("intake_id");

-- CreateIndex
CREATE UNIQUE INDEX "HrErCaseIntakeOffense_intake_id_offense_id_key" ON "HrErCaseIntakeOffense"("intake_id", "offense_id");

-- CreateIndex
CREATE UNIQUE INDEX "HrErCase_intake_id_key" ON "HrErCase"("intake_id");

-- CreateIndex
CREATE INDEX "HrErCase_stage_idx" ON "HrErCase"("stage");

-- CreateIndex
CREATE INDEX "HrErCase_status_idx" ON "HrErCase"("status");

-- CreateIndex
CREATE UNIQUE INDEX "HrErCase_company_id_control_number_key" ON "HrErCase"("company_id", "control_number");

-- CreateIndex
CREATE INDEX "HrErCaseParty_case_id_idx" ON "HrErCaseParty"("case_id");

-- CreateIndex
CREATE INDEX "HrErCaseParty_role_idx" ON "HrErCaseParty"("role");

-- CreateIndex
CREATE UNIQUE INDEX "HrErCaseParty_case_id_employee_id_role_key" ON "HrErCaseParty"("case_id", "employee_id", "role");

-- CreateIndex
CREATE INDEX "HrErCasePartyViolation_party_id_idx" ON "HrErCasePartyViolation"("party_id");

-- CreateIndex
CREATE UNIQUE INDEX "HrErCasePartyViolation_party_id_violation_id_key" ON "HrErCasePartyViolation"("party_id", "violation_id");

-- CreateIndex
CREATE INDEX "HrErCasePartyOffense_party_id_idx" ON "HrErCasePartyOffense"("party_id");

-- CreateIndex
CREATE UNIQUE INDEX "HrErCasePartyOffense_party_id_offense_id_key" ON "HrErCasePartyOffense"("party_id", "offense_id");

-- CreateIndex
CREATE UNIQUE INDEX "HrErCasePartyAction_party_id_key" ON "HrErCasePartyAction"("party_id");

-- CreateIndex
CREATE INDEX "HrErCasePartyAction_party_id_idx" ON "HrErCasePartyAction"("party_id");

-- CreateIndex
CREATE UNIQUE INDEX "HrErCaseNte_party_id_key" ON "HrErCaseNte"("party_id");

-- CreateIndex
CREATE UNIQUE INDEX "HrErCaseExplanation_party_id_key" ON "HrErCaseExplanation"("party_id");

-- CreateIndex
CREATE UNIQUE INDEX "HrErCaseHearing_party_id_key" ON "HrErCaseHearing"("party_id");

-- CreateIndex
CREATE INDEX "HrErCaseHearing_party_id_idx" ON "HrErCaseHearing"("party_id");

-- CreateIndex
CREATE INDEX "HrErCaseHearingCommittee_hearing_id_idx" ON "HrErCaseHearingCommittee"("hearing_id");

-- CreateIndex
CREATE UNIQUE INDEX "HrErCaseHearingCommittee_hearing_id_employee_id_key" ON "HrErCaseHearingCommittee"("hearing_id", "employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "HrErCaseHearingDeliberation_committee_id_key" ON "HrErCaseHearingDeliberation"("committee_id");

-- CreateIndex
CREATE INDEX "HrErCaseHearingAttendee_hearing_id_idx" ON "HrErCaseHearingAttendee"("hearing_id");

-- CreateIndex
CREATE UNIQUE INDEX "HrErCaseDecision_party_id_key" ON "HrErCaseDecision"("party_id");

-- CreateIndex
CREATE INDEX "HrErCaseApproval_nte_id_idx" ON "HrErCaseApproval"("nte_id");

-- CreateIndex
CREATE INDEX "HrErCaseApproval_decision_id_idx" ON "HrErCaseApproval"("decision_id");

-- CreateIndex
CREATE UNIQUE INDEX "HrErCaseAttachment_nte_id_key" ON "HrErCaseAttachment"("nte_id");

-- CreateIndex
CREATE UNIQUE INDEX "HrErCaseAttachment_explanation_id_key" ON "HrErCaseAttachment"("explanation_id");

-- CreateIndex
CREATE INDEX "HrErCaseAttachment_intake_id_idx" ON "HrErCaseAttachment"("intake_id");

-- CreateIndex
CREATE INDEX "HrErCaseAttachment_case_id_idx" ON "HrErCaseAttachment"("case_id");

-- CreateIndex
CREATE INDEX "HrErCaseActivityLog_case_id_stage_idx" ON "HrErCaseActivityLog"("case_id", "stage");

-- CreateIndex
CREATE INDEX "HrErCaseStageLog_party_id_idx" ON "HrErCaseStageLog"("party_id");

-- CreateIndex
CREATE UNIQUE INDEX "SequenceCounter_sequence_key_year_key" ON "SequenceCounter"("sequence_key", "year");

-- CreateIndex
CREATE INDEX "EmploymentHistory_employee_id_idx" ON "EmploymentHistory"("employee_id");

-- CreateIndex
CREATE INDEX "EmploymentHistory_effective_date_idx" ON "EmploymentHistory"("effective_date");

-- CreateIndex
CREATE INDEX "EmploymentHistory_employee_id_effective_date_idx" ON "EmploymentHistory"("employee_id", "effective_date");

-- CreateIndex
CREATE UNIQUE INDEX "Module_slug_key" ON "Module"("slug");

-- CreateIndex
CREATE INDEX "Role_department_id_idx" ON "Role"("department_id");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_role_id_sub_module_permission_id_key" ON "RolePermission"("role_id", "sub_module_permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "SubModule_slug_key" ON "SubModule"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SubModuleAction_slug_key" ON "SubModuleAction"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SubModulePermission_code_key" ON "SubModulePermission"("code");

-- CreateIndex
CREATE UNIQUE INDEX "SubModulePermission_sub_module_action_id_sub_module_id_key" ON "SubModulePermission"("sub_module_action_id", "sub_module_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserPermission_user_id_sub_module_permission_id_key" ON "UserPermission"("user_id", "sub_module_permission_id");

-- AddForeignKey
ALTER TABLE "MobileNumber" ADD CONSTRAINT "MobileNumber_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordHistory" ADD CONSTRAINT "PasswordHistory_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordHistory" ADD CONSTRAINT "PasswordHistory_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordHistory" ADD CONSTRAINT "PasswordHistory_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_user_location_id_fkey" FOREIGN KEY ("user_location_id") REFERENCES "UserLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_user_location_id_fkey" FOREIGN KEY ("user_location_id") REFERENCES "UserLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "Vessel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_salary_grade_id_fkey" FOREIGN KEY ("salary_grade_id") REFERENCES "SalaryGrade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmploymentHistory" ADD CONSTRAINT "EmploymentHistory_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrEmployeeStatusPeriod" ADD CONSTRAINT "HrEmployeeStatusPeriod_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrEmployeeStatusPeriod" ADD CONSTRAINT "HrEmployeeStatusPeriod_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrEmployeeStatusPeriod" ADD CONSTRAINT "HrEmployeeStatusPeriod_employment_history_id_fkey" FOREIGN KEY ("employment_history_id") REFERENCES "EmploymentHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrEmployeeStatusPeriod" ADD CONSTRAINT "HrEmployeeStatusPeriod_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "Vessel" ADD CONSTRAINT "Vessel_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vessel" ADD CONSTRAINT "Vessel_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vessel" ADD CONSTRAINT "Vessel_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VesselDetails" ADD CONSTRAINT "VesselDetails_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "Vessel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrEmployeeEvaluation" ADD CONSTRAINT "HrEmployeeEvaluation_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrEmployeeEvaluation" ADD CONSTRAINT "HrEmployeeEvaluation_evaluator_id_fkey" FOREIGN KEY ("evaluator_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrEmployeeEvaluation" ADD CONSTRAINT "HrEmployeeEvaluation_verifier_id_fkey" FOREIGN KEY ("verifier_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrEmployeeEvaluation" ADD CONSTRAINT "HrEmployeeEvaluation_approver_id_fkey" FOREIGN KEY ("approver_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_sub_module_permission_id_fkey" FOREIGN KEY ("sub_module_permission_id") REFERENCES "SubModulePermission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerPosting" ADD CONSTRAINT "CareerPosting_verifier_id_fkey" FOREIGN KEY ("verifier_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerPosting" ADD CONSTRAINT "CareerPosting_approver_id_fkey" FOREIGN KEY ("approver_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interviewer" ADD CONSTRAINT "Interviewer_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrLeaveRequest" ADD CONSTRAINT "HrLeaveRequest_leave_category_id_fkey" FOREIGN KEY ("leave_category_id") REFERENCES "HrLeaveCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrLeaveRequest" ADD CONSTRAINT "HrLeaveRequest_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrLeaveRequest" ADD CONSTRAINT "HrLeaveRequest_verifier_id_fkey" FOREIGN KEY ("verifier_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrLeaveRequest" ADD CONSTRAINT "HrLeaveRequest_approver_id_fkey" FOREIGN KEY ("approver_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrExtendedLeaveRequest" ADD CONSTRAINT "HrExtendedLeaveRequest_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrExtendedLeaveRequest" ADD CONSTRAINT "HrExtendedLeaveRequest_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrExtendedLeaveRequest" ADD CONSTRAINT "HrExtendedLeaveRequest_reliever_id_fkey" FOREIGN KEY ("reliever_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrExtendedLeaveRequest" ADD CONSTRAINT "HrExtendedLeaveRequest_verifier_id_fkey" FOREIGN KEY ("verifier_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrExtendedLeaveRequest" ADD CONSTRAINT "HrExtendedLeaveRequest_approver_id_fkey" FOREIGN KEY ("approver_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrExtendedLeaveRequest" ADD CONSTRAINT "HrExtendedLeaveRequest_leave_request_id_fkey" FOREIGN KEY ("leave_request_id") REFERENCES "HrLeaveRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrOvertimeRequest" ADD CONSTRAINT "HrOvertimeRequest_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrOvertimeRequest" ADD CONSTRAINT "HrOvertimeRequest_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrOvertimeRequest" ADD CONSTRAINT "HrOvertimeRequest_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrOvertimeRequest" ADD CONSTRAINT "HrOvertimeRequest_verifier_id_fkey" FOREIGN KEY ("verifier_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrOvertimeRequest" ADD CONSTRAINT "HrOvertimeRequest_approver_id_fkey" FOREIGN KEY ("approver_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrOvertimeRequest" ADD CONSTRAINT "HrOvertimeRequest_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "Vessel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrOvertimeRequest" ADD CONSTRAINT "HrOvertimeRequest_user_location_id_fkey" FOREIGN KEY ("user_location_id") REFERENCES "UserLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrOvertimeRequest" ADD CONSTRAINT "HrOvertimeRequest_overtime_rate_id_fkey" FOREIGN KEY ("overtime_rate_id") REFERENCES "HrOvertimeRate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrOvertimeRate" ADD CONSTRAINT "HrOvertimeRate_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrOvertimeRate" ADD CONSTRAINT "HrOvertimeRate_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrLeaveBalance" ADD CONSTRAINT "HrLeaveBalance_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrLeaveDates" ADD CONSTRAINT "HrLeaveDates_hr_extended_leave_request_id_fkey" FOREIGN KEY ("hr_extended_leave_request_id") REFERENCES "HrExtendedLeaveRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrLeaveDates" ADD CONSTRAINT "HrLeaveDates_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalaryGrade" ADD CONSTRAINT "SalaryGrade_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalaryGrade" ADD CONSTRAINT "SalaryGrade_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseArticle" ADD CONSTRAINT "HrErCaseArticle_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseArticle" ADD CONSTRAINT "HrErCaseArticle_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseViolation" ADD CONSTRAINT "HrErCaseViolation_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseViolation" ADD CONSTRAINT "HrErCaseViolation_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseViolation" ADD CONSTRAINT "HrErCaseViolation_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "HrErCaseArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseTypeOfOffense" ADD CONSTRAINT "HrErCaseTypeOfOffense_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseTypeOfOffense" ADD CONSTRAINT "HrErCaseTypeOfOffense_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseIntake" ADD CONSTRAINT "HrErCaseIntake_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseIntake" ADD CONSTRAINT "HrErCaseIntake_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseIntakeParty" ADD CONSTRAINT "HrErCaseIntakeParty_intake_id_fkey" FOREIGN KEY ("intake_id") REFERENCES "HrErCaseIntake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseIntakeParty" ADD CONSTRAINT "HrErCaseIntakeParty_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseIntakeViolation" ADD CONSTRAINT "HrErCaseIntakeViolation_intake_id_fkey" FOREIGN KEY ("intake_id") REFERENCES "HrErCaseIntake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseIntakeViolation" ADD CONSTRAINT "HrErCaseIntakeViolation_violation_id_fkey" FOREIGN KEY ("violation_id") REFERENCES "HrErCaseViolation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseIntakeOffense" ADD CONSTRAINT "HrErCaseIntakeOffense_intake_id_fkey" FOREIGN KEY ("intake_id") REFERENCES "HrErCaseIntake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseIntakeOffense" ADD CONSTRAINT "HrErCaseIntakeOffense_offense_id_fkey" FOREIGN KEY ("offense_id") REFERENCES "HrErCaseTypeOfOffense"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCase" ADD CONSTRAINT "HrErCase_intake_id_fkey" FOREIGN KEY ("intake_id") REFERENCES "HrErCaseIntake"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCase" ADD CONSTRAINT "HrErCase_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCase" ADD CONSTRAINT "HrErCase_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCase" ADD CONSTRAINT "HrErCase_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseParty" ADD CONSTRAINT "HrErCaseParty_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "HrErCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseParty" ADD CONSTRAINT "HrErCaseParty_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseParty" ADD CONSTRAINT "HrErCaseParty_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseParty" ADD CONSTRAINT "HrErCaseParty_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCasePartyViolation" ADD CONSTRAINT "HrErCasePartyViolation_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "HrErCaseParty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCasePartyViolation" ADD CONSTRAINT "HrErCasePartyViolation_violation_id_fkey" FOREIGN KEY ("violation_id") REFERENCES "HrErCaseViolation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCasePartyOffense" ADD CONSTRAINT "HrErCasePartyOffense_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "HrErCaseParty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCasePartyOffense" ADD CONSTRAINT "HrErCasePartyOffense_offense_id_fkey" FOREIGN KEY ("offense_id") REFERENCES "HrErCaseTypeOfOffense"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCasePartyAction" ADD CONSTRAINT "HrErCasePartyAction_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "HrErCaseParty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCasePartyAction" ADD CONSTRAINT "HrErCasePartyAction_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCasePartyAction" ADD CONSTRAINT "HrErCasePartyAction_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseNte" ADD CONSTRAINT "HrErCaseNte_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseNte" ADD CONSTRAINT "HrErCaseNte_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseNte" ADD CONSTRAINT "HrErCaseNte_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "HrErCaseParty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseExplanation" ADD CONSTRAINT "HrErCaseExplanation_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "HrErCaseParty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseHearing" ADD CONSTRAINT "HrErCaseHearing_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseHearing" ADD CONSTRAINT "HrErCaseHearing_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseHearing" ADD CONSTRAINT "HrErCaseHearing_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "HrErCaseParty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseHearingCommittee" ADD CONSTRAINT "HrErCaseHearingCommittee_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseHearingCommittee" ADD CONSTRAINT "HrErCaseHearingCommittee_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseHearingCommittee" ADD CONSTRAINT "HrErCaseHearingCommittee_hearing_id_fkey" FOREIGN KEY ("hearing_id") REFERENCES "HrErCaseHearing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseHearingCommittee" ADD CONSTRAINT "HrErCaseHearingCommittee_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseHearingDeliberation" ADD CONSTRAINT "HrErCaseHearingDeliberation_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseHearingDeliberation" ADD CONSTRAINT "HrErCaseHearingDeliberation_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseHearingDeliberation" ADD CONSTRAINT "HrErCaseHearingDeliberation_committee_id_fkey" FOREIGN KEY ("committee_id") REFERENCES "HrErCaseHearingCommittee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseHearingAttendee" ADD CONSTRAINT "HrErCaseHearingAttendee_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseHearingAttendee" ADD CONSTRAINT "HrErCaseHearingAttendee_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseHearingAttendee" ADD CONSTRAINT "HrErCaseHearingAttendee_hearing_id_fkey" FOREIGN KEY ("hearing_id") REFERENCES "HrErCaseHearing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseDecision" ADD CONSTRAINT "HrErCaseDecision_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseDecision" ADD CONSTRAINT "HrErCaseDecision_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseDecision" ADD CONSTRAINT "HrErCaseDecision_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "HrErCaseParty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseApproval" ADD CONSTRAINT "HrErCaseApproval_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseApproval" ADD CONSTRAINT "HrErCaseApproval_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseApproval" ADD CONSTRAINT "HrErCaseApproval_nte_id_fkey" FOREIGN KEY ("nte_id") REFERENCES "HrErCaseNte"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseApproval" ADD CONSTRAINT "HrErCaseApproval_decision_id_fkey" FOREIGN KEY ("decision_id") REFERENCES "HrErCaseDecision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseApproval" ADD CONSTRAINT "HrErCaseApproval_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseAttachment" ADD CONSTRAINT "HrErCaseAttachment_intake_id_fkey" FOREIGN KEY ("intake_id") REFERENCES "HrErCaseIntake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseAttachment" ADD CONSTRAINT "HrErCaseAttachment_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "HrErCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseAttachment" ADD CONSTRAINT "HrErCaseAttachment_nte_id_fkey" FOREIGN KEY ("nte_id") REFERENCES "HrErCaseNte"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseAttachment" ADD CONSTRAINT "HrErCaseAttachment_explanation_id_fkey" FOREIGN KEY ("explanation_id") REFERENCES "HrErCaseExplanation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseAttachment" ADD CONSTRAINT "HrErCaseAttachment_hearing_id_fkey" FOREIGN KEY ("hearing_id") REFERENCES "HrErCaseHearing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseAttachment" ADD CONSTRAINT "HrErCaseAttachment_decision_id_fkey" FOREIGN KEY ("decision_id") REFERENCES "HrErCaseDecision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseAttachment" ADD CONSTRAINT "HrErCaseAttachment_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseActivityLog" ADD CONSTRAINT "HrErCaseActivityLog_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "HrErCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseActivityLog" ADD CONSTRAINT "HrErCaseActivityLog_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "HrErCaseParty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseActivityLog" ADD CONSTRAINT "HrErCaseActivityLog_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseStageLog" ADD CONSTRAINT "HrErCaseStageLog_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "HrErCaseParty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtpVerification" ADD CONSTRAINT "OtpVerification_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtpVerification" ADD CONSTRAINT "OtpVerification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowAction" ADD CONSTRAINT "WorkflowAction_acted_by_fkey" FOREIGN KEY ("acted_by") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
