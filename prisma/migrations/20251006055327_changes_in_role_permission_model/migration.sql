/*
  Warnings:

  - You are about to drop the column `module_id` on the `RolePermission` table. All the data in the column will be lost.
  - You are about to drop the column `sub_module_id` on the `RolePermission` table. All the data in the column will be lost.
  - Made the column `sub_module_permission_id` on table `RolePermission` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."RolePermission" DROP CONSTRAINT "RolePermission_module_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."RolePermission" DROP CONSTRAINT "RolePermission_sub_module_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."RolePermission" DROP CONSTRAINT "RolePermission_sub_module_permission_id_fkey";

-- AlterTable
ALTER TABLE "public"."RolePermission" DROP COLUMN "module_id",
DROP COLUMN "sub_module_id",
ALTER COLUMN "sub_module_permission_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."RolePermission" ADD CONSTRAINT "RolePermission_sub_module_permission_id_fkey" FOREIGN KEY ("sub_module_permission_id") REFERENCES "public"."SubModulePermission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
