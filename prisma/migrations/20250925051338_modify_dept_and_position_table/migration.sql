/*
  Warnings:

  - Made the column `is_top_20000` on table `Company` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Department" ALTER COLUMN "stat" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Position" ALTER COLUMN "stat" DROP NOT NULL;
