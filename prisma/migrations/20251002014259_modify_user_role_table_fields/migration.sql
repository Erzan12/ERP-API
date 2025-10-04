/*
  Warnings:

  - You are about to drop the column `moduleId` on the `RolePermission` table. All the data in the column will be lost.
  - You are about to drop the column `subModuleId` on the `RolePermission` table. All the data in the column will be lost.
  - Added the required column `sub_module_id` to the `RolePermission` table without a default value. This is not possible if the table is not empty.
  - Made the column `role_permission_id` on table `UserRole` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."RolePermission" DROP CONSTRAINT "RolePermission_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RolePermission" DROP CONSTRAINT "RolePermission_subModuleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RolePermission" DROP CONSTRAINT "RolePermission_sub_module_permission_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserRole" DROP CONSTRAINT "UserRole_department_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserRole" DROP CONSTRAINT "UserRole_role_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserRole" DROP CONSTRAINT "UserRole_role_permission_id_fkey";

-- AlterTable
ALTER TABLE "public"."RolePermission" DROP COLUMN "moduleId",
DROP COLUMN "subModuleId",
ADD COLUMN     "module_id" INTEGER,
ADD COLUMN     "sub_module_id" INTEGER NOT NULL,
ALTER COLUMN "sub_module_permission_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."UserRole" ALTER COLUMN "role_id" DROP NOT NULL,
ALTER COLUMN "department_id" DROP NOT NULL,
ALTER COLUMN "role_permission_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."RolePermission" ADD CONSTRAINT "RolePermission_sub_module_permission_id_fkey" FOREIGN KEY ("sub_module_permission_id") REFERENCES "public"."SubModulePermission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RolePermission" ADD CONSTRAINT "RolePermission_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "public"."Module"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RolePermission" ADD CONSTRAINT "RolePermission_sub_module_id_fkey" FOREIGN KEY ("sub_module_id") REFERENCES "public"."SubModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserRole" ADD CONSTRAINT "UserRole_role_permission_id_fkey" FOREIGN KEY ("role_permission_id") REFERENCES "public"."RolePermission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserRole" ADD CONSTRAINT "UserRole_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserRole" ADD CONSTRAINT "UserRole_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;
