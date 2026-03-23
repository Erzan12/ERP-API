-- AlterTable
ALTER TABLE "CareerPosting" ALTER COLUMN "job_description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ExaminationRating" ADD COLUMN     "result" TEXT;
