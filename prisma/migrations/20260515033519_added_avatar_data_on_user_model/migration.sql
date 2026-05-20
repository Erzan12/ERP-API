-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT;

ALTER TABLE "HrLeaveDates"
ALTER COLUMN "leave_compensation" DROP DEFAULT;
