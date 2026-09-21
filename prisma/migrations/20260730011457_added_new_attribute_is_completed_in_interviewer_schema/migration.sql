-- AlterEnum
ALTER TYPE "InterviewStage" ADD VALUE 'completed';

-- AlterTable
ALTER TABLE "Interviewer" ADD COLUMN     "is_completed" BOOLEAN NOT NULL DEFAULT false;
