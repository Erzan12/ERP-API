/*
  Warnings:

  - You are about to drop the column `isActive` on the `Applicant` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `CareerPosting` table. All the data in the column will be lost.
  - The `status` column on the `CareerPosting` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `isActive` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Department` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Division` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `EmploymentStatus` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Module` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `PermissionTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Position` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `RolePermission` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `SubModule` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `SubModuleAction` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `UserLocation` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `UserRole` table. All the data in the column will be lost.
  - Changed the type of `application_source` on the `Applicant` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `application_status` on the `Applicant` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Applicant" DROP COLUMN "isActive",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
DROP COLUMN "application_source",
ADD COLUMN     "application_source" "ApplicationSource" NOT NULL,
DROP COLUMN "application_status",
ADD COLUMN     "application_status" "ApplicationStatus" NOT NULL;

-- AlterTable
ALTER TABLE "CareerPosting" DROP COLUMN "isActive",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
DROP COLUMN "status",
ADD COLUMN     "status" "CareerPosingStatus" NOT NULL DEFAULT 'draft';

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "isActive",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Department" DROP COLUMN "isActive",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Division" DROP COLUMN "isActive",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "EmploymentStatus" DROP COLUMN "isActive",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Module" DROP COLUMN "isActive",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "PermissionTemplate" DROP COLUMN "isActive",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Position" DROP COLUMN "isActive",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "isActive",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "RolePermission" DROP COLUMN "isActive",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "SubModule" DROP COLUMN "isActive",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "SubModuleAction" DROP COLUMN "isActive",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isActive",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "UserLocation" DROP COLUMN "isActive",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "UserRole" DROP COLUMN "isActive",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;
