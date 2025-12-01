/*
  Warnings:

  - Made the column `is_top_20000` on table `Company` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Company" ALTER COLUMN "is_top_20000" SET NOT NULL;
