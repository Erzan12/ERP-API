/*
  Warnings:

  - You are about to drop the column `department_id` on the `UserRole` table. All the data in the column will be lost.
  - You are about to drop the column `module_id` on the `UserRole` table. All the data in the column will be lost.
  - You are about to drop the `_ModuleToUsers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserToPermissionTemplates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserToRoles` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id,role_id]` on the table `UserRole` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."UserRole" DROP CONSTRAINT "UserRole_department_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserRole" DROP CONSTRAINT "UserRole_module_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ModuleToUsers" DROP CONSTRAINT "_ModuleToUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ModuleToUsers" DROP CONSTRAINT "_ModuleToUsers_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_UserToPermissionTemplates" DROP CONSTRAINT "_UserToPermissionTemplates_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_UserToPermissionTemplates" DROP CONSTRAINT "_UserToPermissionTemplates_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_UserToRoles" DROP CONSTRAINT "_UserToRoles_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_UserToRoles" DROP CONSTRAINT "_UserToRoles_B_fkey";

-- DropIndex
DROP INDEX "public"."UserRole_user_id_role_id_module_id_key";

-- AlterTable
ALTER TABLE "public"."UserRole" DROP COLUMN "department_id",
DROP COLUMN "module_id";

-- DropTable
DROP TABLE "public"."_ModuleToUsers";

-- DropTable
DROP TABLE "public"."_UserToPermissionTemplates";

-- DropTable
DROP TABLE "public"."_UserToRoles";

-- CreateTable
CREATE TABLE "public"."_RoleToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_RoleToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_RoleToUser_B_index" ON "public"."_RoleToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_user_id_role_id_key" ON "public"."UserRole"("user_id", "role_id");

-- AddForeignKey
ALTER TABLE "public"."_RoleToUser" ADD CONSTRAINT "_RoleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_RoleToUser" ADD CONSTRAINT "_RoleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
