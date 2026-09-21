-- CreateEnum
CREATE TYPE "HrErCasePartyRole" AS ENUM ('respondent', 'complainant', 'witness');

-- CreateEnum
CREATE TYPE "HrErCaseLevel" AS ENUM ('minor', 'major');

-- CreateEnum
CREATE TYPE "HrErCaseStage" AS ENUM ('notice_to_explain', 'written_explanation', 'administrative_hearing', 'notice_of_decision', 'case_closed');

-- CreateEnum
CREATE TYPE "HrErCaseStatus" AS ENUM ('open', 'closed');

-- CreateEnum
CREATE TYPE "HrErIntakeStatus" AS ENUM ('pending_review', 'converted', 'ignored');

-- CreateEnum
CREATE TYPE "HrErApprovalStepType" AS ENUM ('nte_review', 'decision_approval');

-- CreateEnum
CREATE TYPE "HrErApprovalStatus" AS ENUM ('pending', 'approved', 'revise', 'rejected');

-- CreateEnum
CREATE TYPE "HrErActionType" AS ENUM ('preventive_suspension');

-- CreateEnum
CREATE TYPE "HrErDecisionType" AS ENUM ('written_reprimand', 'stern_warning', 'suspension_7d', 'suspension_15d', 'dismissal', 'acquitted');

-- CreateTable
CREATE TABLE "HrErCaseIntake" (
    "id" UUID NOT NULL,
    "reported_by" UUID NOT NULL,
    "incident_narrative" TEXT NOT NULL,
    "incident_date" TIMESTAMP(3),
    "status" "HrErIntakeStatus" NOT NULL DEFAULT 'pending_review',
    "case_id" UUID,
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
CREATE TABLE "HrErCase" (
    "id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "control_number" INTEGER NOT NULL,
    "case_code" TEXT NOT NULL,
    "incident_location" TEXT NOT NULL,
    "assigned_location" TEXT,
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
CREATE TABLE "HrErCaseStageLog" (
    "id" UUID NOT NULL,
    "case_id" UUID NOT NULL,
    "stage" "HrErCaseStage" NOT NULL,
    "sla_days" INTEGER NOT NULL,
    "entered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exited_at" TIMESTAMP(3),

    CONSTRAINT "HrErCaseStageLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrErCaseParty" (
    "id" UUID NOT NULL,
    "case_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "role" "HrErCasePartyRole" NOT NULL,
    "level" "HrErCaseLevel",
    "remarks" TEXT,
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
CREATE TABLE "HrErCasePartyAction" (
    "id" UUID NOT NULL,
    "party_id" UUID NOT NULL,
    "action_type" "HrErActionType" NOT NULL,
    "effectivity_start" TIMESTAMP(3) NOT NULL,
    "effectivity_end" TIMESTAMP(3) NOT NULL,
    "remarks" TEXT,
    "created_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HrErCasePartyAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrErCaseNte" (
    "id" UUID NOT NULL,
    "party_id" UUID NOT NULL,
    "issued_at" TIMESTAMP(3),
    "due_date" TIMESTAMP(3),
    "form_url" TEXT,
    "status" "HrErApprovalStatus" NOT NULL DEFAULT 'pending',
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HrErCaseNte_pkey" PRIMARY KEY ("id")
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
    "status" "HrErApprovalStatus" NOT NULL DEFAULT 'pending',
    "remarks" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "sequence" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HrErCaseApproval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrErCaseAttachment" (
    "id" UUID NOT NULL,
    "intake_id" UUID,
    "case_id" UUID,
    "file_name" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_type" TEXT,
    "uploaded_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HrErCaseAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SequenceCounter" (
    "id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "sequence_key" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "last_number" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SequenceCounter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HrErCaseIntake_case_id_key" ON "HrErCaseIntake"("case_id");

-- CreateIndex
CREATE INDEX "HrErCaseIntake_status_idx" ON "HrErCaseIntake"("status");

-- CreateIndex
CREATE INDEX "HrErCaseIntakeParty_intake_id_idx" ON "HrErCaseIntakeParty"("intake_id");

-- CreateIndex
CREATE UNIQUE INDEX "HrErCaseIntakeParty_intake_id_employee_id_role_key" ON "HrErCaseIntakeParty"("intake_id", "employee_id", "role");

-- CreateIndex
CREATE UNIQUE INDEX "HrErCaseIntakeViolation_intake_id_violation_id_key" ON "HrErCaseIntakeViolation"("intake_id", "violation_id");

-- CreateIndex
CREATE UNIQUE INDEX "HrErCase_case_code_key" ON "HrErCase"("case_code");

-- CreateIndex
CREATE INDEX "HrErCase_stage_idx" ON "HrErCase"("stage");

-- CreateIndex
CREATE INDEX "HrErCase_status_idx" ON "HrErCase"("status");

-- CreateIndex
CREATE UNIQUE INDEX "HrErCase_company_id_control_number_key" ON "HrErCase"("company_id", "control_number");

-- CreateIndex
CREATE INDEX "HrErCaseStageLog_case_id_idx" ON "HrErCaseStageLog"("case_id");

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
CREATE INDEX "HrErCasePartyAction_party_id_idx" ON "HrErCasePartyAction"("party_id");

-- CreateIndex
CREATE UNIQUE INDEX "HrErCaseNte_party_id_key" ON "HrErCaseNte"("party_id");

-- CreateIndex
CREATE UNIQUE INDEX "HrErCaseDecision_party_id_key" ON "HrErCaseDecision"("party_id");

-- CreateIndex
CREATE INDEX "HrErCaseApproval_nte_id_idx" ON "HrErCaseApproval"("nte_id");

-- CreateIndex
CREATE INDEX "HrErCaseApproval_decision_id_idx" ON "HrErCaseApproval"("decision_id");

-- CreateIndex
CREATE INDEX "HrErCaseAttachment_intake_id_idx" ON "HrErCaseAttachment"("intake_id");

-- CreateIndex
CREATE INDEX "HrErCaseAttachment_case_id_idx" ON "HrErCaseAttachment"("case_id");

-- CreateIndex
CREATE INDEX "SequenceCounter_company_id_idx" ON "SequenceCounter"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "SequenceCounter_company_id_sequence_key_year_key" ON "SequenceCounter"("company_id", "sequence_key", "year");

-- AddForeignKey
ALTER TABLE "HrErCaseIntake" ADD CONSTRAINT "HrErCaseIntake_reported_by_fkey" FOREIGN KEY ("reported_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseIntake" ADD CONSTRAINT "HrErCaseIntake_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseIntake" ADD CONSTRAINT "HrErCaseIntake_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseIntake" ADD CONSTRAINT "HrErCaseIntake_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "HrErCase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseIntakeParty" ADD CONSTRAINT "HrErCaseIntakeParty_intake_id_fkey" FOREIGN KEY ("intake_id") REFERENCES "HrErCaseIntake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseIntakeParty" ADD CONSTRAINT "HrErCaseIntakeParty_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseIntakeViolation" ADD CONSTRAINT "HrErCaseIntakeViolation_intake_id_fkey" FOREIGN KEY ("intake_id") REFERENCES "HrErCaseIntake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseIntakeViolation" ADD CONSTRAINT "HrErCaseIntakeViolation_violation_id_fkey" FOREIGN KEY ("violation_id") REFERENCES "HrErCaseViolation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCase" ADD CONSTRAINT "HrErCase_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCase" ADD CONSTRAINT "HrErCase_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCase" ADD CONSTRAINT "HrErCase_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseStageLog" ADD CONSTRAINT "HrErCaseStageLog_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "HrErCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "HrErCasePartyAction" ADD CONSTRAINT "HrErCasePartyAction_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "HrErCaseParty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCasePartyAction" ADD CONSTRAINT "HrErCasePartyAction_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseNte" ADD CONSTRAINT "HrErCaseNte_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseNte" ADD CONSTRAINT "HrErCaseNte_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseNte" ADD CONSTRAINT "HrErCaseNte_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "HrErCaseParty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseDecision" ADD CONSTRAINT "HrErCaseDecision_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseDecision" ADD CONSTRAINT "HrErCaseDecision_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseDecision" ADD CONSTRAINT "HrErCaseDecision_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "HrErCaseParty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "HrErCaseAttachment" ADD CONSTRAINT "HrErCaseAttachment_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SequenceCounter" ADD CONSTRAINT "SequenceCounter_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
