/*
  Warnings:

  - Made the column `sub_module_permission_id` on table `RolePermission` required. This step will fail if there are existing NULL values in that column.
  - Made the column `role_name` on table `RolePermission` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."RolePermission" DROP CONSTRAINT "RolePermission_sub_module_permission_id_fkey";

-- AlterTable
ALTER TABLE "public"."RolePermission" ALTER COLUMN "sub_module_permission_id" SET NOT NULL,
ALTER COLUMN "role_name" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."RolePermission" ADD CONSTRAINT "RolePermission_sub_module_permission_id_fkey" FOREIGN KEY ("sub_module_permission_id") REFERENCES "public"."SubModulePermission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
