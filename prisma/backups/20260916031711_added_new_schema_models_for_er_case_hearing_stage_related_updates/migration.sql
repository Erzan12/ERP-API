-- CreateEnum
CREATE TYPE "HrErRecommendedPenalty" AS ENUM ('acquitted', 'written_reprimand', 'stern_warning', 'suspension', 'dismissal');

-- AlterTable
ALTER TABLE "HrErCaseHearing" ADD COLUMN     "minutes_ended_at" TIMESTAMP(3),
ADD COLUMN     "minutes_started_at" TIMESTAMP(3),
ADD COLUMN     "respondent_statement" TEXT,
ADD COLUMN     "scheduled_end_at" TIMESTAMP(3),
ADD COLUMN     "scheduled_start_at" TIMESTAMP(3);

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

-- CreateIndex
CREATE INDEX "HrErCaseHearingCommittee_hearing_id_idx" ON "HrErCaseHearingCommittee"("hearing_id");

-- CreateIndex
CREATE UNIQUE INDEX "HrErCaseHearingCommittee_hearing_id_employee_id_key" ON "HrErCaseHearingCommittee"("hearing_id", "employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "HrErCaseHearingDeliberation_committee_id_key" ON "HrErCaseHearingDeliberation"("committee_id");

-- CreateIndex
CREATE INDEX "HrErCaseHearingAttendee_hearing_id_idx" ON "HrErCaseHearingAttendee"("hearing_id");

-- AddForeignKey
ALTER TABLE "HrErCaseHearing" ADD CONSTRAINT "HrErCaseHearing_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseHearing" ADD CONSTRAINT "HrErCaseHearing_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
