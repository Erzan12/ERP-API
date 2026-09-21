-- DropForeignKey
ALTER TABLE "HrErCase" DROP CONSTRAINT "HrErCase_company_id_fkey";

-- AlterTable
ALTER TABLE "HrErCase" ALTER COLUMN "company_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "HrErCase" ADD CONSTRAINT "HrErCase_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
