/*
  Warnings:

  - Made the column `abbreviation` on table `Company` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Company" ADD COLUMN     "fax_no" INTEGER,
ALTER COLUMN "abbreviation" SET NOT NULL;
