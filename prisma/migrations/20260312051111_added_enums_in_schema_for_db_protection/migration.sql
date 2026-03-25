/*
  Warnings:

  - Changed the type of `slots` on the `CareerPosting` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "CivilStatus" AS ENUM ('single', 'married', 'separated', 'widowed');

-- CreateEnum
CREATE TYPE "StatusEnum" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "CareerPosingStatus" AS ENUM ('draft', 'submitted', 'verified', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('full_time', 'part_time');

-- CreateEnum
CREATE TYPE "EmployeeType" AS ENUM ('land_based', 'sea_based');

-- AlterTable
ALTER TABLE "CareerPosting" DROP COLUMN "slots",
ADD COLUMN     "slots" INTEGER NOT NULL;
