/*
  Warnings:

  - You are about to drop the column `stat` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `stat` on the `Department` table. All the data in the column will be lost.
  - You are about to drop the column `stat` on the `Division` table. All the data in the column will be lost.
  - You are about to drop the column `stat` on the `Module` table. All the data in the column will be lost.
  - You are about to drop the column `is_used` on the `PasswordResetToken` table. All the data in the column will be lost.
  - You are about to drop the column `stat` on the `PermissionTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `stat` on the `Position` table. All the data in the column will be lost.
  - You are about to drop the column `stat` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `stat` on the `RolePermission` table. All the data in the column will be lost.
  - You are about to drop the column `stat` on the `SubModule` table. All the data in the column will be lost.
  - You are about to drop the column `stat` on the `SubModuleAction` table. All the data in the column will be lost.
  - You are about to drop the column `stat` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `stat` on the `UserLocation` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `UserToken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "stat",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Department" DROP COLUMN "stat",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Division" DROP COLUMN "stat",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "EmploymentStatus" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Module" DROP COLUMN "stat",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "PasswordResetToken" DROP COLUMN "is_used",
ADD COLUMN     "isUsed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PermissionTemplate" DROP COLUMN "stat",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Position" DROP COLUMN "stat",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "stat",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "RolePermission" DROP COLUMN "stat",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "SubModule" DROP COLUMN "stat",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "SubModuleAction" DROP COLUMN "stat",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "stat",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "UserLocation" DROP COLUMN "stat",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "UserToken" DROP COLUMN "status",
ADD COLUMN     "isUsed" BOOLEAN NOT NULL DEFAULT false;
