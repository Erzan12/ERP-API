-- DropIndex
DROP INDEX "public"."Company_company_tin_key";

-- AlterTable
ALTER TABLE "public"."Company" ALTER COLUMN "abbreviation" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "company_tin" SET DATA TYPE TEXT;
