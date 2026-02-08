/*
  Warnings:

  - You are about to drop the `_RoleToUser` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[uuid]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `Department` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `Division` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `EmailAddress` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `EmploymentStatus` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `Module` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `PasswordResetToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `PermissionTemplate` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `PermissionTemplateDepartment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `PermissionTemplateRolePermission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `Person` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `Position` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `RolePermission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `SubModule` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `SubModuleAction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `SubModulePermission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `UserLocation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `UserPermission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `UserRole` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `UserToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `audit_logs` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_RoleToUser" DROP CONSTRAINT "_RoleToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_RoleToUser" DROP CONSTRAINT "_RoleToUser_B_fkey";

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "uuid" UUID;

-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "uuid" UUID;

-- AlterTable
ALTER TABLE "Division" ADD COLUMN     "uuid" UUID;

-- AlterTable
ALTER TABLE "EmailAddress" ADD COLUMN     "uuid" UUID;

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "uuid" UUID;

-- AlterTable
ALTER TABLE "EmploymentStatus" ADD COLUMN     "uuid" UUID;

-- AlterTable
ALTER TABLE "Module" ADD COLUMN     "uuid" UUID;

-- AlterTable
ALTER TABLE "PasswordResetToken" ADD COLUMN     "uuid" UUID;

-- AlterTable
ALTER TABLE "PermissionTemplate" ADD COLUMN     "uuid" UUID;

-- AlterTable
ALTER TABLE "PermissionTemplateDepartment" ADD COLUMN     "uuid" UUID;

-- AlterTable
ALTER TABLE "PermissionTemplateRolePermission" ADD COLUMN     "uuid" UUID;

-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "uuid" UUID;

-- AlterTable
ALTER TABLE "Position" ADD COLUMN     "uuid" UUID;

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "uuid" UUID;

-- AlterTable
ALTER TABLE "RolePermission" ADD COLUMN     "uuid" UUID;

-- AlterTable
ALTER TABLE "SubModule" ADD COLUMN     "uuid" UUID;

-- AlterTable
ALTER TABLE "SubModuleAction" ADD COLUMN     "uuid" UUID;

-- AlterTable
ALTER TABLE "SubModulePermission" ADD COLUMN     "uuid" UUID;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "uuid" UUID;

-- AlterTable
ALTER TABLE "UserLocation" ADD COLUMN     "uuid" UUID;

-- AlterTable
ALTER TABLE "UserPermission" ADD COLUMN     "uuid" UUID;

-- AlterTable
ALTER TABLE "UserRole" ADD COLUMN     "uuid" UUID;

-- AlterTable
ALTER TABLE "UserToken" ADD COLUMN     "uuid" UUID;

-- AlterTable
ALTER TABLE "audit_logs" ADD COLUMN     "uuid" UUID;

-- DropTable
DROP TABLE "_RoleToUser";

-- CreateIndex
CREATE UNIQUE INDEX "Company_uuid_key" ON "Company"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Department_uuid_key" ON "Department"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Division_uuid_key" ON "Division"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "EmailAddress_uuid_key" ON "EmailAddress"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_uuid_key" ON "Employee"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "EmploymentStatus_uuid_key" ON "EmploymentStatus"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Module_uuid_key" ON "Module"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_uuid_key" ON "PasswordResetToken"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "PermissionTemplate_uuid_key" ON "PermissionTemplate"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "PermissionTemplateDepartment_uuid_key" ON "PermissionTemplateDepartment"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "PermissionTemplateRolePermission_uuid_key" ON "PermissionTemplateRolePermission"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Person_uuid_key" ON "Person"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Position_uuid_key" ON "Position"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Role_uuid_key" ON "Role"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_uuid_key" ON "RolePermission"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "SubModule_uuid_key" ON "SubModule"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "SubModuleAction_uuid_key" ON "SubModuleAction"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "SubModulePermission_uuid_key" ON "SubModulePermission"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "User_uuid_key" ON "User"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "UserLocation_uuid_key" ON "UserLocation"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "UserPermission_uuid_key" ON "UserPermission"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_uuid_key" ON "UserRole"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "UserToken_uuid_key" ON "UserToken"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "audit_logs_uuid_key" ON "audit_logs"("uuid");
