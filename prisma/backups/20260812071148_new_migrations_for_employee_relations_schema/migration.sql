-- CreateEnum
CREATE TYPE "HrErNteServiceChannel" AS ENUM ('nra_office', 'personal', 'postal_mail');

-- CreateEnum
CREATE TYPE "HrErExplanationChannel" AS ENUM ('viber', 'email', 'letter', 'did_not_proceed');

-- CreateEnum
CREATE TYPE "HrErExplanationStatus" AS ENUM ('awaiting_response', 'received', 'no_response');

-- CreateEnum
CREATE TYPE "HrErHearingChannel" AS ENUM ('in_person', 'online', 'viber', 'postal_mail', 'call', 'text');

-- CreateEnum
CREATE TYPE "HrErHearingStatus" AS ENUM ('scheduled', 'conducted', 'rescheduled');

-- AlterEnum
ALTER TYPE "HrErDecisionType" ADD VALUE 'rehabilitation';

-- AlterTable
ALTER TABLE "HrErCase" ADD COLUMN     "closing_remarks" TEXT,
ADD COLUMN     "incident_narrative" TEXT;

-- AlterTable
ALTER TABLE "HrErCaseNte" ADD COLUMN     "reference_number" TEXT,
ADD COLUMN     "service_channel" "HrErNteServiceChannel";

-- AlterTable
ALTER TABLE "HrErCaseParty" ADD COLUMN     "stage" "HrErCaseStage",
ADD COLUMN     "stage_started_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "HrErCaseStageLog" ADD COLUMN     "hrErCasePartyId" UUID;

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
    "minutes_file_url" TEXT,
    "remarks" TEXT,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HrErCaseHearing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrErCaseActivityLog" (
    "id" UUID NOT NULL,
    "case_id" UUID NOT NULL,
    "party_id" UUID,
    "actor_id" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "metadata" JSONB,
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HrErCaseActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HrErCaseExplanation_party_id_key" ON "HrErCaseExplanation"("party_id");

-- CreateIndex
CREATE INDEX "HrErCaseHearing_party_id_idx" ON "HrErCaseHearing"("party_id");

-- CreateIndex
CREATE INDEX "HrErCaseActivityLog_case_id_idx" ON "HrErCaseActivityLog"("case_id");

-- AddForeignKey
ALTER TABLE "HrErCaseExplanation" ADD CONSTRAINT "HrErCaseExplanation_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "HrErCaseParty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseHearing" ADD CONSTRAINT "HrErCaseHearing_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "HrErCaseParty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseActivityLog" ADD CONSTRAINT "HrErCaseActivityLog_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "HrErCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseActivityLog" ADD CONSTRAINT "HrErCaseActivityLog_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "HrErCaseParty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseActivityLog" ADD CONSTRAINT "HrErCaseActivityLog_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseStageLog" ADD CONSTRAINT "HrErCaseStageLog_hrErCasePartyId_fkey" FOREIGN KEY ("hrErCasePartyId") REFERENCES "HrErCaseParty"("id") ON DELETE SET NULL ON UPDATE CASCADE;
