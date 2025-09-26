-- AlterTable
ALTER TABLE "public"."Company" ALTER COLUMN "abbreviation" DROP NOT NULL,
ALTER COLUMN "company_tin" DROP NOT NULL;

-- RenameIndex
ALTER INDEX "public"."Company_company_code_key" RENAME TO "Company_company_tin_key";
