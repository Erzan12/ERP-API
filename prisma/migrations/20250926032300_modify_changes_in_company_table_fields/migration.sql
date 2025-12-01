-- AlterTable
ALTER TABLE "public"."Company" ALTER COLUMN "stat" DROP NOT NULL,
ALTER COLUMN "fax_no" SET DATA TYPE TEXT;
