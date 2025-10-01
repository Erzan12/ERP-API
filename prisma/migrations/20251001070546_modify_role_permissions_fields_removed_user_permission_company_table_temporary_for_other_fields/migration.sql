/*
  Warnings:

  - You are about to drop the column `module_id` on the `RolePermission` table. All the data in the column will be lost.
  - You are about to drop the column `sub_module_id` on the `RolePermission` table. All the data in the column will be lost.
  - You are about to drop the `UserPermissionCompany` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[role_id,sub_module_permission_id,action]` on the table `RolePermission` will be added. If there are existing duplicate values, this will fail.
  - Made the column `sub_module_permission_id` on table `RolePermission` required. This step will fail if there are existing NULL values in that column.
  - Made the column `added_sub_mod_permission_id` on table `SubModulePermission` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."RolePermission" DROP CONSTRAINT "RolePermission_module_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."RolePermission" DROP CONSTRAINT "RolePermission_sub_module_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."RolePermission" DROP CONSTRAINT "RolePermission_sub_module_permission_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."SubModulePermission" DROP CONSTRAINT "SubModulePermission_added_sub_mod_permission_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserPermissionCompany" DROP CONSTRAINT "UserPermissionCompany_company_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserPermissionCompany" DROP CONSTRAINT "UserPermissionCompany_user_permission_id_fkey";

-- DropIndex
DROP INDEX "public"."role_sub_module_module_action_unique";

-- AlterTable
ALTER TABLE "public"."RolePermission" DROP COLUMN "module_id",
DROP COLUMN "sub_module_id",
ADD COLUMN     "moduleId" INTEGER,
ADD COLUMN     "role_name" TEXT,
ADD COLUMN     "subModuleId" INTEGER,
ALTER COLUMN "sub_module_permission_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."SubModulePermission" ALTER COLUMN "added_sub_mod_permission_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."UserPermission" ALTER COLUMN "user_role_permission" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."UserRole" ADD COLUMN     "role_name" TEXT,
ADD COLUMN     "role_permission_id" INTEGER;

-- DropTable
DROP TABLE "public"."UserPermissionCompany";

-- CreateIndex
CREATE UNIQUE INDEX "unique_role_permission" ON "public"."RolePermission"("role_id", "sub_module_permission_id", "action");

-- AddForeignKey
ALTER TABLE "public"."SubModulePermission" ADD CONSTRAINT "SubModulePermission_added_sub_mod_permission_id_fkey" FOREIGN KEY ("added_sub_mod_permission_id") REFERENCES "public"."AddedSubModPermission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RolePermission" ADD CONSTRAINT "RolePermission_sub_module_permission_id_fkey" FOREIGN KEY ("sub_module_permission_id") REFERENCES "public"."SubModulePermission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RolePermission" ADD CONSTRAINT "RolePermission_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "public"."Module"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RolePermission" ADD CONSTRAINT "RolePermission_subModuleId_fkey" FOREIGN KEY ("subModuleId") REFERENCES "public"."SubModule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserRole" ADD CONSTRAINT "UserRole_role_permission_id_fkey" FOREIGN KEY ("role_permission_id") REFERENCES "public"."RolePermission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
